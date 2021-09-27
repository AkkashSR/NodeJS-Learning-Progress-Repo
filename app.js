const path = require("path");

const express = require("express");

const app = express();

app.set('view engine' , 'pug');
app.set('views', 'views');

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const rootDir = require("./util/path");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")))

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle : 'Page not found'});
});

app.listen(3000);
