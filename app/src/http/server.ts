import express from "express";
import morgan from "morgan";

import router from "./routes";

const app = express();

// HTTP Route Logger
app.use(morgan("dev"));

app.use(router);

app.listen(3000, () => {
  console.log('Server listening on port 3000!')
});
