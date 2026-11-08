// require('dotenv').config();
// const app = require('./src/app');
// const mongoose = require('mongoose');

// const PORT = process.env.PORT || 3000;
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('MongoDB connected');
//     app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
//   })
//   .catch((err) => {
//     console.error('MongoDB connection failed:', err.message);
//     process.exit(1);
//   });


require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/bd/db')

const PORT = process.env.PORT || 5000;

connectDB()

// Start the server
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

