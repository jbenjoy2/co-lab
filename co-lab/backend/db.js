"use strict";

/** Database setup **/

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

const db = new Client({
  connectionString: getDatabaseUri(),
  ssl: {
    rejectUnauthorized: false
  } // deal with the heroku cors errors
});

db.connect();

module.exports = db;
