const fs = require("fs").promises;
const path = require("path");

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  async save() {
    this.id = Math.random().toString();
    const p = path.join(
      path.dirname(require.main.filename),
      "data",
      "products.json"
    );
    const data = await fs.readFile(p);
    let products = [];
    products = JSON.parse(data);
    products.push(this);
    fs.writeFile(p, JSON.stringify(products), (err) => console.log(err));
  }

  static async fetchAll() {
    const p = path.join(
      path.dirname(require.main.filename),
      "data",
      "products.json"
    );
    let data = await fs.readFile(p);
    return JSON.parse(data);
  }

  static async findById(id){
    const products = await Product.fetchAll();
    return products.find((prod) => prod.id === id);
  }
};
