const { welcome } = require('./lib/prompt');
const mysql = require('mysql2');

const db = mysql.createConnection({
  user: 'root',
  database: 'employees_db'
});

db.connect((err) => {
  if (err) {
    console.log('MAKE SURE DATABASE IS INSTALLED BY RUNNING `mysql -uroot` then `source db/schema.sql` and finally `source db/seeds.sql`');
  } else {
    welcome(db);
  }
});