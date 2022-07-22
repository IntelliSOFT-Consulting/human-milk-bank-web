import express, { Router, Request, Response } from 'express';
import { FhirApi } from '../../lib/fhir';
import { requireJWTMiddleware } from '../../lib/jwt';
import { generateFeedingReport } from '../../lib/reports';

const router = Router();

router.use(express.json())

router.get('/patient-level',[requireJWTMiddleware], async (req: Request, res: Response) => {
    let { limit } = req.query
    let patients = []
    let p = await FhirApi({ url: `/Patient?&_count=${limit || 10}` })
    for (let i of p.data.entry) {
        if (Object.keys(i.resource).indexOf("link") > -1) {
            console.log("D",i.resource.id)
            patients.push(i.resource.id)
        }
    }

    res.json(
        {
            status: "success",
            report: await generateFeedingReport(patients)
        });
    return
});

export default router;
