import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.render("index", {
        games: [
            {
                hostname: "Alex",
                id: "12",
            },
            {
                hostname: "Andrey",
                id: "13",
            },
        ],
    });
});

export default router;
