const path = require("path");
const fs = require("fs").promises;

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static async addProduct(id, productPrice) {
    const data = await fs.readFile(p);
    let cart = JSON.parse(data);
    let existingProductIndex = cart.products.findIndex(
      (prod) => prod.id === id
    );
    let existingProduct = cart.products[existingProductIndex];
    let updatedProduct;
    if (existingProduct) {
      updatedProduct = { ...existingProduct };
      updatedProduct.qty += 1;
      cart.products = [...cart.products];
      cart.products[existingProductIndex] = updatedProduct;
    } else {
      updatedProduct = { id: id, qty: 1 };
      cart.products = [...cart.products, updatedProduct];
    }
    cart.totalPrice = cart.totalPrice + +productPrice;
    fs.writeFile(p, JSON.stringify(cart), (error) => console.log(error));
  }

  static async delete(id, productPrice) {
    const data = await fs.readFile(p);
    let cart = JSON.parse(data);
    let updatedCart = { ...cart };
    let product = cart.products.find((prod) => prod.id === id);
    if(!product){
        return;
    }
    let updatedProducts = cart.products.filter((prod) => prod.id !== id);
    updatedCart.products = updatedProducts;

    updatedCart.totalPrice = cart.price - +productPrice * product.qty;

    fs.writeFile(p, JSON.stringify(updatedCart), (error) => console.log(error));
  }

  static async fetchCart(){
    const data = await fs.readFile(p);
    return JSON.parse(data);
  }
};
