import { Router, Request, Response } from "express";

const router = Router();

router.all(/.*/, (req: Request, res: Response) => {
    res.status(404).send("Bad request");
 });

 export default router;
