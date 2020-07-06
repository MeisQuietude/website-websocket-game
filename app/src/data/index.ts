import dotenv from "dotenv";

import { GameModel } from "./models/game";

dotenv.config();

const { DBNAME, DBUSER, DBPASS } = process.env;
export const DBURI = `mongodb+srv://${DBUSER}:${DBPASS}@course-2-vpxyl.azure.mongodb.net/${DBNAME}?retryWrites=true&w=majority`;

export const Game = GameModel;
