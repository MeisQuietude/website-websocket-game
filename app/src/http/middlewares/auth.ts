import { NextFunction, Request, Response, Router } from "express";

const router = Router();

const randomUsername = () => {
    const prefix = "player";
    const randNum = Math.floor(Math.random() * (Math.pow(10, 4) - Math.pow(10, 3))) + Math.pow(10, 3);
    return `${prefix}${randNum}`;
};

router.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.session.username) {
        req.session.username = randomUsername();
    }
    next();
});

export default router;
