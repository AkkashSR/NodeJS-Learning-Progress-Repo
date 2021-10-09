const Product = require("../models/product");

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
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render("./shop/cart", {
            pageTitle: "Cart",
            path: "/cart",
            cart: cart,
            products: products,
            totalPrice: cart.totalPrice,
          });
        })
        .catch((err) => console.log(err));
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
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: req.body.productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
      }
      return Product.findByPk(req.body.productId);
    })
    .then((data) => {
      return fetchedCart.addProduct(data, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("./cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      return fetchCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("./orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({include : ['products']})
    .then((orders) => {
      console.log(orders[0].products[0].orderItem);
      res.render("./shop/orders", { path: "/orders", pageTitle: "Orders", orders: orders });
    })
    .catch((err) => console.log(err));
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
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: req.body.productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect("./cart");
    })
    .catch((err) => console.log(err));
};
