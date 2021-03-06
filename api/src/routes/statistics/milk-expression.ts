import express, { Router, Request, Response } from 'express';

const router = Router();

router.use(express.json())

router.get('/:ip', (req: Request, res: Response) => {

    res.json(
        {
            "totalAmount": "400 ml",
            "varianceAmount": "10ml", //Compared to Previous Day
            "data": [
                {
                    "time": "12:00 AM", // 3Hour Interval
                    "amount": (Math.floor(Math.random() * 50))
                },
                {
                    "time": "3:00 AM", // 3Hour Interval
                    "amount": (Math.floor(Math.random() * 50))
                },
                {
                    "time": "6:00 AM", // 3Hour Interval
                    "amount": (Math.floor(Math.random() * 50))
                },
                {
                    "time": "9:00 AM", // 3Hour Interval
                    "amount": (Math.floor(Math.random() * 50))
                }
            ]
        }
    );
    return
});

export default router;
