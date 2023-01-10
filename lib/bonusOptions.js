const mysql = require('mysql2');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
require('console.table');

const db = mysql.createConnection({
    user: 'root',
    database: 'employees_db'
});

// Handed these off to unclutter prompts page

const bonusOptions = () => {
    prompt([
        {
        type: 'rawlist',
        name: 'newManager',
        message: 'Here are some additional options',
        choices: ['Update an employee\'s manager', 'View all employess under manager', 'View all employees by department', 'Delete departments, roles, or employees', 'View total utilized budget by department']
        }
    ])
    .then((data) => {
        console.log(' Hey we got it! ')
        // process.exit();
        
    })
};

module.exports = { bonusOptions };