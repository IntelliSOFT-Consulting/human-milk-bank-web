import express, { Router, Request, Response } from 'express';
import { generateReport } from '../lib/fhir';
import { firstFeeding, expressingTime, percentageFeeds, calculateMortalityRate, getGestation } from '../lib/reports';

const router = Router();


router.use(express.json())


router.get('/', async (req: Request, res: Response) => {

    let totalBabies = await generateReport("noOfBabies")
    let preterm = await generateReport("noOfPretermBabies")
    let term = await generateReport("noOfTermBabies")
    let mortalityRate = await calculateMortalityRate()
    // let mortalityRate = 0

    res.json(
        {
            "status":"success",
            "totalBabies": totalBabies,
            "preterm": await getGestation("preterm"),
            "term": await getGestation("term"),
            "averageDays": 3,
            "firstFeeding": await firstFeeding(),
            "percentageFeeds":await percentageFeeds(),
            "mortalityRate": mortalityRate,
            "expressingTime":await expressingTime()
        });
    return
});

let getMonthFromDate = (date:string) => {
    return new Date(date).getMonth()
}

export default router;



