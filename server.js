const express = require('express');
const app = express();
const db = require('./config/db');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const port = process.env.PORT || 3000;

db.connect();

// Middleware
app.use(express.json());
app.use(errorHandler);

// Routes
app.use('/users', auth, userRoutes);
app.use('/auth', authRoutes);

// Server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
