import express, { Router, Request, Response } from 'express';
import { generateReport } from '../lib/fhir';

const router = Router();

router.use(express.json())

let months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

let days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
]

router.get('/', async (req: Request, res: Response) => {

    let totalBabies = (Math.floor(Math.random() * 50))
    if(totalBabies < 10){totalBabies+=20}
    let preterm = Math.floor(totalBabies * Math.random())
    let term = totalBabies - preterm
    let dhm = (Math.floor(Math.random() * 20))
    let breastFeeding = (Math.floor(Math.random() * 30))
    let oral = (Math.floor(Math.random() * 20))
    let ebm = (Math.floor(Math.random() * 20))
    let formula = 100 - dhm - breastFeeding - oral - ebm
    res.json(
        {
            "status":"success",
            "totalBabies": totalBabies,
            "preterm": preterm,
            "term": term,
            "averageDays": 3,
            "firstFeeding": {
                "withinOne": 3,
                "afterOne": 4,
                "afterTwo": 1,
                "afterThree": 2
            },
            "percentageFeeds": {
                "dhm": dhm,
                "breastFeeding": breastFeeding,
                "oral": oral,
                "ebm": ebm,
                "formula": formula
            },
            "mortalityRate": {
                "rate": Math.floor(Math.random() * 10) + 1,
                "data": months.map((month) => {
                    return {
                        "month": month,
                        "value": Math.floor(Math.random() * 10) + 1
                    }
                })
            },
            "expressingTime": months.map((month) => {
                return {
                    "month": month,
                    "underFive": Math.floor(Math.random() * 10),
                    "underSeven": Math.floor(Math.random() * 10),
                    "aboveSeven": Math.floor(Math.random() * 10)
                }
            })
        });
    return
});

export default router;
