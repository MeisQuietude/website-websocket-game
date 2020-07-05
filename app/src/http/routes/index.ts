import { Router, Request, Response } from "express";

import Models from "../../data";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const games = await Models.Game.find({ finished: false }).limit(10).lean().exec();
    res.render("index", {
        ...req.session.defaultRenderVariables,
        games,
    });
});

export default router;
