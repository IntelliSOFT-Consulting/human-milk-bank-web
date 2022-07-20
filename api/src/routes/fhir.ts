import express, { NextFunction, Response, Request } from "express";
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { requireJWTMiddleware as requireJWT, decodeSession } from "../lib/jwt";
import bodyParser from 'body-parser'
const router = express.Router()


router.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));


// router.use(express.json({limit: '50mb'}));

router.use('/', [ createProxyMiddleware(
    {
        target: 'https://devnndak.intellisoftkenya.com', changeOrigin: true,
        pathRewrite: {
            '^/fhir/old-path': '/fhir/new-path',
        },
        onProxyReq: fixRequestBody
    })]);

router.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    console.error('Got an error!', err);
    res.end();
});



export default router