const db = require("../db");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const moment = require("moment");
const { projectUpdateQuery } = require("../helperFuncs/sql");
const Arrangement = require("./arrangement");

class Project {
  static async create({ title, owner }) {
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
      .format("MMM D, YYYY [at] h:mmA");

    // INSERT INTO COWRITES AS WELL
    await db.query(
      `INSERT INTO cowrites (project_id, username, is_owner)
        VALUES
        ($1, $2, true)
      `,
      [project.id, project.owner]
    );
    Arrangement.create(project.id);
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
      .format("MMM D, YYYY [at] h:mma");

    const contributorsQry = await db.query(`SELECT username FROM cowrites WHERE project_id=$1`, [
      id
    ]);

    foundProject.contributors = contributorsQry.rows.map(r => {
      return r.username;
    });

    return foundProject;
  }

  //   needs to update updatedAt each time, and can optionally update project title, notes
  static async update(projectId, data) {
    const javascript = {
      updatedAt: "updated_at"
    };
    let { setTerms, setVals } = projectUpdateQuery(data, javascript);

    setTerms =
      setTerms.length === 0
        ? `updated_at=CURRENT_TIMESTAMP`
        : (setTerms += `, updated_at=CURRENT_TIMESTAMP`);

    const projIdIdx = "$" + (setVals.length + 1);

    const sql = `UPDATE projects
                SET ${setTerms}
                WHERE id=${projIdIdx}
                RETURNING id,
                          updated_at AS "updatedAt",
                          title,
                          notes`;

    const res = await db.query(sql, [...setVals, projectId]);
    const project = res.rows[0];

    if (!project) throw new NotFoundError("Project not found! Could not update");
    project.updatedAt = moment(project.updatedAt)
      .local()
      .format("MMM D, YYYY [at] h:mma");

    return project;
  }

  static async leave(id, username) {
    const qry = await db.query(
      `DELETE FROM cowrites
          WHERE (project_id=$1 AND username=$2)
          returning is_owner as "isOwner"`,
      [id, username]
    );
    const deleted = qry.rows[0];
    if (!deleted)
      throw new BadRequestError(
        `User with username ${username} not a cowriter on projectd with id ${id}`
      );
    if (deleted.isOwner === true) {
      await db.query(`DELETE FROM projects WHERE id=$1`, [id]);
    }
  }
}

module.exports = Project;
