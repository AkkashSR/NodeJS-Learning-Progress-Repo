const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const MONGODB_URI =
  "mongodb://127.0.0.1:27017/shop?directConnection=true&serverSelectionTimeoutMS=2000";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

//setting the template engine
app.set("view engine", "pug");
app.set("views", "views");

//imports
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorsController = require("./controllers/errors");
const User = require("./models/user");

//express
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

//admin and shop routes middleware
app.use("/admin", adminRoutes);
app.use("/", shopRoutes);
app.use(authRoutes);

//middleware for the 404 error page
app.use(errorsController.get404Error);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const newUser = new User({
          name: "Akkash",
          email: "akkashsr@gmail.com",
          cart: {
            items: [],
          },
        });
        newUser.save();
      }
    });
    console.log("Connected");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
