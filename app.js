const path = require("path");

const express = require("express");

const app = express();

app.set('view engine' , 'pug');
app.set('views', 'views');

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorsController = require('./controllers/errors');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))

app.use("/admin", adminRoutes);
app.use("/",shopRoutes);

app.use(errorsController.get404Error);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

sequelize.sync({force: true}).then((result) => {
    //console.log(result);
    app.listen(3000);
})
.catch((err) => {
    console.log(err);
});


