import { join } from "path";
import express, { Router } from "express";

const router = Router();

router.use(
    "/static",
    express.static(join(__dirname, "../../../resource/public"))
);

export default router;
