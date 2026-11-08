
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();


const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });
};

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters.'
      });
    }

    const existingUser = await User.exists({
      email: email.toLowerCase().trim()
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'Email is already registered.'
      });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

   
    // const user = await User.create({
    //   name: name.trim(),
    //   email: email.toLowerCase().trim(),
    //   password: hashedPassword
    // });

    console.log('Starting password hashing');

const hashedPassword = await bcrypt.hash(password, 10);

console.log('Password hashed successfully');

const user = await User.create({
  name: name.trim(),
  email: email.toLowerCase().trim(),
  password: hashedPassword
});

console.log('User created successfully:', user._id);

    
    const token = generateToken(user);
    setTokenCookie(res, token);

  
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  }  catch (error) {
  console.error('Registration Error:', error);
  res.status(500).json({
    message: error.message
  })}
  
  
})





router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

   
    const user = await User.findOne({
      email: (email || '').toLowerCase().trim()
    }).select('+password');

    
    // if (
    //   !user ||
    //   !await bcrypt.compare(password || '', user.password)
    // ) {
    //   return res.status(401).json({
    //     message: 'Invalid email or password.'
    //   });
    // }

    // Check whether the user exists
if (!user) {
  return res.status(401).json({
    message: 'Invalid email or password.'
  });
}

// Compare entered password with stored hashed password
const isPasswordCorrect = await bcrypt.compare(
  password || '',
  user.password
);

// Check whether password is correct
if (!isPasswordCorrect) {
  return res.status(401).json({
    message: 'Invalid email or password.'
  });
}

    

    
    const token = generateToken(user);
    setTokenCookie(res, token);

  
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
});



router.post('/logout', (req, res) => {


  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  res.json({
    message: 'Logged out.'
  });
});



router.get('/me', auth, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});



module.exports = router;

