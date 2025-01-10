const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../db/connection');

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset the database
});

describe('User Management', () => {
    test('should register a user successfully', async () => {
        const res = await request(app).post('/users/register').send({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    test('should not allow duplicate email registration', async () => {
        const res = await request(app).post('/users/register').send({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
        });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Email already exists');
    });

    test('should log in a user successfully', async () => {
        const res = await request(app).post('/users/login').send({
            email: 'john@example.com',
            password: 'password123',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('should fail login with incorrect password', async () => {
        const res = await request(app).post('/users/login').send({
            email: 'john@example.com',
            password: 'wrongpassword',
        });
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'Invalid email or password');
    });
});
