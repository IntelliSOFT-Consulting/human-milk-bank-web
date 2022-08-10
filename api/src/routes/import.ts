// Import only what we need from express
import express, { Router, Request, Response } from 'express';
import { FhirApi } from '../lib/fhir';
import { requireJWTMiddleware } from '../lib/jwt';
import fetch from 'cross-fetch'

const router: Router = Router();
router.use(express.json({ limit: "100mb" }))



router.post('/', [requireJWTMiddleware], async (req: Request, res: Response) => {
    try {
        // console.log(req.body)
        // let response = await FhirApi({
        //     url: "/", method: 'POST', data: req.body.contents, headers: {
        //         Prefer: "respond-async", "Content-Type": "application/fhir+json"
        //     }
        // }
        // req.body.contents.split("\n")
        // console.log(req.body.contents.split("\n"))

        let response = await (await fetch('http://localhost:8080/fhir', {
            method: "POST",
            body: JSON.stringify(req.body.contents),
            headers: {
                Prefer: "respond-async", "Content-Type": "application/fhir+json"

            }
        })).text()
        console.log(response)
        return
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({ error, status: "error" });
        return
    }
});

export default router;
