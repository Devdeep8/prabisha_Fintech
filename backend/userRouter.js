// Example endpoint using Express.js and MySQL
const express = require('express');
const router = express.Router();
const db = require('./db')

// Route to fetch user profile data by username
// Update user profile endpoint
router.put('/api/user/:username', (req, res) => {
    const username = req.query;
    const updatedData = req.body; // Assuming data is sent in the request body
  
    const query = `UPDATE users SET ? WHERE username = ?`;
    connection.query(query, [updatedData, username], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      res.json({ message: 'User profile updated successfully' });
    });
  });
  
  router.get('/api/user', async (req, res) => {
    const { username } = req.query; // Get username from query parameters
  
    try {
      // Use connection pool to execute query
      const [rows, fields] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
  
      // Check if user was found
      if (rows.length === 0) {
        console.log('No user found with the provided username');
        return res.status(404).json({ error: 'User not found' });
      }
  
      const userData = rows[0]; // Assuming username is unique
      // console.log('User data:', userData);
      return res.status(200).json(userData);
    } catch (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router;
