const db = require("../db");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const moment = require("moment");
const { user } = require("../db");

class Request {
  /**
   * get all pending requests for a given user
   * input: username
   * returns: requestID, sender, sentAt, projectId, accepted (boolean or null)
   *
   *
   */

  static async getRequestsForUser(username) {
    // check for invalid user
    const userCheck = await db.query(`SELECT username FROM users WHERE username=$1`, [username]);

    const user = userCheck.rows[0];

    if (!user) {
      throw new NotFoundError(`User with username: ${username} not found`);
    }
    const query = await db.query(
      `
            SELECT id AS "requestID", sender, 
            sent_at AS "sentAt", project_id AS "projectId", accepted
            FROM requests
            WHERE recipient = $1`,
      [username]
    );

    // adjust sentAt time format

    return query.rows;
  }

  /*
   * get all pending requests for a projectId in order to determine what is  * pending on a given project
   *
   * input: projectId
   * returns: requestID, sentAt, accepted (boolean or null)
   *
   */

  static async getRequestsByProjectId(projectId) {
    // check for invalid project
    const projCheck = await db.query(`select title from projects where id=$1`, [projectId]);
    const proj = projCheck.rows[0];
    if (!proj) {
      throw new NotFoundError("Could not find project");
    }
    const query = await db.query(
      `
      SELECT id AS "requestID", sender,recipient, 
            sent_at AS "sentAt", accepted
            FROM requests
            WHERE project_id= $1`,
      [projectId]
    );
    return query.rows;
  }

  /**
   * get full details for a single request
   * input: id
   * returns: projectId, recipient
   *
   *
   */
  static async getSingleRequest(id) {
    const res = await db.query(
      `SELECT project_id AS "projectId", recipient FROM requests WHERE id=$1`,
      [id]
    );
    const request = res.rows[0];
    if (!request) throw new NotFoundError("Could not find request with given id");
    return request;
  }

  /**
   * make a new request between users for a given project
   * input: project_id, sender, recipient
   * returns: id, sender, recipient, accepted(boolean or null), sentAt
   *
   *
   */
  static async makeRequest(project_id, sender, recipient) {
    const dupCheck = await db.query(
      `
        SELECT id, accepted 
        FROM requests 
        WHERE project_id=$1 AND sender=$2 AND recipient=$3 AND (accepted IS null)`,
      [project_id, sender, recipient]
    );

    const dupRequest = dupCheck.rows[0];

    if (dupRequest) {
      throw new BadRequestError("Request is already pending");
    }

    const query = await db.query(
      `
        INSERT INTO requests (project_id, sender, recipient)
        VALUES ($1, $2, $3)
        RETURNING id, sender, recipient, accepted, sent_at AS "sentAt" 
      `,
      [project_id, sender, recipient]
    );

    const request = query.rows[0];
    request["sentAt"] = moment(request["sentAt"])
      .local()
      .format("M-DD-YYYY [at] h:mmA");
    return request;
  }

  /**
   * accept a pending request
   * input: requestId
   * returns: id, projectId, sender, recipient, accepted (boolean or null)
   *
   * DISCLAIMER: this also adds a new column into the Cowrites table to reflect that this user is now a contributor on the project
   */

  static async accept(requestId) {
    const statusCheck = await db.query(`SELECT accepted FROM requests WHERE id=$1`, [requestId]);

    const status = statusCheck.rows[0];

    if (status && status.accepted !== null) {
      throw new BadRequestError("This request has already been resolved");
    }
    const qry = await db.query(
      `
        UPDATE requests
        SET accepted=TRUE
        WHERE id=$1
        RETURNING id, project_id, sender, recipient, accepted
      `,
      [requestId]
    );

    const result = qry.rows[0];

    if (!result) {
      throw new NotFoundError(`Request not found and could not be accepted`);
    }
    // insert new collaborations into cowrites using returned projectID, recipient; owner will already exist in table
    const { project_id, recipient } = result;
    const insert = await db.query(
      `
        INSERT INTO cowrites(project_id, username, is_owner)
        VALUES
        ($1, $2, false)
        RETURNING id
    `,
      [project_id, recipient]
    );

    const insertRes = insert.rows[0];
    if (!insertRes) {
      throw new BadRequestError("Collaboration could not be made. Please try again");
    }
    return result;
  }

  /**
   * reject a pending request
   * input: requestId
   * returns: id, projectId, sender, recipient, accepted (boolean or null)
   *
   * D
   */
  static async reject(requestId) {
    const statusCheck = await db.query(`SELECT accepted FROM requests WHERE id=$1`, [requestId]);

    const status = statusCheck.rows[0];

    if (status && status.accepted !== null) {
      throw new BadRequestError("This request has already been resolved");
    }
    const qry = await db.query(
      `
        UPDATE requests
        SET accepted=false
        WHERE id=$1
        RETURNING id, project_id, sender, recipient, accepted
      `,
      [requestId]
    );
    const result = qry.rows[0];

    if (!result) {
      throw new NotFoundError(`Request not found and could not be rejected`);
    }
    return result;
  }
}

module.exports = Request;
