const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = async (req, res, next) => {
    const products = await Product.fetchAll();
    res.render("./shop/index", { products: products, pageTitle: "Shop", path: "/" });
}

exports.getProducts = async (req, res, next) => {
    const products = await Product.fetchAll();
    res.render("./shop/product-list", { products: products, pageTitle: "Shop", path: "/product-list" });
};

exports.getCart = (req, res, next) => {
    res.render("./shop/cart", {pageTitle : "Cart", path: "/cart"});
}

exports.postCart = async (req, res, next) => {
    const product = await Product.findById(req.body.productId);
    Cart.addProduct(req.body.productId, product.price);
    res.redirect("./cart");
}

exports.getCheckout = (req, res, next) => {
    res.render("./shop/checkout", {pageTitle: "Checkout", path: "/checkout"});
}

exports.getOrders = (req, res, next) => {
    res.render("./shop/orders", {path:"/orders", pageTitle: "Orders"})
}

exports.getProductDetail = async (req, res, next) => {
    const prodId = req.params.productId;
    const product = await Product.findById(prodId);
    res.render("./shop/product-detail", {product : product, pageTitle: product.title, path: "/product-list"});
}