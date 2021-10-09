const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("./admin/add-products", {
    pageTitle: "Add a new product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res) => {
  req.user
    .createProduct({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
    })
    .then(() => {
      res.redirect("./products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("./admin/products", {
        products: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } })
    //Product.findByPk(prodId)
    .then((products) => {
      res.render("./admin/edit-product", {
        pageTitle: "Edit product",
        product: products[0],
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  Product.findByPk(req.body.productId)
    .then((product) => {
      product.title = req.body.title;
      product.price = req.body.price;
      product.description = req.body.description;
      product.imageUrl = req.body.imageUrl;
      return product.save();
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  Product.findByPk(req.body.productId)
    .then((product) => {
      return product.destroy();
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};
