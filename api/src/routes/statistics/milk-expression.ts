import express, { Router, Request, Response } from 'express';

const router = Router();

router.use(express.json())

let months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct", "Nov", "Dec"
]

let days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
]


router.get('/:ip', (req: Request, res: Response) => {

    let { ip } = req.params


    let totalBabies = (Math.floor(Math.random() * 50))
    let preterm = Math.floor(totalBabies * Math.random())
    let term = totalBabies - preterm

    res.json(
        {
            "totalAmount": "400 ml",
            "varianceAmount": "10ml", //Compared to Previous Day
            "data": [
                {
                    "time": "11 AM", // 3Hour Interval
                    "amount": 50
                }
            ]
        }
    );
    return
});





export default router;
