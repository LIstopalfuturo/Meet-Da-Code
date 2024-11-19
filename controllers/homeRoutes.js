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
        // Check if user exists

        // Initialize totals
        let todayTotal = 0;
        let weekTotal = 0;
        let monthTotal = 0;

        if (tips && tips.length > 0) {
            // Get today's date at midnight
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Get start of week (Sunday)
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());

            // Get start of month
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

            // Calculate totals

            todayTotal = tips
                .filter(tip => new Date(tip.shift_date) >= today)

                .reduce((sum, tip) => sum + Number(tip.amount), 0);

            weekTotal = tips
                .filter(tip => new Date(tip.shift_date) >= startOfWeek)
                .reduce((sum, tip) => sum + Number(tip.amount), 0);

            monthTotal = tips
                .filter(tip => new Date(tip.shift_date) >= startOfMonth)
                .reduce((sum, tip) => sum + Number(tip.amount), 0);
        }

        console.log(tips);
        

        res.render('dashboard', {
            tips,
            todayTotal,
            weekTotal,
            monthTotal,
            logged_in: req.session.logged_in,
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
