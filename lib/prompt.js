const mysql = require('mysql2');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
require('console.table');

const db = mysql.createConnection({
    user: 'root',
    database: 'employees_db'
});
// For Employee query
const fullEmpTable = `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name, title, name AS department, salary, CONCAT(emp.first_name, ' ', emp.last_name) AS supervisor FROM employees AS e JOIN roles AS r ON e.role_id = r.id left join departments AS d ON r.department_id = d.id left join employees AS emp ON e.manager_id = emp.id`
const showEmployee = `SELECT * FROM employees`
// Role query
const showRoles = `SELECT r.id AS role_id, title, name AS department, salary FROM roles AS r left join departments AS d ON r.department_id = d.id`


// For providing options with prompt
let roles = [];
let employees = [];
let depo = [];
let id;
let managerId;

const deleteDepartment = async () => {
    const [empResults] = await db.promise().query('SELECT * FROM departments');

    for (let i = 0; i < empResults.length; i++) {
        let departments = empResults[i].name;
        depo.push(departments);
    };

    prompt([
        {
            type: 'rawlist',
            name: 'deletes',
            message: 'Which department would you like to delete?',
            choices: depo
        }
    ])
    .then(({ deletes }) => {
        console.log('\n\n')
        db.query(`DELETE FROM departments WHERE name = "${deletes}"`)
        db.query(`SELECT * FROM departments`, (err, res) => {
        console.log('\n\n');
        console.table(res, 'Department Deleted');
        depo = [];
        init();
        })
    })
}

const deletes = async () => {
    // const [allTables] = await db.promise().query(`SELECT name, d.id, title, r.id AS role, CONCAT(first_name, ' ', last_name) AS emp, e.id AS employee FROM employees AS e JOIN roles AS r ON e.role_id = r.id right join departments AS d ON r.department_id = d.id`) 
    
    // for (let i = 0; i < empResults.length; i++) {
    //     depo.push(allTables.name);
    //     employees.push(allTables.emp);
    //     roles.push(allTables.title);
    // };

    prompt([
        {
            type: 'rawlist',
            name: 'which',
            message: 'What information would you like to delete',
            choices: ['Department', 'Role', 'Employee', 'Nothing']
        }
    ])
    .then(({which}) => {
        switch (which) {
            case 'Department':
                deleteDepartment();
                break;
            case 'Role':
                deleteRole();
                break;
            case 'Employee':
                deleteEmployee();
                break;       
            case 'Nothing':
                init();
        }
    })
}

const empByDepo = async () => {
    const [empResults] = await db.promise().query(`SELECT * FROM departments`);

    for (let i = 0; i < empResults.length; i++) {
        let departments = empResults[i].name;
        depo.push(departments);
    };
    
    prompt([
        {
            type: 'rawlist',
            name: 'byDepo',
            message: 'Which department team would you like to see?',
            choices: depo
        }
    ])
        .then(({byDepo}) => {
        console.log('\n\n')
        db.query(`SELECT CONCAT(e.first_name, ' ', e.last_name) AS team FROM employees AS e JOIN roles AS r ON e.role_id = r.id right join departments AS d ON r.department_id = d.id WHERE name = "${byDepo}"`, (err, res) => {
            console.table(res, 'Go Team!!\n')
            depo = [];
            init();
        })
    })
}

const empByManager = async () => {
    const [empResults] = await db.promise().query(showEmployee);

    for (let i = 0; i < empResults.length; i++) {
        let fullName = empResults[i].first_name + ' ' + empResults[i].last_name;
        employees.push(fullName);
    };

    prompt([
        {
            type: 'rawlist',
            name: 'byManager',
            message: 'Which superviser\'s team would you like to see?',
            choices: employees
        }
    ])
        .then(({byManager}) => {
            let boss = byManager.split(' ').shift();
            let bossId = empResults.filter((one) => one.first_name === boss)

            console.log('\n\n')
            db.query(`SELECT CONCAT(e.first_name, ' ', e.last_name) AS team FROM employees AS e WHERE manager_id = "${bossId[0].id}"`, (err, res) => {
                console.table(res, 'Go Team!!\n')
                employees = [];
                init();
            })
        })
}

const updateManager = async () => {
    const [empResults] = await db.promise().query(showEmployee);
    
    for (let i = 0; i < empResults.length; i++) {
        let fullName = empResults[i].first_name + ' ' + empResults[i].last_name;
        employees.push(fullName);
    };

    prompt([
        {
            type: 'rawlist',
            name: 'empSelect',
            message: 'Which Employee\'s manager would you like to update?',
            choices: employees
        }
    ])
        .then(({ empSelect }) => {

            let lessEmployees = employees.filter((all) => all !== empSelect);
            prompt([
                {
                    type: 'rawlist',
                    name: 'newManager',
                    message: `Who will be ${empSelect}\'s new supervisor?`,
                    choices: lessEmployees
                }
            ])
                .then(({ newManager }) => {
                    let manager = newManager.split(' ').shift();
                    let fName = empSelect.split(' ').shift();
                    let updatedManager = empResults.filter((one) => one.first_name === manager);
                    
                    console.log('\n\n')
                    db.query(`UPDATE employees SET manager_id = ${updatedManager[0].id} WHERE first_name = "${fName}"`);
                    db.query(fullEmpTable, (err, results) => {
                        console.table(results, 'A better match has never been had!\n');
                        employees = [];
                        init();
                    })
                });
        });
};

const bonusOptions = () => {
    prompt([
        {
            type: 'rawlist',
            name: 'bonus',
            message: 'Here are some additional options',
            choices: ['Update an employee\'s manager', 'View all employess under manager', 'View all employees by department', 'Delete departments, roles, or employees', 'View total utilized budget by department','Return to Main List']
        }
    ])
        .then(({bonus}) => {
            switch (bonus) {
                case 'Update an employee\'s manager':
                    updateManager();
                    break;
                case 'View all employess under manager':
                    empByManager();
                    break;
                case 'View all employees by department':
                    empByDepo();
                    break;
                case 'Delete departments, roles, or employees':
                    deletes();
                    break;
                case 'View total utilized budget by department':
                    budget();
                case 'Return to Main List':
                    init();
            }
        })
};


const updateEmployee = async () => {


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

                    let updatedRole = id.filter((one) => one.title === newRole);
                    
                    console.log('\n\n')
                    db.query(`UPDATE employees SET role_id = ${updatedRole[0].role_id} WHERE first_name = "${empName}"`);
                    db.query(fullEmpTable, (err, results) => {
                        console.table(results, 'I am sure they will fit right in!\n');
                        employees = [];
                        roles = [];
                        init();
                    })
                });
        });
};

const addEmployee = async () => {

    const [results] = await db.promise().query(`SELECT id, title FROM roles`)
    for (let i = 0; i < results.length; i++) {
        let role = results[i].title;
        roles.push(role);
    }
    id = results;
    const [empResults] = await db.promise().query(`SELECT id, first_name, last_name FROM employees`);
    for (let i = 0; i < empResults.length; i++) {
        let fullName = empResults[i].first_name + ' ' + empResults[i].last_name;
        employees.push(fullName);
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
            choices: employees
        }
    ])
        .then(({ firstName, lastName, employeeRole, emplManager }) => {

            roles = id.filter((one) => one.title === employeeRole)
            let bossId = emplManager.split(' ').shift();
            employees = managerId.filter((one) => one.first_name === bossId)

            console.log('\n\n')
            db.query(`INSERT INTO employees SET first_name="${firstName}", last_name="${lastName}", role_id="${roles[0].id}", manager_id="${employees[0].id}"`)
            db.query(fullEmpTable, (err, results) => {
                console.table(results, 'Our Family is Growing\n')
                employees = [];
                roles = [];
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

            console.log('\n\n')
            db.query(`INSERT INTO roles SET title="${roleName}", salary="${roleSalary}", department_id="${depoID[0].id}"`)
            db.query(showRoles, (err, results) => {
                console.table(results, 'All Operations being handled!\n')
                depo = [];
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
            console.log('\n\n')
            db.query(`INSERT INTO departments SET name="${depoName}"`)
            db.query('SELECT * FROM departments', (err, results) => {
                console.table(results, 'New Beginnings\n');
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
        bonusOptions(init);
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
                console.log('\n\n')
                db.query('SELECT * FROM departments', (err, results) => {
                    console.table(results, 'Where the Magic Happens\n');
                    init();
                });
            } else if (opening === 'View all Roles') {
                console.log('\n\n')
                db.query(showRoles, (err, results) => {
                    console.table(results, 'A task for All!\n');
                    init();
                });
            } else if (opening === 'View all Employees') {
                console.log('\n\n')
                db.query(fullEmpTable, (err, results) => {
                    console.table(results, 'Good Worker Bees\n');
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
