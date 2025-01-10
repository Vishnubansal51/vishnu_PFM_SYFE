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

    token = loginRes.body.token; // Save the token for authorization

    // Create a category for testing expense transactions
    await request(app)
        .post('/categories')
        .send({ name: 'Groceries' })
        .set('Authorization', `Bearer ${token}`);
});

describe('Transaction Management', () => {
    test('should add an expense transaction successfully', async () => {
        const res = await request(app)
            .post('/transactions')
            .send({
                amount: 500,
                date: '2025-01-10',
                description: 'Grocery Shopping',
                type: 'expense',
                CategoryId: 1, // Assuming CategoryId 1 corresponds to 'Groceries'
            })
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Transaction added successfully');
        expect(res.body.transaction).toHaveProperty('type', 'expense');
    });

    test('should add an income transaction successfully', async () => {
        const res = await request(app)
            .post('/transactions')
            .send({
                amount: 1000,
                date: '2025-01-12',
                description: 'Salary',
                type: 'income',
            })
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Transaction added successfully');
        expect(res.body.transaction).toHaveProperty('type', 'income');
    });

    test('should fail to add transaction without type', async () => {
        const res = await request(app)
            .post('/transactions')
            .send({
                amount: 500,
                date: '2025-01-10',
                description: 'Grocery Shopping',
            })
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', "Invalid transaction type. Use 'income' or 'expense'.");
    });

    test('should fail to add expense transaction without CategoryId', async () => {
        const res = await request(app)
            .post('/transactions')
            .send({
                amount: 500,
                date: '2025-01-10',
                description: 'Grocery Shopping',
                type: 'expense',
            })
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'CategoryId is required for expense transactions.');
    });

    test('should fetch all transactions for a user', async () => {
        const res = await request(app)
            .get('/transactions')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('should update a transaction successfully', async () => {
        const res = await request(app)
            .put('/transactions/1') // Assuming Transaction ID 1 exists
            .send({
                amount: 600,
                description: 'Updated Grocery Shopping',
                type: 'expense',
                CategoryId: 1,
            })
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Transaction updated successfully');
        expect(res.body.transaction).toHaveProperty('amount', 600);
        expect(res.body.transaction).toHaveProperty('description', 'Updated Grocery Shopping');
    });

    test('should delete a transaction successfully', async () => {
        const res = await request(app)
            .delete('/transactions/1') // Assuming Transaction ID 1 exists
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Transaction deleted successfully');
    });

    test('should return 404 for deleting non-existent transaction', async () => {
        const res = await request(app)
            .delete('/transactions/999') // Non-existent Transaction ID
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Transaction not found');
    });
});
