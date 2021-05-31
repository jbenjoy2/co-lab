const express = require("express");
const cors = require("cors");
const { ExpressError } = require("./expressError");
const app = express();
const userRoutes = require("./routes/users");
const requestsRoutes = require("./routes/requests");
app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/requests", requestsRoutes);

// 404 error handler
app.use((req, res, next) => {
  const err = new ExpressError("Not found", 404);
  return next(err);
});
// general error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  return res.status(status).json({
    error: {
      message: err.message,
      status: status
    }
  });
});
module.exports = app;
