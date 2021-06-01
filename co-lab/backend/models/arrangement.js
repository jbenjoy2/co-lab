const db = require("../db");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const moment = require("moment");
const { arrangementProjectUpdate } = require("../helperFuncs/sql");

class Arrangement {
  static async create(projectId) {
    const query = await db.query(
      `INSERT INTO arrangements(project_id) VALUES($1) RETURNING project_id`,
      [projectId]
    );
    const inserted = query.rows[0];
    await arrangementProjectUpdate(projectId);
    return inserted;
  }
  static async add(projectId, sectionId, position) {
    const query = await db.query(
      `INSERT INTO arrangements(project_id, section_id, position) VALUES($1, $2, $3) RETURNING id, project_id AS "projectId", section_id AS "sectionId", position AS "index",updated_at AS "updatedAt"`,
      [projectId, sectionId, position]
    );

    const added = query.rows[0];
    if (!added) {
      throw new BadRequestError("Could not add new arrangement");
      return;
    }

    added.updatedAt = moment(added.updatedAt)
      .local()
      .format("MMM D, YYYY [at] h:mmA");

    await arrangementProjectUpdate(projectId);
    return added;
  }

  static async update(id, newPosition) {
    const query = await db.query(
      `UPDATE arrangements SET position=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2 RETURNING id, project_id AS "projectId", section_id AS "sectionId", position AS "index",updated_at AS "updatedAt"`,
      [newPosition, id]
    );

    const updated = query.rows[0];
    if (!updated) {
      throw new BadRequestError("Could not update arrangement");
      return;
    }
    updated.updatedAt = moment(updated.updatedAt)
      .local()
      .format("MMM D, YYYY [at] h:mmA");
    await arrangementProjectUpdate(projectId);
    return updated;
  }
  static async getAllForProject(projectId) {
    const query = await db.query(
      `SELECT a.id, s.id as "section id", s.name as "Section Name", a.position AS "index" FROM arrangements a LEFT JOIN sections s ON a.section_id=s.id WHERE a.project_id=$1 ORDER BY a.position`,
      [projectId]
    );
    const projectArrangement = query.rows;

    if (!projectArrangement.length) {
      throw new NotFoundError("Could not find arrangement for project with id of " + projectId);
    }
    return projectArrangement;
  }
  static async remove(id) {
    const res = await db.query(`DELETE FROM arrangements WHERE id=$1 RETURNING id, project_id`, [
      id
    ]);
    const deletedArrangement = res.rows[0];

    if (!deletedArrangement) {
      throw new NotFoundError(`Arrangement with id ${id} not found. Could not delete`);
      return;
    }

    await arrangementProjectUpdate(deletedArrangement.project_id);
  }
  //   reset status of arrangement for a project to starting point
  static async clear(projectId) {
    const query = await db.query(
      `DELETE FROM arrangements WHERE project_id=$1 returning project_id`,
      [projectId]
    );
    const cleared = query.rows[0];
    if (!cleared) throw new NotFoundError(`Project with id ${projectId} not found!`);

    const restart = await this.create(projectId);
    await arrangementProjectUpdate(projectId);
  }
}

module.exports = Arrangement;
