const db = require("../db");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const moment = require("moment");

class Project {
  static async create(title, owner) {
    const qry = await db.query(
      `
            INSERT INTO projects (title, owner)
            VALUES ($1, $2)
            RETURNING id, title, owner, created_at AS "createdAt"
        `,
      [title, owner]
    );

    const project = qry.rows[0];
    project.createdAt = moment(project.createdAt)
      .local()
      .format("MMM. D, YYYY [at] h:mmA");
    return project;
  }

  static async remove(id) {
    const result = await db.query(
      `DELETE FROM projects
          WHERE id = $1
          RETURNING id`,
      [id]
    );

    const deletedProj = result.rows[0];

    if (!deletedProj) throw new NotFoundError(`Project with id ${id} not found. Could not delete`);
  }

  static async get(id) {
    const result = await db.query(
      `SELECT updated_at as "updatedAt",
                  title,
                  notes,
                  owner
            FROM projects
            WHERE id=$1`,
      [id]
    );

    const foundProject = result.rows[0];
    if (!foundProject) throw new NotFoundError(`Project not found`);
    foundProject.updatedAt = moment(foundProject.updatedAt)
      .local()
      .format("MMM D, YYYY [at] h:mmA");
    return foundProject;
  }
}

module.exports = Project;
