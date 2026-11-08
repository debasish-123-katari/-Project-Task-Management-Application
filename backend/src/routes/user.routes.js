
const express = require('express');

const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();



router.get('/', auth, async (req, res, next) => {
  try {
    
    const users = await User.find()
      .select('name email')
      .sort({ name: 1 })
      .limit(200);

   
    res.json({ users });

  } catch (error) {
    next(error);
  }
});


module.exports = router;

