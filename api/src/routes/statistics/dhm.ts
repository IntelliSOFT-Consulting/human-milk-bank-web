import express, { Router, Request, Response } from 'express';
import { generateReport } from '../../lib/fhir';
import { requireJWTMiddleware } from '../../lib/jwt';
import { availableDHMVolume, avgDaysToReceivingMothersOwnMilk, countPatients, countPatientsFromNutritionOrders, dhmAvailable } from '../../lib/reports';
const router = Router();

router.use(express.json())


// DHM Statistics 
router.get('/', [requireJWTMiddleware], async (req: Request, res: Response) => {
    let pretermDhmVolume = await availableDHMVolume("Preterm")
    let termDhmVolume = await availableDHMVolume("Term")
    let dhmInfants = countPatients(await generateReport("infantsOnDHM")) || 0

    let dhmTotal = (pretermDhmVolume.pasteurized + pretermDhmVolume.unPasteurized + termDhmVolume.pasteurized + termDhmVolume.unPasteurized) ?? 0


    let fullyReceiving = Math.floor(dhmInfants * Math.random())

    res.json(
        {
            "dhmInfants": dhmInfants ?? 0,
            "dhmVolume": { term: termDhmVolume, preterm: pretermDhmVolume },
            "dhmAverage": (dhmTotal ?? 0 / dhmInfants ?? 0) ?? 0,
            "fullyReceiving": dhmInfants,
            "dhmLength": "3 days",
            "data": await dhmAvailable()
        }
    );
    return
});


export default router;
