import { NextFunction, Request, Response, Router } from "express";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    req.session.defaultRenderVariables = {
        username: req.session && req.session.username,
    };
    next();
});

export default router;
