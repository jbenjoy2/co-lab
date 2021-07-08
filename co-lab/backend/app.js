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
const axios = require("axios");
const { QUOTE_KEY } = require("./config");
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

app.get("/rhymes/:word", async (req, res, next) => {
  const word = req.params.word;
  try {
    const results = await axios.get(`https://api.datamuse.com/words?rel_rhy=${word}&max=100`);
    const foundRhymes = results.data;
    return res.json({ foundRhymes });
  } catch (error) {
    return next(error);
  }
});
app.get("/quote", async (req, res, next) => {
  try {
    const results = await axios.get(`https://zenquotes.io/api/random/${QUOTE_KEY}`);
    const foundQuote = results.data[0];
    return res.json({ foundQuote });
  } catch (error) {
    return next(error);
  }
});
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
