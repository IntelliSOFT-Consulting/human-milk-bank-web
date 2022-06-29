import express, { Router, Request, Response } from 'express';
import { generateReport } from '../lib/fhir';
import { calculateMortalityRate, firstFeeding, expressingTime, percentageFeeds } from '../lib/reports';

const router = Router();

// console.log(typeof calculateMortalityRate)

router.use(express.json())

let months = [
     "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"
]

let days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
]

router.get('/', async (req: Request, res: Response) => {

    let totalBabies = (Math.floor(Math.random() * 50))
    totalBabies = await generateReport("noOfBabies")
    let preterm = Math.floor(totalBabies * Math.random())
    preterm = await generateReport("noOfPretermBabies")
    let term = totalBabies - preterm
    let mortalityRate = 0

    res.json(
        {
            "status":"success",
            "totalBabies": totalBabies,
            "preterm": preterm,
            "term": term,
            "averageDays": 3,
            "firstFeeding": await firstFeeding(),
            "percentageFeeds":await percentageFeeds(),
            "mortalityRate": mortalityRate,
            "expressingTime":await expressingTime()
        });
    return
});

export default router;
