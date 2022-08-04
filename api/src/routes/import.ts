// Import only what we need from express
import express,{ Router, Request, Response } from 'express';
import { FhirApi } from '../lib/fhir';
import { requireJWTMiddleware } from '../lib/jwt';

const router: Router = Router();
router.use(express.json({limit:"100mb"}))



router.post('/', [requireJWTMiddleware], async (req: Request, res: Response) => {
    try {
        // console.log(req.body)
        let response = await FhirApi({ url: "/", method: 'POST', data: JSON.stringify(req.body) })
        console.log(response.data)
        return
    } catch (error) {
        console.log(error)
        res.statusCode = 400
        res.json({ error, status: "error" });
        return
    }
});

export default router;
