import express, { Request, Response } from "express";


const router = express.Router()
router.use(express.json())

router.get("/", async (req: Request, res: Response) => {
    res.statusCode = 200
    res.json({
        "status": "ok"
    })
    return
})

export default router