const Product = require("../models/product");
const Order = require("../models/order");

exports.getIndex = async (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("./shop/index", {
        products: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = async (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("./shop/product-list", {
        products: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = async (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      console.log(user.cart.items);
      const products = user.cart.items;
      res.render("./shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
  // const cart = await Cart.fetchCart();
  // const cartProducts = [];
  // let products = await Product.fetchAll();
  // for (let product of products) {
  //   const cartProductData = cart.products.find(
  //     (prod) => prod.id === product.id
  //   );
  //   if (cartProductData) {
  //     cartProducts.push({ productData: product, qty: cartProductData.qty });
  //   }
  // }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("./cart");
    })
    .catch((err) => console.log(err));
  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: req.body.productId } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }
  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //     }
  //     return Product.findByPk(req.body.productId);
  //   })
  //   .then((data) => {
  //     return fetchedCart.addProduct(data, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("./cart");
  //   })
  //   .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { quantity: item.quantity, product: { ...item.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("./cart");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      console.log(orders);
      res.render("./shop/orders", {
        path: "/orders",
        pageTitle: "Orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetail = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      console.log(product);
      res.render("./shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/product-list",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProductFromCart = async (req, res, next) => {
  req.user
    .removeFromCart(req.body.productId)
    .then(() => {
      res.redirect("./cart");
    })
    .catch((err) => console.log(err));
};
