const mysql = require('mysql2');
const db = mysql.createConnection({
    user: 'root',
    database: 'employees_db'
});
const { init } = require('./prompt')
require('console.table');

const showDepartments =  () => {
    db.query('SELECT * FROM departments', (err, results) => {
        console.table(results, `
    Where the Magic Happens
    `);
    init();
});
}

const showRoles = function () {
    db.query('SELECT * FROM roles', (err, results) => {
        console.table(results, `
A task for All!
`)
        init();
    });
}

const showEmployees = function () {
    db.query('SELECT * FROM employees', (err, results) => {
        console.table(results, `
Good Worker Bees
`)
        init();
    });
};

   
        
module.exports = {
    showDepartments,
    showRoles,
    showEmployees
}