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


// DHM Statistics 
router.get('/:ip', (req: Request, res: Response) => {

    let { ip } = req.params
    let dhmInfants = (Math.floor(Math.random() * 30))
    let fullyReceiving = Math.floor(dhmInfants * Math.random())

    res.json(
        {
            "dhmInfants": dhmInfants,
            "dhmVolume": "1200 mls",
            "dhmAverage": "68 mls",
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
