import * as path from "path";

import express from "express";
import morgan from "morgan";

import router from "./routes";

const app = express();

// HTTP Route Logger
app.use(morgan("dev"));

// Template Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../../resource/views"))

app.use(router);

export default app;
