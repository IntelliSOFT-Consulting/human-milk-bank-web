import express, { Router, Request, Response } from 'express';
import { generateReport } from '../../lib/fhir';
import { requireJWTMiddleware } from '../../lib/jwt';
import { availableDHMVolume, countPatients } from '../../lib/reports';
const router = Router();

router.use(express.json())


router.get('/', [requireJWTMiddleware], async (req: Request, res: Response) => {
    let infantsOnDHM = countPatients(await generateReport("infantsOnDHM")) || 0
    let totalVolumeOfDHM = await availableDHMVolume() || 0
    res.json(
        {
            status: "success",
            report: {
                infantsOnDHM,
                averageLengthOfDHMUse: 0,
                totalDHMAvailable: 0,
                infantsFullyReceivingDHM: 0,
                totalVolumeOfDHM,
                averageVolumeOfDHMUsePerDay: 0,
                infantsPartiallyReceivingDHM: 0,
            }
        });
    return
});

export default router;



