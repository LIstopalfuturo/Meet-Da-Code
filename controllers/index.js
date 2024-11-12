const router = require('express').Router();

// Import all route modules
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes.js');

// Define routes
// Home routes should be defined before API routes to ensure proper route matching
router.use('/', homeRoutes);
router.use('/api', apiRoutes);

// Catch-all route for any undefined routes (404 handler)
router.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

module.exports = router;
