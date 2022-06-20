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


router.get('/:ip', (req: Request, res: Response) => {

    let {ip} = req.params
     

    let totalBabies = (Math.floor(Math.random() * 50))
    let preterm  = Math.floor(totalBabies * Math.random())
    let term = totalBabies - preterm 
    
    res.json(
        {
            "dhmInfants": 10,
            "dhmVolume": "1200 mls",
            "dhmAverage": "68 mls",
            "fullyReceiving": 8,
            "dhmLength": "3 days",
            "data": 
            days.map((day) => {
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
