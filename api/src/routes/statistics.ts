import express, { Router, Request, Response } from 'express';
import { generateReport } from '../lib/fhir';
import { requireJWTMiddleware } from '../lib/jwt';
import { firstFeeding, expressingTime, percentageFeeds, calculateMortalityRate, getGestation, avgDaysToReceivingMothersOwnMilk } from '../lib/reports';

const router = Router();

router.use(express.json())


router.get('/', [requireJWTMiddleware], async (req: Request, res: Response) => {

    res.json(
        {
            "status": "success",
            "totalBabies": await generateReport("noOfBabies"),
            "preterm": await getGestation("preterm"),
            "term": await getGestation("term"),
            "averageDays": await avgDaysToReceivingMothersOwnMilk(),
            "firstFeeding": await firstFeeding(),
            "percentageFeeds": await percentageFeeds(),
            "mortalityRate": await calculateMortalityRate(),
            "expressingTime": await expressingTime()
        });
    return
});

export default router;



