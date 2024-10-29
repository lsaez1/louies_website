// MySQL database configuration
const mysql = require("mysql2");

// MySQL database configuration
function createConnection() {
  // function to create a new connection at any time 
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "louies_website_database",
  });

}

// Connect to MySQL database
const connection1 = createConnection();
connection1.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database");

  // Execute SQL statements
  createDatabase();
  createUsersFeedbackTable();
  insertInitialData();

  // Close MySQL connection
  connection1.end();
});

function createDatabase() {
  connection1.query(
    "CREATE DATABASE IF NOT EXISTS `louies_website_database` ;",
    (err, result) => {
      if (err) {
        console.error("Error creating database:", err);
        return;
      }
      console.log("Database louies_website_database created (if not exists)");
    }
  );
}

// Function to create usersFeedback table
function createUsersFeedbackTable() {
  connection1.query(
    `
    CREATE TABLE IF NOT EXISTS usersFeedback (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstname VARCHAR(50) NOT NULL,
      lastname VARCHAR(50) NOT NULL,
      email VARCHAR(50) NOT NULL UNIQUE,
      feedback BOOLEAN,
      improvements VARCHAR(500)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  `,
    (err, result) => {
      if (err) {
        console.error("Error creating usersFeedback table:", err);
        return;
      }
      console.log("Table usersFeedback created (if not exists)");
    }
  );
}

// Function to insert initial data into users table
function insertInitialData() {
  connection1.query(
    `
    INSERT IGNORE INTO usersFeedback (firstname, lastname, email, feedback, improvements) 
    VALUES ('John', 'Doe', 'john@example.com', TRUE, 'Add more content');

  `,
    (err, result) => {
      if (err) {
        console.error("Error inserting initial data:", err);
        return;
      }

      if (result.affectedRows > 0) {
        console.log("Initial data inserted into usersFeedback table");
      } else {
        console.log("Initial data already exists in usersFeedback table");
      }
    }
  );
}
// Function to create user feedback
async function createUserFeedback(user) {

  const connection2 = createConnection(); //

  const query =
    "INSERT INTO usersFeedback (firstname, lastname, email, feedback, improvements) VALUES (?, ?, ?, ?, ?)";
  const values = [
    user.firstname,
    user.lastname,
    user.email,
    user.feedback,
    user.improvements,
  ];

  return new Promise((resolve, reject) => {
    // Connect to the database
    connection2.connect((err) => {
      if (err) {
        console.error("Error connecting to MySQL database:", err);
        return reject(err);
      }

      connection2.query(query, values, (error, results) => {
        if (error) {
          connection2.end(); // Close connection on error
          return reject(error);
        }
        resolve(results); // Resolve results before closing connection

        connection2.end(); // Close the connection after resolving
      });
    });
  });
}

module.exports = { createUserFeedback };
