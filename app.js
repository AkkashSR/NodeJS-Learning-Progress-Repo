const path = require("path");

const express = require("express");

const app = express();

app.set('view engine' , 'pug');
app.set('views', 'views');

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorsController = require('./controllers/errors')

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))

app.use("/admin", adminRoutes);
app.use("/",shopRoutes);

app.use(errorsController.get404Error);

app.listen(3000);
