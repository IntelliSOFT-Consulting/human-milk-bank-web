import express, { Router, Request, Response } from 'express';
import { FhirApi } from '../lib/fhir';
import { requireJWTMiddleware } from '../lib/jwt';

const router: Router = Router();
router.use(express.json())




export default router;
