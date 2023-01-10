const mysql = require('mysql2');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
require('console.table');

const db = mysql.createConnection({
    user: 'root',
    database: 'employees_db'
});

const updateEmployee = () => {
    prompt([
        {
            type: 'rawlist',
            name: 'empSelect',
            message: 'Which Employee\'s status would you like to update?',
            choices: ['Cindy Lou Who', 'Walking Tall Who', 'Yule Who', 'Toots Who', 'Carol King Who', 'Fat Who', 'MC Who', 'YoYo Ma Who', 'Actually Who', 'Bourdain Who', 'Obama Who', 'Martha Who']            
        }
    ])
    .then((name) => {
        let selectedEmp = name.empSelect
        console.log(selectedEmp);
        prompt([
            {
                name: 'newRole',
                message: `What new role will ${selectedEmp} have?`
            }
        ])
        .then((role) => {
            console.log(role.newRole);
        });
    });
};

module.exports = { updateEmployee };