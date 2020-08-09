"use strict";

const express = require("express");
const fccTesting = require("./freeCodeCamp/fcctesting.js");

const mongo = require("mongodb").MongoClient;

const routes = require("./routes");
const auth = require("./auth");

const app = express();

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");

mongo.connect(
  process.env.MONGO_URI,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err, client) => {
    if (err) {
      console.log("Database error: " + err);
    } else {
      const db = client.db('test');
      console.log("Successful database connection");
      
      auth(app, db);
      routes(app, db);
      
      app.use((req, res, next) => {
        res
          .status(404)
          .type("text")
          .send("Not Found");
      });

      app.listen(process.env.PORT || 3000, () => {
        console.log("Listening on port " + process.env.PORT);
      });
    }
  }
);
