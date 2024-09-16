// src/backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../Utils/logger');

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

router.post('/register', async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ _id: user._id }, SECRET_KEY);
    res.status(201).send({ user, token });
    logger.info(`New user registered: ${user.username}`);
  } catch (error) {
    logger.error('Error registering new user:', error);
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).send({ error: 'Invalid login credentials' });
    }
    const token = jwt.sign({ _id: user._id, role: user.role, username: user.username }, SECRET_KEY);
    res.send({ token });
    logger.info(`User logged in: ${user.username}`);
  } catch (error) {
    logger.error('Error logging in user:', error);
    next(error);
  }
});

module.exports = router;