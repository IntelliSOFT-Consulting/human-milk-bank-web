import express, { Router, Request, Response } from 'express';

const router = Router();

router.use(express.json())




let months = [
    "January", "Februrary", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
]

let days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
]

router.get('/', (req: Request, res: Response) => {

    let totalBabies = (Math.floor(Math.random() * 500))
    let preterm  = Math.floor(totalBabies * Math.random())
    let term = totalBabies - preterm 
    // let averageDays = 

    let dhm = (Math.floor(Math.random() * 20))
    let breastFeeding = (Math.floor(Math.random() * 30))
    let oral = (Math.floor(Math.random() * 20))
    let ebm = (Math.floor(Math.random() * 20))
    let formula = 100 - dhm - breastFeeding - oral - ebm
    res.json(
        {
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
                "rate": "3%",
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
