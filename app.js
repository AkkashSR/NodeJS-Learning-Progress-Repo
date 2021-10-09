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
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

//express
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//middleware to pass user information
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

//admin and shop routes middleware
app.use("/admin", adminRoutes);
app.use("/", shopRoutes);

//middleware for the 404 error page
app.use(errorsController.get404Error);

//associations (very important)

//association for products and user
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

//{force: true}
//finding the user logged in/ creating the user if new user and then start the server
let localUser;
sequelize
  .sync()
  .then((result) => {
    //console.log(result);
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Akkash", emailId: "akkashsr@gmail.com" });
    }
    return Promise.resolve(user);
  })
  .then((user) => {
    localUser = user;
    return user.getCart();
  })
  .then((cart) => {
    if (!cart) {
      return localUser.createCart();
    }
    return Promise.resolve(cart);
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
