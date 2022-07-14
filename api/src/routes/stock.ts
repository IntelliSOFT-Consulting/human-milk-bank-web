import express, { Request, Response } from "express";
import { requireJWTMiddleware as requireJWT, encodeSession, decodeSession } from "../lib/jwt";
import db from '../lib/prisma'
import * as bcrypt from 'bcrypt'
import { sendPasswordResetEmail, sendWelcomeEmail, validateEmail } from "../lib/email";
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
    try {
        let activeOrders = (await FhirApi({ "url": "/NutritionOrder?status=active" })).data
        let results = []
        for (let order of activeOrders.entry) {
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
            let encounterObservations = (await FhirApi({ "url": "/" + resource.encounter.reference + "/$everything" })).data.entry
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
        res.json({ error: "incorrect email or password" });
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
            let order = await db.order.create({
                data: {
                    dhmType, dhmVolume: dhmVolume, remarks, status: "Dispensed",
                    userId
                }
            })
            res.json({ status: "success", message: "Stock Entry created successfully", id: order.id })
            return
        }
    } catch (error) {
        console.error(error)
        res.statusCode = 400
        res.json({ error, status: "error" });
        return
    }
});


// Register
router.post("/reset-password", async (req: Request, res: Response) => {
    try {
        let { username, email, id } = req.body;
        if (email && !validateEmail(email)) {
            res.statusCode = 400
            res.json({ status: "error", message: "invalid email value provided" })
            return
        }
        // Initiate password reset.
        let user = await db.user.findFirst({
            where: {
                ...(email) && { email },
                ...(username) && { username },
                ...(id) && { id }
            }
        })

        let session = encodeSession(process.env['SECRET_KEY'] as string, {
            createdAt: ((new Date().getTime() * 10000) + 621355968000000000),
            userId: user?.id as string,
            role: "RESET_TOKEN"
        })
        user = await db.user.update({
            where: {
                ...(email) && { email },
                ...(username) && { username },
                ...(id) && { id }
            },
            data: {
                resetToken: session.token,
                verified: false,
                resetTokenExpiresAt: new Date(session.expires)
            }
        })
        res.statusCode = 200
        let resetUrl = `${process.env['WEB_URL']}/new-password?id=${user?.id}&token=${user?.resetToken}`
        console.log(resetUrl)
        let response = await sendPasswordResetEmail(user, resetUrl)
        console.log(response)
        res.json({ message: `Password reset instructions have been sent to your email, ${user?.email}`, status: "success", });
        return

    } catch (error: any) {
        console.log(error)
        res.statusCode = 401
        if (error.code === 'P2025') {
            res.json({ error: `Password reset instructions have been sent to your email`, status: "error" });
            return
        }
        res.json({ error: error, status: "error" });
        return
    }

});

// Set New Password
router.post("/new-password", [requireJWT], async (req: Request, res: Response) => {
    try {
        let { password, id } = req.body;
        let user = await db.user.findFirst({
            where: {
                id: id as string
            }
        })
        let token = req.headers.authorization || '';
        let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token.split(" ")[1] as string)
        if ((decodedSession.type !== 'valid') || !(user?.resetToken) || ((user?.resetTokenExpiresAt as Date) < new Date())
            || (decodedSession.session?.role !== 'RESET_TOKEN')
        ) {
            res.statusCode = 401
            res.json({ error: `Invalid and/or expired password reset token. Code: ${decodedSession.type}`, status: "error" });
            return
        }
        let salt = await bcrypt.genSalt(10)
        let _password = await bcrypt.hash(password, salt)
        let response = await db.user.update({
            where: {
                id: id as string
            },
            data: {
                password: _password, salt: salt, resetToken: null, resetTokenExpiresAt: null, verified: true
            }
        })
        console.log(response)
        res.statusCode = 200
        res.json({ message: "Password Reset Successfully", status: "success" });
        return
    } catch (error) {
        console.log(error)
        res.statusCode = 401
        res.json({ error: error, status: "error" });
        return
    }

});


// Delete User
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        let { id } = req.params;
        let user = await db.user.delete({
            where: {
                id: id
            }
        })
        let responseData = user
        res.statusCode = 201
        res.json({ user: responseData, status: "success" })
        return
    } catch (error: any) {
        res.statusCode = 400
        console.error(error)
        if (error.code === 'P2002') {
            res.json({ status: "error", error: `User with the ${error.meta.target} provided already exists` });
            return
        }
        res.json(error)
        return
    }
});



export default router