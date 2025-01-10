const { saveChartToFile } = require('../utilites/saveChartToFile')
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

const chartCanvas = new ChartJSNodeCanvas({ width: 800, height: 600 });

// Helper Function: Generate Pie Chart
const generatePieChart = async (data) => {
    const labels = Object.keys(data);
    const values = Object.values(data).map((category) => category.expense);

    const config = {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Spending by Category',
                data: values,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            }],
        },
    };

    return await chartCanvas.renderToDataURL(config);
};

// Helper Function: Generate Bar Graph
const generateBarGraph = async (data) => {
    const labels = Object.keys(data);
    const values = Object.values(data).map((category) => category.expense);

    const config = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Spending by Category',
                data: values,
                backgroundColor: '#36A2EB',
            }],
        },
        options: {
            scales: {
                y: { beginAtZero: true },
            },
        },
    };

    return await chartCanvas.renderToDataURL(config);
};



const generateMonthlyReport = async (req, res) => {
    const { month, year } = req.query;
    if (!month || !year) {
        return res.status(400).json({ message: 'Missing query parameters: month or year' });
    }

    const userId = req.user.id;

    try {
        const transactions = await Transaction.findAll({
            where: { UserId: userId },
            include: Category,
        });

        const filtered = transactions.filter(transaction => {
            const date = new Date(transaction.date);
            return date.getMonth() + 1 === parseInt(month) && date.getFullYear() === parseInt(year);
        });

        const totalIncome = filtered
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = filtered
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const categoryBreakdown = filtered.reduce((acc, t) => {
            const categoryName = t.Category ? t.Category.name : 'Uncategorized';
            if (!acc[categoryName]) {
                acc[categoryName] = { income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                acc[categoryName].income += t.amount;
            }
            if (t.type === 'expense') {
                acc[categoryName].expense += t.amount;
            }
            return acc;
        }, {});

        // Generate charts
        const pieChart = await generatePieChart(categoryBreakdown);
        const barGraph = await generateBarGraph(categoryBreakdown);

        // Create unique filenames
        const timestamp = Date.now();
        const pieChartFilename = `user_${userId}_monthly_pie_chart_${timestamp}.png`;
        const barGraphFilename = `user_${userId}_monthly_bar_graph_${timestamp}.png`;

        const pieChartPath = saveChartToFile(pieChart, pieChartFilename);
        const barGraphPath = saveChartToFile(barGraph, barGraphFilename);

        res.json({
            totalIncome,
            totalExpense,
            categoryBreakdown,
            pieChartPath,
            barGraphPath,
            transactions: filtered,
        });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Error generating report', error });
    }
};

const generateYearlyReport = async (req, res) => {
    const { year } = req.query;
    if (!year) {
        return res.status(400).json({ message: 'Missing query parameter: year' });
    }

    const userId = req.user.id;

    try {
        const transactions = await Transaction.findAll({
            where: { UserId: userId },
            include: Category,
        });

        const filtered = transactions.filter(transaction => {
            const date = new Date(transaction.date);
            return date.getFullYear() === parseInt(year);
        });

        const totalIncome = filtered
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = filtered
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const categoryBreakdown = filtered.reduce((acc, t) => {
            const categoryName = t.Category ? t.Category.name : 'Uncategorized';
            if (!acc[categoryName]) {
                acc[categoryName] = { income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                acc[categoryName].income += t.amount;
            }
            if (t.type === 'expense') {
                acc[categoryName].expense += t.amount;
            }
            return acc;
        }, {});

        const pieChart = await generatePieChart(categoryBreakdown);
        const barGraph = await generateBarGraph(categoryBreakdown);

        const timestamp = Date.now();
        const pieChartFilename = `user_${userId}_yearly_pie_chart_${timestamp}.png`;
        const barGraphFilename = `user_${userId}_yearly_bar_graph_${timestamp}.png`;

        const pieChartPath = saveChartToFile(pieChart, pieChartFilename);
        const barGraphPath = saveChartToFile(barGraph, barGraphFilename);

        res.json({
            totalIncome,
            totalExpense,
            categoryBreakdown,
            pieChartPath,
            barGraphPath,
            transactions: filtered,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating report', error });
    }
};


module.exports = { generateMonthlyReport, generateYearlyReport };



