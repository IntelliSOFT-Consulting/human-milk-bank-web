import express, { Router, Request, Response } from 'express';
import { generateReport } from '../../lib/fhir';
import { calculateMortalityRate, getGestation, lowBirthWeight } from '../../lib/reports';

const router = Router();

router.use(express.json())

router.get('/', async (req: Request, res: Response) => {

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
    res.json(
        {
            status: "success",
            report: {
                totalBabies: await generateReport("noOfBabies"),
                preterm: await getGestation("preterm"),
                term: await getGestation("term"),

            }
        });
    return
});
export default router;



