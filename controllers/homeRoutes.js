const router = require('express').Router();
const { User, Tip } = require('../models');
const withAuth = require('../utils/auth');

// Home route
router.get('/', async (req, res) => {
    try {
        res.render('homepage', {
            logged_in: req.session.logged_in,
            pageTitle: 'Home'
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Separate login and signup routes
router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login');
});

router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }
    res.render('signup');
});

// Dashboard route
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        // Get user's tips with most recent first
        const tipData = await Tip.findAll({
            where: {
                user_id: req.session.user_id
            },
            order: [['shift_date', 'DESC']]
        });

        // Serialize data
        const tips = tipData.map((tip) => tip.get({ plain: true }));

        res.render('dashboard', {
            tips,
            logged_in: req.session.logged_in,
            layout: 'dashboard'
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Analytics route
router.get('/analytics', withAuth, async (req, res) => {
    try {
        res.render('analytics', {
            logged_in: true,
            pageTitle: 'Analytics',
            isAnalyticsPage: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Add analytics route
router.get('/dashboard/analytics', withAuth, async (req, res) => {
    try {
        res.render('analytics', {
            logged_in: req.session.logged_in,
            layout: 'dashboard'
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
