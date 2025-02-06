const express = require("express");
const securityMiddleware = require('./middlewares/security.middleware')

const app = express();
app.use(express.text({ type: "text/plain" }));

app.get("/", (req, res) => res.send("API running"));

app.use("/emails", securityMiddleware.verifyAuthorization, require("./routes/emails.routes"));

module.exports = app;