import dotenv from "dotenv";

import { GameModel } from "./models/game";

dotenv.config();

const { DBNAME, DBUSER, DBPASS } = process.env;

let dburl = "mongodb://localhost";
if (DBNAME && DBUSER && DBPASS) {
    dburl = `mongodb+srv://${DBUSER}:${DBPASS}@course-2-vpxyl.azure.mongodb.net/${DBNAME}?retryWrites=true&w=majority`;
}
export const DBURI = dburl;

export const Game = GameModel;
