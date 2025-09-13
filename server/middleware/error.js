/**
 * Error handling middleware
 */

// 404 Not Found handler
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// General error handler
const errorHandler = (err, req, res, next) => {
    // If status code is 200, set it to 500 (Internal Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Set status code
    res.status(statusCode);
    
    // Log the error
    console.error(`Error: ${err.message}`);
    
    // Check if this is an API request or a page request
    const isApiRequest = req.originalUrl.includes('/api/');
    
    if (isApiRequest) {
        // Send JSON response for API requests
        res.json({
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
            success: false
        });
    } else {
        // For page requests, render an error page
        res.render('error', {
            title: 'Error',
            status: statusCode,
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack
        });
    }
};

module.exports = {
    notFound,
    errorHandler
};
