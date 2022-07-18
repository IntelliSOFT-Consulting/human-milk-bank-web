import express, { Router, Request, Response } from 'express';
import { generateReport } from '../../lib/fhir';
import db from '../../lib/prisma'
const router = Router();

router.use(express.json())


let days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
]

let getTotalDHMVolume = async () => {
    
    let totalVolume = await db.order.aggregate({
        _sum:{
            dhmVolume:true
        }
    }) 


}


// DHM Statistics 
router.get('/', async (req: Request, res: Response) => {

    let dhmInfants = await generateReport("noOfInfantsOnDHM") || 0
    let dhmVolume = await generateReport("noOfInfantsOnDHM") || 0
    let dhmAverage = await generateReport("noOfInfantsOnDHM") || 0
    let fullyReceiving = Math.floor(dhmInfants * Math.random())

    let dhmLength = ''

    res.json(
        {
            "dhmInfants": dhmInfants,
            "dhmVolume": dhmVolume,
            "dhmAverage": dhmVolume / dhmInfants,
            "fullyReceiving": fullyReceiving,
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
