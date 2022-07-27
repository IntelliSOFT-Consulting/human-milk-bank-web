import express, { Request, Response } from "express";
import { requireJWTMiddleware as requireJWT, encodeSession, decodeSession } from "../lib/jwt";
import db from '../lib/prisma'
import { FhirApi } from "../lib/fhir";

const router = express.Router()
router.use(express.json())

// role based access?? which users


//create a stock entry
router.post("/", [requireJWT], async (req: Request, res: Response) => {
    try {
        let token = req.headers.authorization || '';
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(' ')[1])
        if (decodedSession.type == 'valid') {
            let userId = decodedSession.session.userId
            let { unPasteurized, pasteurized, dhmType } = req.body;
            unPasteurized = parseFloat(unPasteurized)
            pasteurized = parseFloat(pasteurized)
            let entry = await db.stockEntry.create({
                data: {
                    pasteurized: parseFloat(pasteurized), unPasteurized: parseFloat(unPasteurized),
                    dhmType, dhmVolume: (pasteurized + unPasteurized),
                    userId: userId
                }
            })
            res.json({ status: "success", message: "Stock Entry created successfully", id: entry.id })
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
                motherName: mother.name[0].family + " " + mother.name[0].given,
                babyName: patient.name[0].family + " " + patient.name[0].given,
                babyAge: ((new Date().getTime() - new Date(patient.birthDate).getTime()) / (1000 * 60 * 60 * 24), 10),
                consentGiven: "",
                dhmType: "",
                dhmReason: "",
                dhmVolume: ""
            }
            let encounterObservations = (await FhirApi({ "url": "/" + resource.encounter.reference + "/$everything?_count=10000" })).data?.entry || [];
            // console.log(encounterObservations)
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
            let { dhmType, dhmVolume, remarks, orderId } = req.body;
            dhmVolume = parseFloat(dhmVolume)

            // total volume dispensed after last closing stock...

            let lastClosingStock = await db.stockEntry.findMany({
                select: { updatedAt: true, dhmVolume: true },
                where: { dhmType: dhmType },
                orderBy: { updatedAt: 'desc' },
                take: 1,
            })
            console.log(lastClosingStock)

            let totalVolumeDispensed = await db.order.aggregate({
                _sum: {
                    dhmVolume: true
                },
                where: {
                    status: "Dispensed",
                    updatedAt: {
                        gt: lastClosingStock[0].updatedAt
                    }
                }
            })

            if (lastClosingStock[0].dhmVolume <= (totalVolumeDispensed._sum.dhmVolume || 0 + dhmVolume)) {
                res.json({ error: "No DHM in stock available to dispense", status: "false" });
                return
            }

            let order = await db.order.create({
                data: {
                    dhmType, dhmVolume: dhmVolume, remarks, status: "Dispensed",
                    userId: userId, nutritionOrder: orderId
                }
            })
            // update fhir resource
            let resource = await (await FhirApi({ "url": `/NutritionOrder/${orderId}` })).data
            resource.status = "completed"

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