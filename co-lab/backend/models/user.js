"use strict";

// sql class for user table
const db = require("../db");
const bcrypt = require("bcrypt");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
  // authenticate- login route takes in username/password and compares to database; returns user if found, or error if not
  static async authenticate(username, password) {
    const result = await db.query(
      `Select username, password, first_name as "firstName", last_name as "lastName", email FROM users WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    // if user, then username was found so compare password to hashed input password and make sure theyre the same. if so, return the user without the password field
    if (user) {
      const validPW = await bcrypt.compare(password, user.password);
      if (validPW) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError("Invalid username, password");
  }

  //   register route- takes in username, password, firstName, lastName, email and checks for duplicate username and email, and throws badrequesterror if duplciate is found, otherwise returns user data
  static async register({ username, password, firstName, lastName, email }) {
    //   duplicate username check
    const dupUNCheck = await db.query(`SELECT username FROM users WHERE username = $1`, [username]);
    // duplicate email check
    const dupEmailCheck = await db.query(`SELECT email FROM users WHERE email =$1`, [email]);

    if (dupEmailCheck.rows[0]) {
      throw new BadRequestError(`Email ${email} already registered. Please sign in!`);
    }
    if (dupUNCheck.rows[0]) {
      throw new BadRequestError(`Username ${username} already taken!`);
    }

    // hash password to save to database
    const hashedPW = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const addToDB = await db.query(
      `INSERT INTO users
            (username,
             password,
             first_name,
             last_name,
             email)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING username, first_name AS "firstName", last_name AS "lastName", email`,
      [username, hashedPW, firstName, lastName, email]
    );

    const user = addToDB.rows[0];
    return user;
  }
}
