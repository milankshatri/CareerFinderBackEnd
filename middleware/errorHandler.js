const errorHandler = (err, req, res, next) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ message: 'An internal error occurred. Please try again later.' });
    }
    next();
};

module.exports = errorHandler;