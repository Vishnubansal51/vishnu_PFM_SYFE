const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../db/connection');

let token;

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset the database

    // Register and login a user to get a valid token
    await request(app).post('/users/register').send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
    });

    const loginRes = await request(app).post('/users/login').send({
        email: 'testuser@example.com',
        password: 'password123',
    });

    token = loginRes.body.token;

    // Add a category for expense
    await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Groceries' });

    // Add an income transaction
    await request(app)
        .post('/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
            amount: 5000,
            date: '2025-01-01',
            description: 'Salary',
            type: 'income',
        });

    // Add an expense transaction
    await request(app)
        .post('/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
            amount: 2000,
            date: '2025-01-05',
            description: 'Grocery Shopping',
            type: 'expense',
            CategoryId: 1, // Ensure CategoryId exists
        });
});

describe('Reports', () => {
    test('should generate monthly report successfully', async () => {
        const res = await request(app)
            .get('/reports/monthly?month=1&year=2025')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('totalIncome', 5000); // Validate income
        expect(res.body).toHaveProperty('totalExpense', 2000); // Validate expense
        expect(res.body).toHaveProperty('categoryBreakdown'); // Validate breakdown
        expect(res.body).toHaveProperty('pieChartPath'); // Check chart path
        expect(res.body).toHaveProperty('barGraphPath'); // Check chart path
    });

    test('should generate yearly report successfully', async () => {
        const res = await request(app)
            .get('/reports/yearly?year=2025')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('totalIncome', 5000); // Validate income
        expect(res.body).toHaveProperty('totalExpense', 2000); // Validate expense
        expect(res.body).toHaveProperty('categoryBreakdown'); // Validate breakdown
        expect(res.body).toHaveProperty('pieChartPath'); // Check chart path
        expect(res.body).toHaveProperty('barGraphPath'); // Check chart path
    });

    test('should return 400 for missing query parameters in monthly report', async () => {
        const res = await request(app)
            .get('/reports/monthly')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Missing query parameters: month or year');
    });

    test('should return 400 for missing query parameters in yearly report', async () => {
        const res = await request(app)
            .get('/reports/yearly')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Missing query parameter: year');
    });
});
