"use strict";

// sql class for user table
const db = require("../db");
const bcrypt = require("bcrypt");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const moment = require("moment");

const { BCRYPT_WORK_FACTOR } = require("../config.js");
const { updateQuery } = require("../helperFuncs/sql");

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
      } else throw new UnauthorizedError("Invalid Password");
    }
    throw new UnauthorizedError("Invalid username");
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

  //   find all users, with optional searchterms of firstName, lastName, and username which will all be case insensitive
  static async findAll(searchOptions = {}) {
    let sql = `SELECT username,
                    first_name as "firstName",
                    last_name as "lastName",
                    email,
                    image_url as "imageURL"
                FROM users `;

    const { firstName, lastName, username } = searchOptions;
    let whereExpressions = [];
    let queryValues = [];

    if (firstName !== undefined) {
      queryValues.push(`%${firstName}%`);
      whereExpressions.push(`first_name ILIKE $${queryValues.length}`);
    }
    if (lastName !== undefined) {
      queryValues.push(`%${lastName}%`);
      whereExpressions.push(`last_name ILIKE $${queryValues.length}`);
    }
    if (username !== undefined) {
      queryValues.push(`%${username}%`);
      whereExpressions.push(`username ILIKE $${queryValues.length}`);
    }

    // add WHERE clause to query
    if (whereExpressions.length > 0) {
      const wheres = whereExpressions.join(" AND ");
      sql += ` WHERE ${wheres} `;
    }

    // order by username;
    sql += "ORDER BY username";
    try {
      const keys = new Set(Object.keys(searchOptions).map(k => k));

      if (keys.size > 0) {
        if (!(keys.has("firstName") || keys.has("lastName") || keys.has("username"))) {
          throw new BadRequestError("Invalid filter");
        }
      }
      const usersResults = await db.query(sql, queryValues);
      return usersResults.rows;
    } catch (error) {
      console.error(error);
    }
  }

  //   find data about user given their username
  static async getUser(username) {
    const userRes = await db.query(
      `Select username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  image_url AS "imageURL"
            FROM users
            WHERE username = $1`,
      [username]
    );

    const foundUser = userRes.rows[0];
    if (!foundUser) throw new NotFoundError(`User with username ${username} not found`);
    const projectsRes = await db.query(
      `Select p.id,
              p.updated_at AS "updatedAt",
              p.title AS "title",
              c.is_owner AS "owner"
        FROM projects AS p
        LEFT JOIN cowrites AS c
        ON p.id = c.project_id
        
            WHERE 
              c.username = $1 
              ORDER BY p.updated_at DESC`,
      [username]
    );

    //

    foundUser.projects = projectsRes.rows;

    return foundUser;
  }

  static async update(username, data) {
    const javascript = {
      firstName: "first_name",
      lastName: "last_name"
    };

    const { setTerms, setVals } = updateQuery(data, javascript);
    const usernameIdx = "$" + (setVals.length + 1);

    const sql = `UPDATE users 
                SET ${setTerms} 
                WHERE username=${usernameIdx} 
                RETURNING username, first_name AS "firstName", last_name AS "lastName", email`;

    const result = await db.query(sql, [...setVals, username]);

    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
    return user;
  }

  static async remove(username) {
    const qry = await db.query(
      `
      DELETE FROM users 
      WHERE username = $1 
      RETURNING username`,
      [username]
    );

    const user = qry.rows[0];

    if (!user) throw new NotFoundError(`User with username: ${username} not found!`);
  }
}

module.exports = User;
