import * as path from "path";

import express, { Router, Request, Response } from "express";

const router = Router();

router.use("/static", express.static(path.join(__dirname, "../../resource/public")))

router.get('/', (req: Request, res: Response) => {
   res.render("index", {});
});

router.get('/game', (req: Request, res: Response) => {
   // TODO: Get game by id
   console.log("GET");
   // res.render("game", {fieldLength: 3});
})

router.post('/game', (req: Request, res: Response) => {
   console.log("POST")
   // TODO: Post the game
})

router.all(/.*/, (req: Request, res: Response) => {
   res.status(404).send("Bad request");
});

export = router;
