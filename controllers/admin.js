const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("./admin/add-products", {
    pageTitle: "Add a new product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res) => {
  const product = new Product(
    req.body.title,
    req.body.description,
    req.body.imageUrl,
    req.body.price,
    null,
    req.user._id
  );
  product
    .save()
    .then(() => {
      res.redirect("./products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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
  Product.findById(prodId)
    //Product.findByPk(prodId)
    .then((product) => {
      res.render("./admin/edit-product", {
        pageTitle: "Edit product",
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedDescription = req.body.description;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const product = new Product(
    updatedTitle,
    updatedDescription,
    updatedImageUrl,
    updatedPrice,
    prodId
  );
  product
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  Product.deleteById(req.body.productId)
    .then(result => {
      console.log(result);
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};
