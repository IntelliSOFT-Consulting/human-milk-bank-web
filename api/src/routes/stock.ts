import express, { Request, Response } from "express";
import { requireJWTMiddleware as requireJWT, decodeSession } from "../lib/jwt";
import db from '../lib/prisma'
import { FhirApi } from "../lib/fhir";

const router = express.Router()
router.use(express.json())



//create a stock entry
router.post("/", [requireJWT], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || '';
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1])
        if (decodedSession.type == 'valid') {
            let userId = decodedSession.session.userId
            let { preterm, term } = req.body;
            if (Object.keys(preterm).indexOf("pasteurized") < 0 || Object.keys(preterm).indexOf("unPasteurized") < 0) {
                res.json({ status: "error", message: "pasteurized and unPasteurized required in field *term*" })
                return
            }
            if (Object.keys(term).indexOf("pasteurized") < 0 || Object.keys(term).indexOf("unPasteurized") < 0) {
                res.json({ status: "error", message: "pasteurized and unPasteurized required in field *term*" })
                return
            }
            if (preterm) {
                let pretermEntry = await db.stockEntry.create({
                    data: {
                        pasteurized: parseFloat(preterm.pasteurized), unPasteurized: parseFloat(preterm.unPasteurized),
                        dhmType: "Preterm", user: { connect: { id: userId } }
                    }
                })
            }
            if (term) {
                let termEntry = await db.stockEntry.create({
                    data: {
                        pasteurized: parseFloat(preterm.pasteurized), unPasteurized: parseFloat(preterm.unPasteurized),
                        dhmType: "Term", user: { connect: { id: userId } }
                    }
                })
            }
            res.json({ status: "success", message: "Stock entry created successfully" })
            return
        }
    } catch (error) {
        console.error(error)
        res.statusCode = 400
        res.json({ error, status: "error" });
        return
    }
});

// Get all active orders
router.get("/orders", async (req: Request, res: Response) => {

    // router.get("/orders", [requireJWT], async (req: Request, res: Response) => {
    try {
        let activeOrders = (await FhirApi({ "url": "/NutritionOrder?status=active" })).data?.entry || [];
        let results = []
        for (let order of activeOrders) {
            let resource = order.resource
            let patient = (await FhirApi({ "url": "/" + resource.patient.reference })).data
            let mother = (await FhirApi({ "url": "/" + "Patient" + `?link=${patient.id}` })).data.entry[0].resource
            let response: any = {
                orderId: resource.id,
                patientId: patient.id,
                motherIp: mother.id,
                motherName: (mother.name[0].family + " " + mother.name[0].given[0]),
                babyName: (patient.name[0].family + " " + patient.name[0].given[0]),
                babyAge: Math.floor((new Date().getTime() - new Date(patient.birthDate).getTime()) / (1000 * 60 * 60 * 24)),
                consentGiven: "",
                dhmType: "",
                dhmReason: "",
                dhmVolume: ""
            }
            let encounterObservations = (await FhirApi({ "url": "/" + resource.encounter.reference + "/$everything?_count=10000" })).data?.entry || [];
            // console.log(encounterObservations)
            // change this //
            let observationCodes: any = {
                dhmType: "DHM-Type",
                dhmReason: "DHM-Reason",
                dhmVolume: "DHM-Volume",
                consentGiven: "Consent-Given"
            }
            for (let o of encounterObservations) {
                // console.log(o)
                for (let x of Object.keys(observationCodes)) {
                    if (Object.keys(o.resource).indexOf("code") > -1 && o.resource.code.coding[0].code === observationCodes[x]) {
                        response[x] = o.resource.valueString || o.resource.valueQuantity.value || null
                    }
                }
            }
            results.push(response)
        }
        res.json({ status: "success", data: results })
        return
    } catch (error) {
        console.log(error)
        res.statusCode = 401
        res.json({ error: JSON.stringify(error), status: "error" });
        return
    }
});


// Process or dispense order
router.post("/order", [requireJWT], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || '';
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1])
        if (decodedSession.type == 'valid') {
            let userId = decodedSession.session.userId
            let { dhmType, remarks, orderId, dhmVolume, category } = req.body;
            if (category !== "UnPasteurized" && category !== "Pasteurized") {
                res.statusCode = 400
                res.json({ error: "Invalid category provided", status: "false" });
                return
            }
            if (!remarks || !orderId || !dhmType || !dhmVolume) {
                res.statusCode = 400
                res.json({ error: "provide all required fields: (dhmType, remarks, orderId, dhmVolume, category)", status: "false" });
                return
            }
            if (!(parseFloat(dhmVolume))) {
                res.statusCode = 400
                res.json({ error: "Invalid value for volume provided", status: "false" });
                return
            }
            dhmVolume = parseFloat(dhmVolume)
            // find nutrition order
            let resource = await (await FhirApi({ "url": `/NutritionOrder/${orderId}` })).data
            resource.status = "completed"

            // total volume dispensed after last closing stock...

            let lastClosingStock = await db.stockEntry.findMany({
                select: {
                    updatedAt: true,
                    pasteurized: (category === "Pasteurized"),
                    unPasteurized: (category === "UnPasteurized"),
                    dhmType
                },
                where: {
                    dhmType: dhmType
                },
                orderBy: { updatedAt: 'desc' },
                take: 1,
            })
            if (!lastClosingStock) {
                res.json({ error: "Stock entry required before dispense", status: "false" });
                return
            }
            // console.log(userId)
            console.log(lastClosingStock, dhmType)

            let totalVolumeDispensed = await db.order.aggregate({
                _sum: {
                    pasteurized: true,
                    unPasteurized: true
                },
                where: {
                    dhmType: dhmType,
                    status: "Dispensed",
                    updatedAt: {
                        gt: lastClosingStock[0].updatedAt
                    }
                }
            })
            console.log(totalVolumeDispensed)

            if (lastClosingStock[0][(category === "Pasteurized") ? "pasteurized" : "unPasteurized"] <
                ((totalVolumeDispensed._sum[(category === "Pasteurized") ? "pasteurized" : "unPasteurized"] || 0) + (dhmVolume))) {
                res.json({ error: "No DHM in stock available to dispense", status: "false" });
                return
            }

            let order = await db.order.create({
                data: {
                    dhmType, pasteurized: parseFloat(((category === "Pasteurized") ? dhmVolume : "0")),
                    unPasteurized: parseFloat(((category === "UnPasteurized") ? dhmVolume : "0")), remarks, status: "Dispensed",
                    user: { connect: { id: userId } }, nutritionOrder: orderId
                }
            })
            // update fhir resource
            let resp = await (await FhirApi({ "url": `/NutritionOrder/${orderId}`, method: "PUT", data: JSON.stringify(resource) })).data
            // console.log(resp)
            res.json({ status: "success", message: "Order processed successfully", id: order.id })
            return
        }
    } catch (error) {
        console.error(error)
        res.statusCode = 400
        res.json({ error, status: "false" });
        return
    }
});


export default router