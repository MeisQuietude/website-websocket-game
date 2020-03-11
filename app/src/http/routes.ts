import * as path from "path";

import express, { Router, Request, Response } from "express";

const router = Router();

router.use("/static", express.static(path.join(__dirname, "../../resource/public")));

router.get('/', (req: Request, res: Response) => {
   res.send("Hello World1!");
});

router.all(/.*/, (req: Request, res: Response) => {
   res.status(404).send("Bad request");
});

export = router;
