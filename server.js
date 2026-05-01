const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const checkPassword = require('./checkPassword');

const app = express();
const PORT = 3000;
const DB_FILE = './database.sqlite';

app.use(bodyParser.json());
app.use(express.static('public'));

let db;

// Initialize Database
(async () => {
    db = await open({
        filename: DB_FILE,
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);
    console.log('SQLite Database initialized.');
})();

// Registration Endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required.' });
    }

    if (!checkPassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters and contain 1 number.' });
    }

    try {
        await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        res.json({ message: 'Registration successful!' });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ message: 'User already exists.' });
        }
        res.status(500).json({ message: 'Database error.' });
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        if (user) {
            res.json({ message: `Welcome back, ${username}!` });
        } else {
            res.status(401).json({ message: 'Invalid username or password.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Database error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
