import * as path from "path";

import express from "express";
import morgan from "morgan";
import nunjucks from "nunjucks";

import router from "./routes";

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

app.use(router);

export default app;
