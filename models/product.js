const mongoDb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, description, imageUrl, price, id, userId) {
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
    id ? (this._id = mongoDb.ObjectId(id)) : null;
    this.userId = userId
  }

  save() {
    const db = getDb();
    let dbOperation;
    if (this._id) {
      dbOperation = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOperation = db.collection("products").insertOne(this);
    }

    return dbOperation
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongoDb.ObjectId(prodId) })
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => console.log(err));
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongoDb.ObjectId(prodId) })
      .then(result => {
        console.log("Deleted");
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
