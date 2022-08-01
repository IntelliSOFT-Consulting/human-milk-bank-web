import express, { Router, Request, Response } from 'express';
import { FhirApi } from '../../lib/fhir';
import { requireJWTMiddleware } from '../../lib/jwt';
import { growthPatientLevel, infantsExposedToFormula, infantsFullyFedOnMothersMilk, infantsReceivingExclusiveHumanMilkDiets, percentageFeeds } from '../../lib/reports';

const router = Router();

router.use(express.json())

router.get('/', [requireJWTMiddleware], async (req: Request, res: Response) => {
    res.json(
        {
            status: "success",
            report: {
                infantsExposedToFormula: await infantsExposedToFormula(),
                infantsFullyFedOnMothersMilk: await infantsFullyFedOnMothersMilk(),
                infantsReceivingExclusiveHumanMilkDiets: await infantsReceivingExclusiveHumanMilkDiets(),
                percentageFeeds: await percentageFeeds()
            }
        });
    return
});


router.get('/patient-level', [requireJWTMiddleware], async (req: Request, res: Response) => {
    let { limit } = req.query
    let patients = []
    let p = await FhirApi({ url: `/Patient?address=Pumwani&_count=${limit || 50}` })
    for (let i of p.data.entry) {
        patients.push(i.resource.id)
    }
    res.json(
        {
            status: "success",
            report: await growthPatientLevel(patients)
        });
    return
});

export default router;
