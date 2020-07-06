import { Router, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { Game } from "../../data";

const router = Router();

router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    // TODO: check for game state (waiting -> join as opponent, playing -> spectate)
    if (isValidObjectId(id)) {
        const game = await Game.findById(id).exec();
        if (game) {
            const { name, fieldSize, gameStatus } = game;
            return res.render("game", {
                ...req.session.defaultRenderVariables,
                id: id,
                name,
                fieldSize,
                gameStatus,
            });
        }
    }

    return res.redirect("/");
});


export default router;
