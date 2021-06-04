const express = require("express");
const cors = require("cors");
const { ExpressError } = require("./expressError");
const app = express();
const userRoutes = require("./routes/users");
const requestsRoutes = require("./routes/requests");
const projectsRoutes = require("./routes/projects");
const cowriteRoutes = require("./routes/cowrites");
const arrangementsRoutes = require("./routes/arrangements");
const sectionsRoutes = require("./routes/sections");
const { authenticateToken } = require("./Middleware/auth");

const morgan = require("morgan");
app.use(cors());
// log responses to server console
app.use(morgan("dev"));
app.use(express.json());
app.use(authenticateToken);

app.use("/users", userRoutes);
app.use("/requests", requestsRoutes);
app.use("/projects", projectsRoutes);
app.use("/cowrites", cowriteRoutes);
app.use("/arrangements", arrangementsRoutes);
app.use("/sections", sectionsRoutes);

// 404 error handler
app.use((req, res, next) => {
  const err = new ExpressError("Not found", 404);
  return next(err);
});
// general error handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  return res.status(status).json({
    error: {
      message: err.message,
      status: status
    }
  });
});
module.exports = app;
