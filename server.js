const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./config/db');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const otpRoutes = require('./routes/otp');
const port = process.env.PORT || 3000;

db.connect();

// Middleware
app.use(cors());
app.use(express.json());
app.use(errorHandler);


// Routes
app.use('/user', auth, userRoutes);
app.use('/otp', otpRoutes);
app.use('/auth', authRoutes);
app.get('/',(req,res)=>{
    res.json({
        message : "Server is running"
    });
});

// Server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});