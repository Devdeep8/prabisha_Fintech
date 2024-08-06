const express = require('express');
const router = express.Router();
const db = require('../db');

// Create or update expense 
router.post('/expenses', async (req, res) => {
  const { name, amount, category, date, userId } = req.body;
  console.log(userId)
  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const updatedAt = null; // Will be set on update
  console.log(req.body)  
  try {
    // Check if there's already an expense record for the user
 
      // Create a new expense record
      const insertSql = `INSERT INTO expenses (name, amount, category, date, createdAt, updatedAt, userId) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const result2 =await db.query(insertSql, [name, amount, category, date, createdAt, updatedAt, userId]);
      console.log(insertSql , name, userId, amount, category, date, createdAt, updatedAt)
      console.log(result2)
      res.status(201).json({ message: 'Expense added successfully' , result: result2});
    
  } catch (err) {
    console.error('Error adding or updating expense:', err);
    res.status(500).json({ error: 'Error adding or updating expense' });
  }
});

// Retrieve all expenses
router.get('/expenses/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const sql = `SELECT * FROM expenses WHERE userId = ?`;
      const [results] = await db.query(sql, [userId]); // Destructure the first element from the results array
      res.status(200).json(results); // Directly send the results array
    } catch (err) {
      console.error('Error fetching expenses:', err);
      res.status(500).json({ error: 'Error fetching expenses' });
    }
  });
  

// Delete expense
router.delete('/expenses/:id', async (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM expenses WHERE id=?`;
  try {
    const result = await db.query(sql, [id]);
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ error: 'Error deleting expense' });
  }
});

module.exports = router;
