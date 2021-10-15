const path = require("path");

const express = require("express");

const app = express();

//setting the template engine
app.set("view engine", "pug");
app.set("views", "views");

//imports
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorsController = require("./controllers/errors");
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");

app.use((req, res, next) => {
  User.findById("6168718a177f2fcd55b68618")
    .then((user) => {
      req.user = user;
      console.log(user);
      next();
    })
    .catch((err) => console.log(err));
});

//express
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//admin and shop routes middleware
app.use("/admin", adminRoutes);
app.use("/", shopRoutes);

//middleware for the 404 error page
app.use(errorsController.get404Error);

mongoConnect(() => {
  app.listen(3000);
});
