const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');
const User = require('./User');

const Category = sequelize.define('Category', {
    name: { type: DataTypes.STRING, allowNull: false },
});


User.hasMany(Category);
Category.belongsTo(User);

module.exports = Category;
