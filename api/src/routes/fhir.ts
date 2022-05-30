import express, {NextFunction, Response, Request} from "express";
import { createProxyMiddleware, fixRequestBody} from 'http-proxy-middleware';
import { requireJWTMiddleware as requireJWT, decodeSession } from "../lib/jwt";

const router = express.Router()





router.use('/', [ requireJWT, createProxyMiddleware(
    {
        target: 'https://devnndak.intellisoftkenya.com', changeOrigin: true,
        pathRewrite: {
            '^/fhir/old-path': '/fhir/new-path',
        },
        onProxyReq: fixRequestBody
})]);

router.use(function (err:any, req: Request, res: Response, next: NextFunction) {
    console.error('Got an error!', err);
    res.end();
});



export default router