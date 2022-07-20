import express, { Router, Request, Response } from 'express';
import { FhirApi } from '../../lib/fhir';
import { infantsExposedToFormula } from '../../lib/reports';

const router = Router();

router.use(express.json())

router.get('/patient-level', async (req: Request, res: Response) => {
    let { limit } = req.query
    let patients = []
    let p = await FhirApi({ url: `/Patient&address=Pumwani?_count=${limit}` })
    for (let i of p.data.entry) {
        patients.push(i.resource.id)
    }
    
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
