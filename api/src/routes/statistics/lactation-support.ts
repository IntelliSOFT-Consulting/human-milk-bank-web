import express, { Router, Request, Response } from 'express';
import { generateReport } from '../../lib/fhir';
import { babiesReceivingFeeds, calculateMortalityRate, getGestation, mothersInitiatingLactation } from '../../lib/reports';

const router = Router();

router.use(express.json())

router.get('/', async (req: Request, res: Response) => {

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

router.get('/patient-level', async (req: Request, res: Response) => {

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

export default router;



