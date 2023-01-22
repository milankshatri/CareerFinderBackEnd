const express = require('express');
const app = express();
const connectDB = require('./config/db');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

// Connect to MongoDB
connectDB();

// Parse incoming JSON data
app.use(express.json());

// Use routes
app.use('/user', auth, userRoutes);
app.use('/auth', authRoutes);

// error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
