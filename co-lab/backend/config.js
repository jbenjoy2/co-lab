"use strict";

/** Shared config  **/

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;

// Use dev database or via env var, production database
function getDatabaseUri() {
  return process.env.NODE_ENV === "test" ? "colab_test" : process.env.DATABASE_URL || "colab";
}

const BCRYPT_WORK_FACTOR = 13;

console.log("Colab Config:".green);
console.log("SECRET_KEY:".red, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri
};
