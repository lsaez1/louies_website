// MySQL database configuration
const mysql = require('mysql');



// MySQL database configuration
var connection = mysql.createConnection({
  host : "localhost", 
  user: "root",
  password: "root", 
  database: "Louies_website_database"
});



// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  // Execute SQL statements
  createDatabase();
  createUsersTable();
  insertInitialData();
  
  // Close MySQL connection
  connection.end();
});



function createDatabase() {
  connection.query("CREATE DATABASE IF NOT EXISTS `louies_website_database` /*!40100 DEFAULT CHARACTER SET latin1 */;", (err, result) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database louies_website_database created (if not exists)');
  });
}



// Function to create users table
function createUsersTable() {
  connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      userid INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(50) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  `, (err, result) => {
    if (err) {
      console.error('Error creating users table:', err);
      return;
    }
    console.log('Table users created (if not exists)');
  });
}



// Function to insert initial data into users table
function insertInitialData() {
  connection.query(`
    INSERT INTO users (username, password)
    SELECT * FROM (SELECT 'testUser', 'testPass') AS tmp
    WHERE NOT EXISTS (
        SELECT username FROM users WHERE username = 'testUser'
    );
  `, (err, result) => {
    if (err) {
      console.error('Error inserting initial data:', err);
      return;
    }
    
    if (result.affectedRows > 0) {
      console.log('Initial data inserted into users table');
    } else {
      console.log('Initial data already exists in users table');
    }
  });
}



