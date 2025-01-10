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

    // Create some transactions for calculating savings progress
    await request(app)
        .post('/transactions')
        .send({
            amount: 5000,
            date: '2025-01-10',
            description: 'Salary',
            type: 'income',
        })
        .set('Authorization', `Bearer ${token}`);

    await request(app)
        .post('/transactions')
        .send({
            amount: 2000,
            date: '2025-01-12',
            description: 'Grocery Shopping',
            type: 'expense',
            CategoryId: 1, // Assuming CategoryId 1 exists
        })
        .set('Authorization', `Bearer ${token}`);
});

describe('Savings Goals Management', () => {
    test('should add a savings goal successfully', async () => {
        const res = await request(app)
            .post('/savings')
            .send({
                targetAmount: 10000,
                targetDate: '2025-12-31',
            })
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Savings goal created successfully');
        expect(res.body.savingsGoal).toHaveProperty('targetAmount', 10000);
        expect(res.body.savingsGoal).toHaveProperty('targetDate', '2025-12-31');
    });

    test('should fetch savings goals with calculated progress successfully', async () => {
        // Add a savings goal
        await request(app)
            .post('/savings')
            .send({
                targetAmount: 10000,
                targetDate: '2025-12-31',
            })
            .set('Authorization', `Bearer ${token}`);

        const res = await request(app)
            .get('/savings')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('targetAmount', 10000);
        expect(res.body[0]).toHaveProperty('progress'); // Progress should be calculated
        expect(res.body[0].progress).toBeGreaterThan(0); // Ensure progress is calculated
    });

    test('should fail to add a savings goal without targetAmount', async () => {
        const res = await request(app)
            .post('/savings')
            .send({
                targetDate: '2025-12-31',
            })
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(500); // Validation error on missing targetAmount
        expect(res.body).toHaveProperty('message', 'Error creating savings goal');
    });

    test('should fail to add a savings goal without targetDate', async () => {
        const res = await request(app)
            .post('/savings')
            .send({
                targetAmount: 10000,
            })
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(500); // Validation error on missing targetDate
        expect(res.body).toHaveProperty('message', 'Error creating savings goal');
    });
});
