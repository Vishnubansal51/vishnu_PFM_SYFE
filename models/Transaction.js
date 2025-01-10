const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');
const User = require('./User');
const Category = require('./Category');

// const Transaction = sequelize.define('Transaction', {
//     amount: { type: DataTypes.FLOAT, allowNull: false },
//     date: { type: DataTypes.DATEONLY, allowNull: false },
//     category: { type: DataTypes.STRING, allowNull: false },
//     description: { type: DataTypes.STRING },
// });

// User.hasMany(Transaction);
// Transaction.belongsTo(User);

// const Transaction = sequelize.define('Transaction', {
//     amount: { type: DataTypes.FLOAT, allowNull: false },
//     date: { type: DataTypes.DATEONLY, allowNull: false },
//     description: { type: DataTypes.STRING },
// });

const Transaction = sequelize.define('Transaction', {
    amount: { type: DataTypes.FLOAT, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    description: { type: DataTypes.STRING },
    type: { 
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false,
    },
});


// Relationship between Transaction and User
User.hasMany(Transaction);
Transaction.belongsTo(User);

// Relationship between Transaction and Category
Category.hasMany(Transaction);
Transaction.belongsTo(Category);

module.exports = Transaction;