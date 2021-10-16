const Product = require("../models/product");

exports.getIndex = async (req, res, next) => {
  Product.fetchAll()
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
  Product.fetchAll()
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
  req.user
    .getCart()
    .then((products) => {
      res.render("./shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: products,
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
  let fetchCart;
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("./orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("./shop/orders", {
        path: "/orders",
        pageTitle: "Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetail = (req, res, next) => {
  Product.findById(req.params.productId)
    .then((product) => {
      console.log(product);
      res.render("./shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/product-list",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProductFromCart = async (req, res, next) => {
  req.user
    .deleteItemFromCart(req.body.productId)
    .then(() => {
      res.redirect("./cart");
    })
    .catch((err) => console.log(err));
};
