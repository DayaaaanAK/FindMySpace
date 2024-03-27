require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

const tenantRoutes = require("./src/routes/tenantRoutes");
const landlordRoutes = require("./src/routes/landlordRoutes");
const propertyRoutes = require("./src/routes/propertyRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");
const oauthRoutes = require("./src/routes/oauthRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.DATABASE_URL, {})
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((error) => {
    console.log(error);
  });

require("./src/config/passport");

app.use("/tenant", tenantRoutes);
app.use("/landlord", landlordRoutes);
app.use("/property", propertyRoutes);
app.use("/application", applicationRoutes);
app.use("/", oauthRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to FindMySpace!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
