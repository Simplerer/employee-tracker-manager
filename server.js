const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');
const prompt = inquirer.createPromptModule();

const db = mysql.createConnection({
    user: 'root',
    database: 'employees_db'
});