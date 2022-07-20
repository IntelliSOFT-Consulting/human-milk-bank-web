import express, { Router, Request, Response } from 'express';
import { generateReport } from '../../lib/fhir';
import { firstFeeding, expressingTime, percentageFeeds, calculateMortalityRate, getGestation } from '../../lib/reports';

const router = Router();

router.use(express.json())


router.get('/', async (req: Request, res: Response) => {

    res.json(
        {
            "status": "success",
            "mothersInitiatingLactation": {
                result: await generateReport("noOfBabies"),
                description: "Early initiation of lactation within 1 hour after birth"
            },
            "babiesReceivingFeeds": {
                result: await generateReport("noOfBabies"),
                description: "Babies receiving feeds within 1 hour after birth"
            }
        });
    return
});

export default router;



