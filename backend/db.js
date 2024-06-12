const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: '', // replace with your MySQL password
  database: 'machineplant',
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
});

// Check if the database connection pool is successful
db.getConnection()
  .then(connection => {
    console.log('MySQL database connected!');
    connection.release(); // Release the connection back to the pool
  })
  .catch(error => {
    console.error('Error connecting to MySQL database:', error.message);
  });


module.exports = db;
