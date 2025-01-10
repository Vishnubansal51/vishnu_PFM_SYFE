const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/finance_manager.sqlite',
});

sequelize
    .authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.error('Error connecting to the database:', err));

sequelize
    .sync({ alter: true }) 
    .then(() => console.log('Database synchronized'))
    .catch(err => console.error('Error synchronizing database:', err));

module.exports = { sequelize };