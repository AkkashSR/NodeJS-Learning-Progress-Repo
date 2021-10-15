const getDb = require("../util/database").getDb;
const mongoDb = require('mongodb');


class User {
  constructor(name, email, cart) {
    this.name = name;
    this.email = email;
    this.cart = cart;
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  addToCart(product){

  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongoDb.ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
