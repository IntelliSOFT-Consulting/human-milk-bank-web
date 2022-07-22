import express, { Router, Request, Response } from 'express';
import { infantsExposedToFormula, infantsFullyFedOnMothersMilk, infantsReceivingExclusiveHumanMilkDiets } from '../../lib/reports';

const router = Router();

router.use(express.json())

router.get('/', async (req: Request, res: Response) => {
    res.json(
        {
            status: "success",
            report: {
                infantsExposedToFormula: await infantsExposedToFormula(),
                infantsFullyFedOnMothersMilk: await infantsFullyFedOnMothersMilk(),
                infantsReceivingExclusiveHumanMilkDiets: await infantsReceivingExclusiveHumanMilkDiets()
            }
        });
    return
});

export default router;
