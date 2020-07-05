import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    // const games = getGames();
    // return res.json(games);
});

router.get("/:id", (req: Request, res: Response) => {
    console.log(req.params.id);
});

router.post("/", (req: Request, res: Response) => {
    console.log("POST");
});

export default router;
