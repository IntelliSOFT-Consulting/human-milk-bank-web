import express, { Router, Request, Response } from 'express';

const router = Router();

router.use(express.json())

router.get('/', async (req: Request, res: Response) => {
    res.json(
        {
            status: "success",
            report: {
                infantsOnDHM: 0,
                averageLengthOfDHMUse: 0,
                totalDHMAvailable: 0,
                infantsFullyReceivingDHM: 0,
                totalVolumeOfDHM: 0,
                averageVolumeOfDHMUsePerDay: 0,
                infantsPartiallyReceivingDHM: 0,
            }
        });
    return
});

export default router;



