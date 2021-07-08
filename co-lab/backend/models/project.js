const db = require("../db");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const moment = require("moment");
const { updateQuery } = require("../helperFuncs/sql");
const Arrangement = require("./arrangement");

class Project {
  /**
   * Creates new project with given data
   *
   * input: Data (should include title and owner)
   * returns: id, title, owner, createdAt
   *
   * DISCLAIMER: this also creates a new entry in the Arrangements table corresponding to the new project, and an entry into the cowrites table corresponding to the new project with the provided owner
   */
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

  /**
   * Removes project from database
   *
   * input: project id
   * returns: projectId
   *
   *
   */

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

  /**
   * Fetches single project from database
   *
   * input: project id
   * returns: updatedAt, title, notes, owner, project Contributors
   *
   *
   */

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

    const contributorsQry = await db.query(`SELECT username FROM cowrites WHERE project_id=$1`, [
      id
    ]);

    foundProject.contributors = contributorsQry.rows.map(r => {
      return r.username;
    });

    return foundProject;
  }

  /**
   * Returns basic details for single project- this method is utilized for the request module on the front end
   *
   * input: id
   * returns: id, title, owner, updatedAt
   */
  static async getBasicDetails(id) {
    const result = await db.query(
      `SELECT     id,
                  title,
                  owner, 
                  updated_at AS "updatedAt"
            FROM projects
            WHERE id=$1`,
      [id]
    );

    const foundProject = result.rows[0];
    if (!foundProject) throw new NotFoundError(`Project not found`);

    return foundProject;
  }

  //

  /**
   * Updates project with given data
   * Data can include title and notes
   *
   * needs to update updatedAt each time, and can optionally update project title, notes
   * input: projectId, Data (can include title and/or owner)
   * returns: id, title, notes , updatedat
   *
   *
   */
  static async update(projectId, data) {
    const javascript = {
      updatedAt: "updated_at"
    };
    let { setTerms, setVals } = updateQuery(data, javascript);

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

    return project;
  }

  /**
   * Method to allow user to leave from a project
   *
   * input: id, username
   * returns: isOwner
   *
   * THIS METHOD DELETES THE PASSED USER FROM THE COWRITES TABLE FOR THE CORRESPONDING PROJECT ID. IF USER IS PROJECT OWNER, PROJECT GETS DELETED, OTHERWISE REQUEST IS DELETED
   *
   *
   *
   */

  static async leave(id, username) {
    try {
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
      } else {
        await db.query(`DELETE FROM requests WHERE project_id=$1 AND recipient=$2`, [id, username]);
      }
    } catch (error) {
      console.log("error", error);
    }
  }
}

module.exports = Project;
