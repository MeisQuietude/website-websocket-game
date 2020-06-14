import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    console.log("GET");
});

router.post("/", (req: Request, res: Response) => {
    console.log("POST");
});

export default router;
