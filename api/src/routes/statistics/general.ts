import express, { Router, Request, Response } from 'express';
import { generateReport } from '../../lib/fhir';
import { calculateMortalityRate, getGestation } from '../../lib/reports';

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
                mortalityRate: mortalityRate.rate,
                mortalityRates: mortalityRate.data
            }
        });
    return
});


router.get('/patient-level', async (req: Request, res: Response) => {

    let mortalityRate = await calculateMortalityRate()
    res.json(
        {
            status: "success",
            report: {
                totalBabies: await generateReport("noOfBabies"),
                preterm: await getGestation("preterm"),
                term: await getGestation("term"),
                mortalityRate: mortalityRate.rate,
                mortalityRates: mortalityRate.data
            }
        });
    return
});
export default router;



