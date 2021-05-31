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

  static async makeRequest(sender, recipient, project_id) {
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
      .format("M-DD-YYYY at h:mmA");
    return request;
  }
}

module.exports = Request;
