const path = require('path');

const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/product-list", shopController.getProducts);

router.get("/product-detail/:productId", shopController.getProductDetail);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/delete-product-from-cart", isAuth, shopController.postDeleteProductFromCart);

router.post("/create-order", isAuth, shopController.postOrder);

router.get("/orders", isAuth, shopController.getOrders);

module.exports = router;
