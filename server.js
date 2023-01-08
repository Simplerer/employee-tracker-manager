const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const mysql = require('mysql2');
require('console.table');

const db = mysql.createConnection({
    user: 'root',
    database: 'employees_db'
});

db.query('SELECT * FROM departments', (err, results) => {
    console.table(results)
});
db.query('SELECT * FROM roles', (err, results) => {
    console.table(results)
});
db.query('SELECT * FROM employees', (err, results) => {
    console.table(results)
});