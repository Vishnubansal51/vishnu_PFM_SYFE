const SavingsGoal = require('../models/SavingsGoal');
const Transaction = require('../models/Transaction');

const addSavingsGoal = async (req, res) => {
    const { targetAmount, targetDate } = req.body;
    const userId = req.user.id;
    try {
        const savingsGoal = await SavingsGoal.create({
            targetAmount,
            targetDate,
            UserId: userId,
        });
        res.status(201).json({ message: 'Savings goal created successfully', savingsGoal });
    } catch (error) {
        res.status(500).json({ message: 'Error creating savings goal', error });
    }
};

const getSavingsGoals = async (req, res) => {
 
    const userId = req.user.id;
    try {
        const savingsGoals = await SavingsGoal.findAll({ where: { UserId: userId } });

        // Calculate progress for each goal
        for (const goal of savingsGoals) {
            const transactions = await Transaction.findAll({ where: { UserId: userId } });

            // Calculate total income and expenses
            const totalIncome = transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const totalExpenses = transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            // Calculate savings and progress
            const totalSavings = totalIncome - totalExpenses;
            goal.progress = Math.min((totalSavings / goal.targetAmount) * 100, 100); // Cap progress at 100%
        }

        res.json(savingsGoals);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving savings goals', error });
    }
};

module.exports = { addSavingsGoal, getSavingsGoals };
