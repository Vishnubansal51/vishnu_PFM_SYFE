const Category = require('../models/Category');

const addCategory = async (req, res) => {
    const { name } = req.body; 
    const userId = req.user.id; 

    try {
        const category = await Category.create({ name, UserId: userId });
        res.status(201).json({ message: 'Category added successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Error adding category', error });
    }
};

const getCategories = async (req, res) => {
    const userId = req.user.id; 

    try {
        const categories = await Category.findAll({ where: { UserId: userId } });
        res.json(categories);
    } catch (error) {
        
        res.status(500).json({ message: 'Error retrieving categories', error });
    }
};

module.exports = { addCategory, getCategories };
