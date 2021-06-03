const db = require("../db");
const { BadRequestError } = require("../expressError");

function projectUpdateQuery(rowsToUpdate, javascript) {
  const updateKeys = Object.keys(rowsToUpdate);

  // convert javascript object to parameterized sql query
  const columnsToUpdate = updateKeys.map(
    (column, idx) => `"${javascript[column] || column}"=$${idx + 1}`
  );

  return {
    setTerms: columnsToUpdate.join(", "),
    setVals: Object.values(rowsToUpdate)
  };
}

async function arrangementProjectUpdate(projectId) {
  const query = await db.query(
    "UPDATE projects SET updated_at=CURRENT_TIMESTAMP WHERE id=$1 RETURNING updated_at",
    [projectId]
  );
  const updated = query.rows[0];

  if (!updated) throw new BadRequestError("Could not update project");
  return updated;
}

module.exports = { projectUpdateQuery, arrangementProjectUpdate };
