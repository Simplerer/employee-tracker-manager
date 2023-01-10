const mysql = require('mysql2');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
require('console.table');
const { bonusOptions } = require('./bonusOptions');
const { updateEmployee } = require('./updateEmployee');

const db = mysql.createConnection({
    user: 'root',
    database: 'employees_db'
});
// For Employee query
const showEmployees = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS Name, title, name AS Department, salary, CONCAT(emp.first_name, ' ', emp.last_name) AS Supervisor FROM employees AS e JOIN roles AS r ON e.role_id = r.id left join departments AS d ON r.department_id = d.id left join employees AS emp ON e.manager_id = emp.id`
// For providing options with prompt
let roles = [];
let managers = [];
let depo = [];

// maybe make global roles, employees, and department arrays with push every add
const addEmployee = async () => {
    
    let id;
    let managerId;
    const [results] = await db.promise().query(`SELECT id, title FROM roles`)
        for (let i = 0; i < results.length; i++) {
            role = results[i].title;
            roles.push(role);
        }
    id = results;
    const [empResults] = await db.promise().query(`SELECT id, first_name, last_name FROM employees`);
        for (let i = 0; i < empResults.length; i++) {
            fullName = empResults[i].first_name + ' ' + empResults[i].last_name;
            manager = fullName;
            managers.push(manager);
        }
    managerId = empResults;

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
            console.log(roles)

            let bossId = emplManager.split(' ');
            console.log(bossId);
            managers = managerId.filter((one) => one.first_name === bossId[0])
            console.log(managers);
            console.log(roles);

            db.query(`INSERT INTO employees SET first_name="${firstName}", last_name="${lastName}", role_id="${roles[0].id}", manager_id="${managers[0].id}"`)
            db.query(showEmployees, (err, results) => {
                console.table(results, '\n Our Family is Growing\n')
                init();
            })
        });
}
const addRole = () => {
    
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
            let depoId;
            depoID = id.filter((one) => one.name === roleDepo);
            db.query(`INSERT INTO roles SET title="${roleName}", salary="${roleSalary}", department_id="${depoID[0].id}"`)
            db.query('SELECT * FROM roles', (err, results) => {
                console.table(results, '\nAll Operations being handled!\n')
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
                console.table(results, '\nNew Beginnings\n');
                init();
            });
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
                    console.table(results, '\nWhere the Magic Happens\n');
                init();
            });
            } else if (opening === 'View all Roles') {
                db.query('SELECT * FROM roles', (err, results) => {
                    console.table(results, '\nA task for All!\n');
                    init();
                });
            } else if (opening === 'View all Employees') {
                db.query(showEmployees, (err, results) => {
                    console.table(results, '\nGood Worker Bees\n');
                    init();
                });
            } else if (opening === 'All Done Here') {
                console.log('\n~ As always it was a pleasure to assist you!\n May your days be long and full of profit ~\n')
                process.exit();

            } else {
                editingTables(opening);
            }
        })
};
// Entry into prompts
const welcome = () => {
    console.log('\nWelcome Boss!\n I hope being a genius is not too much today!\n');
    init();
}
module.exports = { welcome };
