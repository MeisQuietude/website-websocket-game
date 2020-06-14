import { MongoClient } from "mongodb";
import * as assert from "assert";

const url = "";
const dbName = "";

const client = new MongoClient(url);

client.connect((error) => {
    assert.equal(null, error);
    console.log("Connected successfully to server!");

    const db = client.db(dbName);
    console.log(db);

    client.close();
});
