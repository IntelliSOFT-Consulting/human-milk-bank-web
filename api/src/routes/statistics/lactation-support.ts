import express, { Router, Request, Response } from 'express';
import { generateReport } from '../../lib/fhir';
import { requireJWTMiddleware } from '../../lib/jwt';
import { babiesReceivingFeeds, calculateMortalityRate, getGestation, mothersInitiatingLactation } from '../../lib/reports';

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



