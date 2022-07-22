import express, { Router, Request, Response } from 'express';
import { FhirApi, generateReport } from '../../lib/fhir';
import { requireJWTMiddleware } from '../../lib/jwt';
import { calculateMortalityRate, generalPatientLevelReport, getGestation, lowBirthWeight } from '../../lib/reports';

const router = Router();

router.use(express.json())

router.get('/', [requireJWTMiddleware], async (req: Request, res: Response) => {

    let mortalityRate = await calculateMortalityRate()
    res.json(
        {
            status: "success",
            report: {
                totalBabies: await generateReport("noOfBabies"),
                preterm: await getGestation("preterm"),
                term: await getGestation("term"),
                lowBirthWeight: await lowBirthWeight(),
                mortalityRate: mortalityRate.rate,
                mortalityRates: mortalityRate.data
            }
        });
    return
});


router.get('/patient-level', async (req: Request, res: Response) => {
    // patient type - babies
    let { limit } = req.query
    let patients = []
    let p = await FhirApi({ url: `/Patient?address=Pumwani&_count=${limit || 10}` })
    for (let i of p.data.entry) {
        patients.push(i.resource.id)
    }
    res.json(
        {
            status: "success",
            report: await generalPatientLevelReport(patients)
        });
    return
});
export default router;



