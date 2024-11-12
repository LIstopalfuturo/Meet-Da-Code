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

// Login route
router.get('/login', (req, res) => {
    // If already logged in, redirect to dashboard
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login', {
        pageTitle: 'Login',
        isLoginPage: true
    });
});

// Dashboard route
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        // Get user data
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{
                model: Tip,
                order: [['shift_date', 'DESC']]
            }]
        });

        const user = userData.get({ plain: true });

        // Calculate totals
        const today = new Date().toISOString().split('T')[0];
        const todayTotal = user.tips
            .filter(tip => tip.shift_date.split('T')[0] === today)
            .reduce((sum, tip) => sum + parseFloat(tip.amount), 0);

        res.render('dashboard', {
            ...user,
            todayTotal,
            logged_in: true,
            pageTitle: 'Dashboard',
            isDashboardPage: true
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

module.exports = router;
