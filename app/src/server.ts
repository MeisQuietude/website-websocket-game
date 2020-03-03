import { Request, Response } from "express";

const express = require('express');
const app = express();

app.use('/static', express.static(__dirname + '../resource/public'));

app.get('/', (req: Request, res: Response) => {
   res.send("Hello World!");
})

app.listen(3000, function () {
   console.log('Example app listening on port 3000!')
})