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

    let weight = (Math.floor(Math.random() * 2000))
    if (weight < 1200) { weight += 1200 }
    let noOfDays = Math.floor(Math.random() * 15)
    if (noOfDays < 2) { noOfDays+=2 }
    let _days = []

    for (let i = 0; i < noOfDays; i++) {
        _days.push(i)
    }
    res.json(
        {
            "currentWeight": `${weight} gm`,
            "data": _days.map((day) => {
                let weight = (Math.floor(Math.random() * 2000))
                if (weight < 1200) { weight += 1200 }
                return {
                    "projected": weight,
                    "actual": weight - (Math.floor(Math.random() * 500)),
                    "lifeDay": day,
                }
            })
        }
    );
    return
});





export default router;
