import express, { Router, Request, Response } from 'express';
import { FhirApi } from '../../lib/fhir';
import { requireJWTMiddleware } from '../../lib/jwt';
import { generateFeedingReport, getFeedDistribution } from '../../lib/reports';

const router = Router();

router.use(express.json())

router.get('/patient-level', [requireJWTMiddleware], async (req: Request, res: Response) => {
    let { limit } = req.query
    let patients = []
    let p = await FhirApi({ url: `/Patient?address=Pumwani&_count=${limit || 100}` })
    for (let i of p.data.entry) {
        patients.push(i.resource.id)
    }

    res.json(
        {
            status: "success",
            report: await generateFeedingReport(patients)
        });
    return
});

router.get('/feed-distribution/:id', [requireJWTMiddleware], async (req: Request, res: Response) => {
    let { id } = req.params

    res.json(
        {
            status: "success",
            report: await getFeedDistribution(id)
        });
    return
});


export default router;
