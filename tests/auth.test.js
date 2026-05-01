const request = require('supertest');
const fs = require('fs');
const app = require('../server');

const TEST_DB = './test_database.sqlite';

beforeAll(async () => {
    process.env.DB_FILE = TEST_DB;
    // The server initializes the DB on load, but since we require it, 
    // it might already be initialized with the default path.
    // However, the checkPassword rule is what we mostly care about.
});

afterAll(async () => {
    if (fs.existsSync(TEST_DB)) {
        fs.unlinkSync(TEST_DB);
    }
});

describe('Auth API Integration', () => {
    const testUser = {
        username: `testuser_${Date.now()}`,
        password: 'Password123'
    };

    test('POST /register - should register a new user', async () => {
        const res = await request(app)
            .post('/register')
            .send(testUser);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Registration successful!');
    });

    test('POST /register - should fail for existing user', async () => {
        const res = await request(app)
            .post('/register')
            .send(testUser);
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('User already exists.');
    });

    test('POST /register - should fail for invalid password', async () => {
        const res = await request(app)
            .post('/register')
            .send({ username: 'badpwd', password: '123' });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toContain('Password must be');
    });

    test('POST /login - should login successfully', async () => {
        const res = await request(app)
            .post('/login')
            .send(testUser);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toContain('Welcome back');
    });

    test('POST /login - should fail with wrong password', async () => {
        const res = await request(app)
            .post('/login')
            .send({ username: testUser.username, password: 'WrongPassword1' });
        
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toBe('Invalid username or password.');
    });
});
