const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjust this path according to your project structure

// POST endpoint to add a new stock
router.post('/api/stocks', async (req, res) => {
  const { stockName, stockPrice, date, quantity, userId, symbol } = req.body;
  console.log(req.body);

  try {
    // Ensure the table exists and includes the symbol field
    await db.query(`
      CREATE TABLE IF NOT EXISTS Stocks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        stockName VARCHAR(255),
        stockPrice VARCHAR(255),
        date DATE,
        quantity VARCHAR(255),
        userId VARCHAR(255),
        symbol VARCHAR(255)
      );
    `);

    // Insert the new stock entry
    const [result] = await db.query(
      'INSERT INTO Stocks (stockName, stockPrice, date, quantity, userId, symbol) VALUES (?, ?, ?, ?, ?, ?)',
      [stockName, stockPrice, new Date(date), quantity, userId, symbol]
    );

    console.log('Data saved successfully');
    res.status(200).json({ id: result.insertId, stockName, stockPrice, date, quantity, userId, symbol });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Error saving data' });
  }
});

// GET endpoint to fetch stocks by userId
router.get('/api/stocks/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch stocks for the specified userId
    const [stocks] = await db.query('SELECT * FROM Stocks WHERE userId = ?', [userId]);

    res.status(200).json(stocks);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

module.exports = router;
