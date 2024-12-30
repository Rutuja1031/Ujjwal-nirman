const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Initialize SQLite database
const db = new sqlite3.Database('./registrations.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the registrations database.');
        db.run(`CREATE TABLE IF NOT EXISTS registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            projectName TEXT NOT NULL,
            mobileNumber TEXT NOT NULL,
            email TEXT NOT NULL
        )`);
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files

// Handle form submission
app.post('/submit', (req, res) => {
    const { name, projectName, mobileNumber, email } = req.body;
    
    db.run(`INSERT INTO registrations (name, projectName, mobileNumber, email) VALUES (?, ?, ?, ?)`,
        [name, projectName, mobileNumber, email], function(err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            res.send('<script>alert("Registration successful!"); window.location.href = "/";</script>');
        });
});

// Serve the SQL data for analysis
app.get('/data', (req, res) => {
    db.all(`SELECT * FROM registrations`, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.json(rows); // Return data in JSON format
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
