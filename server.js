const mysql = require('mysql2');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
require('console.table');

const db = mysql.createConnection({
    user: 'root',
    database: 'employees_db'
});

const bonusOptions = () => {
    prompt([

    ]);
};

const updateEmployee = () => {
    prompt([
        {
            
        }
    ])
}

const addEmployee = () => {
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
            name: 'employeeRole',
            message: 'What role will this employee fill?'
        },
        {
            name: 'emplManager',
            message: 'Who will manage this individual?'
        }
    ])
    .then((response) => {
        db.query(`INSERT INTO employees SET first_name="${response.firstName}", last_name="${response.lastName}", role_id="2", manager_id="3"`)
        db.query('SELECT * FROM employees', (err, results) => {
            console.table(results, `
    Our Family is Growing
    `)
            init();
        })
    });
}
const addRole = () => {
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
            choices: [
                'Merryment', 'Musical Enjoyment', 'Gifts Central', 'Feasts'
            ]
        }
    ])
    .then((responses) => {
        let depo;
        if (responses.roleDepo === 'Merryment') {
            depo = 1;
        } else if (responses.roleDepo === 'Musical Enjoyment') {
            depo = 2;
        } else if (responses.roleDepo === 'Gifts Central') {
            depo = 3;
        } else {
            depo = 4;
        }
        db.query(`INSERT INTO roles SET title="${responses.roleName}", salary="${responses.roleSalary}", department_id="${depo}"`)
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
        .then((response) => {
            db.query(`INSERT INTO departments SET name="${response.depoName}"`)
            db.query('SELECT * FROM departments', (err, results) => {
                console.table(results, `
        New Beginnings
        `)
                init();
            })
        })
}

const editingTables = (toDo) => {
    if (toDo === 'Add a Department') {
        addDepartment();
    } else if (toDo === 'Add a Role') {
        addRole();
    } else if (toDo === 'Add an Employee') {
        addEmployee();
    } else if (todo === 'Update Employee Role') {
        updateEmployee();
    } else {
        bonusOptions();
    };
};

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
        .then((response) => {
            if (response.opening === 'View all Departments') {
                db.query('SELECT * FROM departments', (err, results) => {
                    console.table(results, `
                Where the Magic Happens
                `)
                    init();
                });
            } else if (response.opening === 'View all Roles') {
                db.query('SELECT * FROM roles', (err, results) => {
                    console.table(results, `
                A task for All!
                `)
                    init();
                });
            } else if (response.opening === 'View all Employees') {
                db.query('SELECT * FROM employees', (err, results) => {
                    console.table(results, `
                Good Worker Bees
                `)
                    init();
                });
            } else if (response.opening === 'All Done Here') {
                console.log(`
                As always it was a pleasure to assist you!
                May your days be long and full of profit
                `)
                process.exit();

            } else {
                editingTables(response.opening);
            }
        })
};

const welcome = () => {
    console.log(`Welcome Boss!

    I hope being a genius is not too much today!
    
    `);
    init();
}





welcome();