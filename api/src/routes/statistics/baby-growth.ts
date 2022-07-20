import express, { Router, Request, Response } from 'express';
import { infantsExposedToFormula } from '../../lib/reports';

const router = Router();

router.use(express.json())

router.get('/', async (req: Request, res: Response) => {

    res.json(
        {
            status: "success",
            report: {
                infantsExposedToFormula: await infantsExposedToFormula(),
            }
        });
    return
});

export default router;
