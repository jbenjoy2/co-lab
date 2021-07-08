const db = require("../db");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const moment = require("moment");

// this class is simply to retrieve all of the sections or a single section from the database. Use case for single section is incredibly small but it may be required later on
class Section {
  /**
   * fetch all song sections from the database
   * input: none
   * returns: id, name
   */
  static async getAll() {
    const query = await db.query(`SELECT id, name from sections`);

    const sections = query.rows;
    return sections;
  }

  /**
   * fetch single song section from the database
   * input: id
   * returns: id, name
   */
  static async get(id) {
    const query = await db.query(`SELECT id, name FROM sections WHERE id=$1`, [id]);

    const section = query.rows[0];
    if (!section) throw new NotFoundError(`Section with id ${id} not found!`);
    return section;
  }
}

module.exports = Section;
