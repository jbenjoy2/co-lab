const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");
const projIDs = [];
const reqIDs = [];
const secIds = [];

const beforeAllCommon = async () => {
  // database actions before all of them to reset the database;

  // delete all users no where clause needed; will, on cascade, delete any other cells since they're all somehow tied back to a user (except for sections)
  await db.query(`DELETE FROM users;`);
  await db.query(`DELETE FROM sections`);

  //   add some users
  await db.query(
    `INSERT INTO users(username, first_name, last_name, email, password)
       VALUES ('u1', 'U1F', 'U1L', 'u1@email.com', $1),
              ('u2', 'U2F', 'U2L', 'u2@email.com', $2)
       RETURNING username`,
    [
      await bcrypt.hash("testpass", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("testpass", BCRYPT_WORK_FACTOR)
    ]
  );

  //   ADD A PROJECT
  const proj = await db.query(
    `INSERT INTO projects (title, owner) VALUES ('testproj', 'u1') RETURNING id`
  );
  projIDs.splice(0, 0, ...proj.rows.map(p => p.id));

  //   add the cowrite for the project
  await db.query(`INSERT INTO cowrites(project_id, username, is_owner) VALUES ($1, 'u1', true)`, [
    projIDs[0]
  ]);

  //   add a blank arrangement
  await db.query(`INSERT INTO arrangements(project_id ) VALUES($1)`, [projIDs[0]]);

  //   add some test sections of intro, verse and chorus
  const sections = await db.query(
    `INSERT INTO sections (name) values ('intro'), ('verse'), ('chorus') RETURNING id`
  );
  secIds.splice(0, 0, ...sections.rows.map(s => s.id));

  //   add a request to collaborate
  const request = await db.query(
    `INSERT INTO requests (project_id, sender, recipient) VALUES ($1, 'u1', 'u2') RETURNING id`,
    [projIDs[0]]
  );
  reqIDs.splice(0, 0, ...request.rows.map(r => r.id));
};

// start a new transaction each test
const beforeEachCommon = async () => {
  await db.query("BEGIN");
};

// roll back after each transaction to reset from any changes test did
const afterEachCommon = async () => {
  await db.query("ROLLBACK");
};

// close out connection to database
const afterAllCommon = async () => {
  await db.end();
};

module.exports = {
  beforeAllCommon,
  beforeEachCommon,
  afterEachCommon,
  afterAllCommon,
  reqIDs,
  projIDs,
  secIds
};
