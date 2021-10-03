const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-js', 'root', 'password123', {dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;