const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db'); // Ensure this is your database connection

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/kycdocs/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Get the file extension
    const filename = `${Date.now()}${ext}`; // Create a unique filename
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.post('/api/uploadKYC', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = `${process.env.NEXT_PUBLIC_PORT}/uploads/kycdocs/${req.file.filename}`;
    const { userId, documentType } = req.body;


    if (!userId || !documentType) {
      return res.status(400).json({ error: 'Missing userId or documentType' });
    }

    const query = `
      INSERT INTO kyc_documents (user_id, document_type, file_path)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE file_path = VALUES(file_path)
    `;

    try {
      const [result] = await db.query(query, [userId, documentType, filePath]);
      res.status(200).json({ message: 'File uploaded successfully', result: result });
    } catch (dbError) {
      console.error('Error executing query:', dbError);
      res.status(500).json({ error: 'Database query failed' });
    }
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'File upload failed' });
  }
});

router.get('/api/kyc/pancard/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const sql = `SELECT * FROM kyc_documents WHERE document_type = 'PAN Card' AND user_id = ?`;
    const [results] = await db.query(sql, [userId]);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Error fetching Pan card' });
  }
});

router.get('/api/getkyc/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  const query = `
    SELECT document_type, file_path
    FROM kyc_documents 
    WHERE user_id = ?
  `;

  try {
    const [results] = await db.query(query, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No KYC documents found for this user' });
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error('Error fetching KYC documents:', error);
    res.status(500).json({ error: 'Failed to fetch KYC documents' });
  }
});

module.exports = router;
