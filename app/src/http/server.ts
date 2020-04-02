import * as path from "path";

import express from "express";
import morgan from "morgan";
import nunjucks from "nunjucks";

import routesMiddleware from "./routes/middlewares";
import routesIndex from "./routes/index";
import routesGame from "./routes/game";
import routesBad from "./routes/bad";

const app = express();

// HTTP Route Logger
app.use(morgan("dev"));

// Template Engine
app.set("view engine", "html");
// app.set("views", path.join(__dirname, "../../resource/views"))
nunjucks.configure(path.join(__dirname, "../../resource/views"), {
    autoescape: true,
    express: app,
    watch: true,
    noCache: true
})

app.use(routesMiddleware);
app.use("/", routesIndex);
app.use("/game", routesGame);
app.use(routesBad);

export default app;
