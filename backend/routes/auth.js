require('dotenv').config();

const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const result = await db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password: inputPassword } = req.body;

  if (!username || !inputPassword) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const rows = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0][0];

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(inputPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const tokenDuration = process.env.TOKEN_DURATION || '1h';
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: tokenDuration });
    const { password, ...userWithoutPassword } = user;

    res.json({ token, user: userWithoutPassword });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});


module.exports = router;
