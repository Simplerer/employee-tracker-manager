const mysql = require('mysql2');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
require('console.table');
const { bonusOptions } = require('./bonusOptions');
const { updateEmployee } = require('./updateEmployee');
// const { showDepartments, showEmployees, showRoles } = require('./functions');

const db = mysql.createConnection({
    user: 'root',
    database: 'employees_db'
});
// For Employee query
const showEmployees = `SELECT employees.id, CONCAT(employees.first_name, ' ', employees.last_name) AS Name, title, name AS Department, salary, CONCAT(emp.first_name, ' ', emp.last_name) AS Supervisor FROM employees JOIN roles ON employees.role_id = roles.id left join departments ON roles.department_id = departments.id left join employees AS emp ON employees.manager_id = emp.id`

//Prepared Statements
// const showAllEmp = connection.query(db.query(showEmployees), (err, res) => console.log(err));
// connection.query(`SELECT id, name FROM employees`, (err, res) => console.log(err));
// const showRoles = connection.query(db.query(`SELECT id, name FROM roles`, (err, res) => console.log(err)));
// const showDepartments = connection.query(db.query(`SELECT id, name FROM departments`, (err, res) => console.log(err)));


const addEmployee = () => {
    let roles = [];
    let id;
    let managers = [];
    let managerId;
    db.query(`SELECT id, name FROM roles`, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            role = res[i].title;
            roles.push(role);
        }
        id = res;
    });
    db.query(`SELECT id, name FROM employees`, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            fullName = res[i].first_name + res[i].last_name;
            manager = fullName;
            managers.push(manager);
        }
        managerId = res;
    });
    prompt([
        {
            name: 'firstName',
            message: 'New Hire\'s first name.'
        },
        {
            name: 'lastName',
            message: 'New Hire\'s last name.'
        },
        {
            type: 'rawlist',
            name: 'employeeRole',
            message: 'What role will this employee fill?',
            choices: roles
        },
        {
            type: 'rawlist',
            name: 'emplManager',
            message: 'Who will manage this individual?',
            choices: managers
        }
    ])
        .then(({ firstName, lastName, employeeRole, emplManager }) => {
            roles = id.filter((one) => one.title === employeeRole)
            managers = id.filter((one) => one.title === emplManager)
            db.query(`INSERT INTO employees SET first_name="${firstName}", last_name="${lastName}", role_id="${roles[0].id}", manager_id="${managers[0].id}"`)
            db.query(showEmployees, (err, results) => {
                console.table(results, `
    Our Family is Growing
    `)
                init();
            })
        });
}
const addRole = () => {
    let depo = [];
    let id;
    db.query(`SELECT id, name FROM departments`, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            department = res[i].name;
            depo.push(department);
        }
        id = res;
    })
    prompt([
        {
            name: 'roleName',
            message: 'Lets give this new role a title'
        },
        {
            name: 'roleSalary',
            message: 'What is the annual salary for this position?'
        },
        {
            type: 'rawlist',
            name: 'roleDepo',
            message: 'Which department will this role be under?',
            choices: depo
        }
    ])
        .then(({ roleName, roleSalary, roleDepo }) => {

            depo = id.filter((one) => one.name === roleDepo);
            db.query(`INSERT INTO roles SET title="${roleName}", salary="${roleSalary}", department_id="${depo[0].id}"`)
            db.query('SELECT * FROM roles', (err, results) => {
                console.table(results, `
    All Operations being handled!
    `)
                init();
            })
        })
}

const addDepartment = () => {
    prompt([
        {
            name: 'depoName',
            message: 'What will this new department be called?'
        }
    ])
        .then(({ depoName }) => {
            db.query(`INSERT INTO departments SET name="${depoName}"`)
            db.query('SELECT * FROM departments', (err, results) => {
                console.table(results, `
        New Beginnings
        `)
                init();
            })
        })
}
// Sorting 
const editingTables = (toDo) => {
    if (toDo === 'Add a Department') {
        addDepartment();
    } else if (toDo === 'Add a Role') {
        addRole();
    } else if (toDo === 'Add an Employee') {
        addEmployee();
    } else if (toDo === 'Update Employee Role') {
        updateEmployee();
    } else {
        bonusOptions();
    };
};
// Home for prompt
const init = () => {
    prompt([
        {
            type: 'rawlist',
            name: 'opening',
            message: 'What would you like to do?',
            choices: [
                'View all Departments',
                'View all Roles',
                'View all Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update Employee Role',
                'Other options available...',
                'All Done Here'
            ]
        }
    ])
        .then(({ opening }) => {
            if (opening === 'View all Departments') {
                db.query('SELECT * FROM departments', (err, results) => {
                    console.table(results, `
                Where the Magic Happens
                `);
                init();
            });
            } else if (opening === 'View all Roles') {
                db.query('SELECT * FROM roles', (err, results) => {
                    console.table(results, `
                A task for All!
                `)
                    init();
                });
            } else if (opening === 'View all Employees') {
                db.query(showEmployees, (err, results) => {
                    console.table(results, `
                Good Worker Bees
                `)
                    init();
                });
            } else if (opening === 'All Done Here') {
                console.log(`
                ~ As always it was a pleasure to assist you!
                May your days be long and full of profit ~
                `)
                process.exit();

            } else {
                editingTables(opening);
            }
        })
};
// Entry into prompts
const welcome = () => {
    console.log(`Welcome Boss!

    I hope being a genius is not too much today!
    
    `);
    init();
}
module.exports = { 
    welcome,
    init
};
