const path = require('path');

const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/product-list", shopController.getProducts);

router.get("/product-detail/:productId", shopController.getProductDetail);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/delete-product-from-cart",shopController.postDeleteProductFromCart);

router.post("/create-order", shopController.postOrder);

router.get("/orders", shopController.getOrders);

module.exports = router;
