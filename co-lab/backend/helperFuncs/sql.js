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

module.exports = { projectUpdateQuery };
