const express = require("express");
const path = require("path");
const securityMiddleware = require('./middlewares/security.middleware')

const app = express();
app.use(express.text({ type: "text/plain", limit: "10mb" }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/emails", securityMiddleware.verifyAuthorization, require("./routes/emails.routes"));

module.exports = app;