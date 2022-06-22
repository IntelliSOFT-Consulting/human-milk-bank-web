import express, { Router, Request, Response } from 'express';

const router = Router();

router.use(express.json())

let months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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
            "totalFeed": "105 ml",
            "varianceAmount": "-20 ml", // Compared to prescribed amount
            "data": [
                {
                    "time": "11 AM", // 3 Hour Interval
                    "ivVolume": (Math.floor(Math.random() * 50)),
                    "ebmVolume": (Math.floor(Math.random() * 50)),
                    "dhmVolume": (Math.floor(Math.random() * 50))
                },
                {
                    "time": "2 PM", // 3 Hour Interval
                    "ivVolume": (Math.floor(Math.random() * 50)),
                    "ebmVolume": (Math.floor(Math.random() * 50)),
                    "dhmVolume": (Math.floor(Math.random() * 50))
                },
                {
                    "time": "5 PM", // 3 Hour Interval
                    "ivVolume": (Math.floor(Math.random() * 50)),
                    "ebmVolume": (Math.floor(Math.random() * 50)),
                    "dhmVolume": (Math.floor(Math.random() * 50))
                },
                {
                    "time": "8 PM", // 3 Hour Interval
                    "ivVolume": (Math.floor(Math.random() * 50)),
                    "ebmVolume": (Math.floor(Math.random() * 50)),
                    "dhmVolume": (Math.floor(Math.random() * 50))
                },
                {
                    "time": "11 PM", // 3 Hour Interval
                    "ivVolume": (Math.floor(Math.random() * 50)),
                    "ebmVolume": (Math.floor(Math.random() * 50)),
                    "dhmVolume": (Math.floor(Math.random() * 50))
                }
            ]
        }

    );
    return
});





export default router;
