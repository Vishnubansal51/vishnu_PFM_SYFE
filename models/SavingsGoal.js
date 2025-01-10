const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');
const User = require('./User');

const SavingsGoal = sequelize.define('SavingsGoal', {
    targetAmount: { type: DataTypes.FLOAT, allowNull: false },
    targetDate: { type: DataTypes.DATEONLY, allowNull: false },
    progress: { type: DataTypes.FLOAT, defaultValue: 0 },
});

User.hasMany(SavingsGoal);
SavingsGoal.belongsTo(User);

module.exports = SavingsGoal;