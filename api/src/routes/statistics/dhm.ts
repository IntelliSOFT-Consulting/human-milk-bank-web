import express, { Router, Request, Response } from 'express';
import { generateReport } from '../../lib/fhir';
import { requireJWTMiddleware } from '../../lib/jwt';
import { availableDHMVolume, avgDaysToReceivingMothersOwnMilk, countPatients, countPatientsFromNutritionOrders } from '../../lib/reports';
const router = Router();

router.use(express.json())


let days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
]



// DHM Statistics 
router.get('/', [requireJWTMiddleware], async (req: Request, res: Response) => {
    // let selectFields = []
    let dhmVolume = await availableDHMVolume()
    let dhmInfants = countPatients(await generateReport("infantsOnDHM")) || 0

    let fullyReceiving = Math.floor(dhmInfants * Math.random())

    res.json(
        {
            "dhmInfants": dhmInfants || 0,
            "dhmVolume": dhmVolume,
            "dhmAverage": ((dhmVolume.parsteurized + dhmVolume.unParsteurized) / dhmInfants) || 0,
            "fullyReceiving": dhmInfants,
            "dhmLength": "3 days",
            "data": days.map((day) => {
                let totalBabies = (Math.floor(Math.random() * 50))
                let preterm = Math.floor(totalBabies * Math.random())
                let term = totalBabies - preterm
                return {
                    "day": day,
                    "preterm": preterm,
                    "term": term,
                    "total": totalBabies
                }
            })
        }
    );
    return
});


export default router;
