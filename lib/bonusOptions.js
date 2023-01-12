const mysql = require('mysql2');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
require('console.table');

const db = mysql.createConnection({
    user: 'root',
    database: 'employees_db'
});

// Handed these off to unclutter prompts page

const updateEmployee = async () => {

    const [empResults] = await db.promise().query(`SELECT manager_id, first_name, last_name FROM employees`);

    for (let i = 0; i < empResults.length; i++) {
        let fullName = empResults[i].first_name + ' ' + empResults[i].last_name;
        employees.push(fullName);
    };
    id = empResults;
  
    prompt([
        {
            type: 'rawlist',
            name: 'empSelect',
            message: 'Which Employee\'s manager would you like to update?',
            choices: employees
        }
    ])
        .then(({ empSelect }) => {
            employees -= empSelect
            let empName = empSelect
            prompt([
                {
                    type: 'rawlist',
                    name: 'newManager',
                    message: `Who will be ${empSelect}\'s new supervisor?`,
                    choices: employees
                }
            ])
                .then(({ newManager }) => {

                    let fName = empName.split(' ').shift();
                    let updatedManager = id.filter((one) => one.manager_id === newManager);                    

                    db.query(`UPDATE employees SET manager_id = ${updatedManager[0].manager_id} WHERE first_name = "${fName}"`);
                    db.query(showEmployees, (err, results) => {
                        console.table(results, '\n A better match has never been had!\n');
                        employees = [];
                        roles = [];
                        init();
                    })
                });
        });
};

const updateManager = async () => {
   

    const [empResults] = await db.promise().query(`SELECT title, role_id, first_name, last_name FROM employees JOIN roles ON employees.role_id = roles.id`);
    
        for (let i = 0; i < empResults.length; i++) {
            let fullName = empResults[i].first_name + ' ' + empResults[i].last_name;
            employees.push(fullName);
            let role = empResults[i].title;
            roles.push(role);
        };
        id = empResults;
      
        prompt([
            {
                type: 'rawlist',
                name: 'empSelect',
                message: 'Which Employee\'s status would you like to update?',
                choices: employees
            }
        ])
            .then(({ empSelect }) => {
    
                let empName = empSelect.split(' ').shift();
                prompt([
                    {
                        type: 'rawlist',
                        name: 'newRole',
                        message: `What new role will ${empSelect} have?`,
                        choices: roles
                    }
                ])
                    .then(({ newRole }) => {
    
                        let fName = empName.split(' ').shift();
                        let updatedRole = id.filter((one) => one.title === newRole);                    
    
                        db.query(`UPDATE employees SET role_id = ${updatedRole[0].role_id} WHERE first_name = "${fName}"`);
                        db.query(showEmployees, (err, results) => {
                            console.table(results, '\n I am sure they will fit right in!\n');
                            employees = [];
                            roles = [];
                            init();
                        })
                    });
            });
    };    


const bonusOptions = () => {
    prompt([
        {
        type: 'rawlist',
        name: 'newManager',
        message: 'Here are some additional options',
        choices: ['Update an employee\'s manager', 'View all employess under manager', 'View all employees by department', 'Delete departments, roles, or employees', 'View total utilized budget by department']
        }
    ])
    .then((choices) => {
       switch (choices) {
        case 'Update an employee\'s manager':
            updateManager();
        case 'View all employess under manager':
            empByManager();
        case 'View all employees by department':
            empByDepo();
        case 'Delete departments, roles, or employees':
            deletes();
        case 'View total utilized budget by department':
            budget();
       }
        
    })
};

module.exports = { bonusOptions };