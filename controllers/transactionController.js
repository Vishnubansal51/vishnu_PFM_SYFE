const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// Create Transaction
const createTransaction = async (req, res) => {
    const { amount, date, description, type, CategoryId } = req.body;

    
    const userId = req.user.id;
   
    if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ message: "Invalid transaction type. Use 'income' or 'expense'." });
    }

   
    if (type === 'expense' && !CategoryId) {
        return res.status(400).json({ message: "CategoryId is required for expense transactions." });
    }

    try {
        const transaction = await Transaction.create({
            amount,
            date,
            description,
            type,
            CategoryId: type === 'income' ? null : CategoryId, 
            UserId: userId,
        });
        res.status(201).json({ message: 'Transaction added successfully', transaction });
    } catch (error) {
        res.status(500).json({ message: 'Error adding transaction', error });
    }
};

// Get Transactions
const getTransactions = async (req, res) => {
    const userId = req.user.id; 
    try {
        const transactions = await Transaction.findAll({
            where: { UserId: userId },
            include: Category,
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving transactions', error });
    }
};

// Update Transaction
const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { amount, date, description, type, CategoryId } = req.body;

    // Validate type
    
    if (type && !['income', 'expense'].includes(type)) {
        return res.status(400).json({ message: "Invalid transaction type. Use 'income' or 'expense'." });
    }


    if (type === 'expense' && !CategoryId) {
        return res.status(400).json({ message: "CategoryId is required for expense transactions." });
    }

    try {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        await transaction.update({
            amount,
            date,
            description,
            type,
            CategoryId: type === 'income' ? null : CategoryId, // Ensure CategoryId is null for income
        });
        res.json({ message: 'Transaction updated successfully', transaction });
    } catch (error) {
        res.status(500).json({ message: 'Error updating transaction', error });
    }
};

// Delete Transaction
const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        await transaction.destroy();
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting transaction', error });
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
};
