
const app = require('../app');
const { sequelize } = require('../db/connection');


const request = require('supertest');

let token;

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset the database

    // Register and login a user to get a valid token
    await request(app).post('/users/register').send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password',
    });

    const loginRes = await request(app).post('/users/login').send({
        email: 'testuser@example.com',
        password: 'password',
    });

    token = loginRes.body.token; // Save the token for authorization
   
});



describe('Category Management', () => {
    test('should add a category successfully', async () => {
        const res = await request(app)
            .post('/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Food',
            })

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Category added successfully');
        expect(res.body).toHaveProperty('category');
        expect(res.body.category).toHaveProperty('name', 'Food');
    });

    test('should fetch categories successfully', async () => {
        const res = await request(app)
            .get('/categories')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBe(1);
        expect(res.body[0]).toHaveProperty('name', 'Food');
    });
});
