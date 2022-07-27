import express, { Router, Request, Response } from 'express';
import { FhirApi, generateReport } from '../../lib/fhir';
import { requireJWTMiddleware } from '../../lib/jwt';
import { babiesReceivingFeeds, calculateMortalityRate, getGestation, lactationSupportPatientLevelReport, mothersInitiatingLactation } from '../../lib/reports';

const router = Router();

router.use(express.json())

router.get('/', [requireJWTMiddleware], async (req: Request, res: Response) => {

    res.json(
        {
            status: "success",
            report: {
                mothersInitiatingLactation: await mothersInitiatingLactation(),
                babiesReceivingFeeds: await babiesReceivingFeeds()
            }
        });
    return
});

router.get('/patient-level', [requireJWTMiddleware], async (req: Request, res: Response) => {

    let { limit } = req.query
    let patients = []
    let p = await FhirApi({ url: `/Patient?_count=${limit || 10}` })
    for (let i of p.data.entry) {
        if (Object.keys(i.resource).indexOf("link") > -1) {
            patients.push(i.resource.id)
        }
    }
    res.json(
        {
            status: "success",
            report: await lactationSupportPatientLevelReport(patients)
        });
    return
});

export default router;



