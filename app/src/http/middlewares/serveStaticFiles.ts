import { join } from "path";
import express, { Router } from "express";

const router = Router();

// Static files (CSS, JS)
router.use(
    "/static",
    express.static(join(__dirname, "../../../resource/public"))
);

export default router;
