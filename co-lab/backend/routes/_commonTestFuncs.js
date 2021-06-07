const db = require("../db");
const User = require("../models/user");
const Project = require("../models/project");
const Request = require("../models/request");
const { tokenFactory } = require("../helperFuncs/token");
const Arrangement = require("../models/arrangement");

// define arrays to hold ids of necessary testing resources
const projIds = [];
const reqIds = [];
const arrIds = [];
const secIds = [];

const beforeAllCommon = async () => {
  // delete anything in the database
  await db.query(`DELETE FROM users`);
  await db.query(`DELETE FROM sections`);

  // register some users;
  await User.register({
    username: "testuser1",
    firstName: "Test",
    lastName: "User1",
    password: "testpass1",
    email: "test1@test.com"
  });
  await User.register({
    username: "testuser2",
    firstName: "Test",
    lastName: "User2",
    password: "testpass2",
    email: "test2@test.com"
  });
  await User.register({
    username: "testuser3",
    firstName: "Test",
    lastName: "User3",
    password: "testpass3",
    email: "test3@test.com"
  });

  //   add some projects- two owned by u1, one owned by u2, and u3 will not own any to start
  projIds[0] = (await Project.create({
    title: "testproj1",
    owner: "testuser1"
  })).id;
  projIds[1] = (await Project.create({
    title: "testproj2",
    owner: "testuser1"
  })).id;
  projIds[2] = (await Project.create({
    title: "testproj3",
    owner: "testuser2"
  })).id;

  //   add two requests that are not yet responded to
  reqIds[0] = (await Request.makeRequest(projIds[0], "testuser1", "testuser2")).id;
  reqIds[1] = (await Request.makeRequest(projIds[2], "testuser2", "testuser3")).id;

  // store the arrangement ids for the default created arrangements;
  arrIds[0] = (await Arrangement.getAllForProject(projIds[0])).id;
  arrIds[1] = (await Arrangement.getAllForProject(projIds[1])).id;
  arrIds[2] = (await Arrangement.getAllForProject(projIds[2])).id;

  //   add some sections
  const sections = await db.query(
    `INSERT INTO sections (name) values ('intro'), ('verse'), ('chorus') RETURNING id`
  );
  secIds.splice(0, 0, ...sections.rows.map(s => s.id));
};

const beforeEachCommon = async () => {
  await db.query(`BEGIN`);
};
const afterEachCommon = async () => {
  await db.query(`ROLLBACK`);
};
const afterAllCommon = async () => {
  await db.end();
};

const u1token = tokenFactory({ username: "testuser1" });
const u2token = tokenFactory({ username: "testuser2" });

module.exports = {
  beforeAllCommon,
  beforeEachCommon,
  afterAllCommon,
  afterEachCommon,
  u1token,
  u2token,
  projIds,
  secIds,
  arrIds,
  reqIds
};
