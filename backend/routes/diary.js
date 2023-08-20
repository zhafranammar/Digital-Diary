const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyJWT = require('../middleware/verifyJwt');

router.post('/', verifyJWT, async (req, res) => {
  const { title, content } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO diary_entries (title, content, user_id) VALUES (?, ?, ?)',
      [title, content, req.user.id]
    );
    res.status(201).json({ message: "Diary entry added successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', verifyJWT, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, title, content FROM diary_entries WHERE user_id = ?',
      [req.user.id]
    );
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', verifyJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'SELECT id, title, content FROM diary_entries WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    const entry = result[0][0];

    if (!entry) {
      return res.status(404).json({ message: "Entry not found." });
    }

    res.json(entry);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/:id', verifyJWT, async (req, res) => {
  const { title, content } = req.body;

  try {
    await db.query(
      'UPDATE diary_entries SET title = ?, content = ? WHERE id = ? AND user_id = ?',
      [title, content, req.params.id, req.user.id]
    );
    res.json({ message: "Diary entry updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', verifyJWT, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM diary_entries WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ message: "Diary entry deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
