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
    req.body.imageUrl,
    req.body.description,
    req.body.price
  );
  product.save();
  res.redirect("/admin/products");
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();
  res.render("./admin/products", {
    products: products,
    pageTitle: "Admin Products",
    path: "/admin/products",
  });
};

exports.getEditProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const product = await Product.findById(prodId);
  res.render('./admin/edit-product', {pageTitle: "Edit product", path: "./admin/add-products", product: product});
}
