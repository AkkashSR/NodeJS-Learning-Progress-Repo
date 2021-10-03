const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = async (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("./shop/index", {
        products: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = async (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("./shop/product-list", {
        products: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = async (req, res, next) => {
  const cart = await Cart.fetchCart();
  const cartProducts = [];
  let products = await Product.fetchAll();
  for (let product of products) {
    const cartProductData = cart.products.find(
      (prod) => prod.id === product.id
    );
    if (cartProductData) {
      cartProducts.push({ productData: product, qty: cartProductData.qty });
    }
  }
  res.render("./shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
    cart: cart,
    products: cartProducts,
    totalPrice: cart.totalPrice,
  });
};

exports.postCart = async (req, res, next) => {
  const product = await Product.findById(req.body.productId);
  Cart.addProduct(req.body.productId, product.price);
  res.redirect("./cart");
};

exports.getCheckout = (req, res, next) => {
  res.render("./shop/checkout", { pageTitle: "Checkout", path: "/checkout" });
};

exports.getOrders = (req, res, next) => {
  res.render("./shop/orders", { path: "/orders", pageTitle: "Orders" });
};

exports.getProductDetail = (req, res, next) => {
  Product.findByPk(req.params.productId)
    .then((product) => {
      res.render("./shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/product-list",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProductFromCart = async (req, res, next) => {
  const productPrice = await Product.findById(req.body.productId).price;
  Cart.delete(req.body.productId, productPrice);
  res.redirect("./cart");
};
