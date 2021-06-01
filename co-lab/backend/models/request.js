const db = require("../db");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");
const moment = require("moment");

class Request {
  static async getRequestsForUser(username) {
    const query = await db.query(
      `
            SELECT sender, 
            sent_at AS "sentAt"
            FROM requests
            WHERE recipient = $1`,
      [username]
    );

    // adjust sentAt time format
    query.rows.forEach(row => {
      let sent = row["sentAt"];
      row["sentAt"] = moment(sent)
        .local()
        .format("M-DD-YYYY h:mmA");
    });

    return query.rows;
  }

  static async makeRequest(project_id, sender, recipient) {
    const dupCheck = await db.query(
      `
        SELECT id, accepted 
        FROM requests 
        WHERE project_id=$1 AND sender=$2 AND recipient=$3 AND (accepted IS null OR accepted IS true)`,
      [project_id, sender, recipient]
    );
    console.log(project_id, sender, recipient);
    const dupRequest = dupCheck.rows[0];
    console.log(dupCheck);
    if (dupRequest) {
      throw new BadRequestError("Request is already pending");
      return;
    }

    const query = await db.query(
      `
        INSERT INTO requests (project_id, sender, recipient)
        VALUES ($1, $2, $3)
        RETURNING sender, recipient, accepted, sent_at AS "sentAt" 
      `,
      [project_id, sender, recipient]
    );

    const request = query.rows[0];
    request["sentAt"] = moment(request["sentAt"])
      .local()
      .format("M-DD-YYYY [at] h:mmA");
    return request;
  }

  static async accept(requestId) {
    const statusCheck = await db.query(`SELECT accepted FROM requests WHERE id=$1`, [requestId]);

    const status = statusCheck.rows[0];

    if (status.accepted !== null) {
      throw new BadRequestError("This request has already been resolved");
      return;
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
      return;
    }
    // insert new collaborations into cowrites using returned projectID, sender, recipient;
    const { project_id, sender, recipient } = result;
    const insert = await db.query(
      `
        INSERT INTO cowrites(project_id, username, is_owner)
        VALUES
        ($1, $2, true),
        ($3, $4, false)
        RETURNING id
    `,
      [project_id, sender, project_id, recipient]
    );

    const insertRes = insert.rows[0];
    if (!insertRes) {
      throw new BadRequestError("Collaboration could not be made. Please try again");
      return;
    }
    return result;
  }

  static async reject(requestId) {
    const qry = await db.query(
      `
        UPDATE requests
        SET accepted=false
        WHERE id=$1
        RETURNING project_id, sender, recipient
      `,
      [requestId]
    );
    const result = qry.rows[0];
    if (!result) {
      throw new NotFoundError(`Request not found and could not be rejected`);
      return;
    }
    return result;
  }
}

module.exports = Request;
