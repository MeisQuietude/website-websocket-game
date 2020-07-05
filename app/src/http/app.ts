import * as path from "path";

import express from "express";
import session from "express-session";
import morgan from "morgan";
import nunjucks from "nunjucks";

import auth from "./middlewares/auth";
import serveStaticFiles from "./middlewares/serveStaticFiles";
import defauRenderVariables from "./middlewares/defaultRenderVariables";

import routesIndex from "./routes/index";
import routesGame from "./routes/game";
import routesBad from "./routes/bad";

const app = express();

app.use(session({
    secret: "session-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: app.get("env") === "production",
    },
}));

// HTTP Route Logger
app.use(morgan("dev"));

// Template Engine
app.set("view engine", "html");
nunjucks.configure(path.join(__dirname, "../../resource/views"), {
    autoescape: true,
    express: app,
    watch: true,
    noCache: true,
});

app.use(auth);
app.use(serveStaticFiles);
app.use(defauRenderVariables);

app.use("/", routesIndex);
app.use("/game", routesGame);
app.use(routesBad);

export default app;
