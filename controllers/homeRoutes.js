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

        // Initialize totals
        let todayTotal = 0;
        let weekTotal = 0;
        let monthTotal = 0;

        if (user.tips && user.tips.length > 0) {
            // Get today's date
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];

            // Get start of week (Sunday)
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            // Get start of month
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

            // Calculate totals
            todayTotal = user.tips
                .filter(tip => tip.shift_date.split('T')[0] === todayStr)
                .reduce((sum, tip) => sum + Number(tip.amount), 0);

            weekTotal = user.tips
                .filter(tip => {
                    const tipDate = new Date(tip.shift_date);
                    return tipDate >= startOfWeek;
                })
                .reduce((sum, tip) => sum + Number(tip.amount), 0);

            monthTotal = user.tips
                .filter(tip => {
                    const tipDate = new Date(tip.shift_date);
                    return tipDate >= startOfMonth;
                })
                .reduce((sum, tip) => sum + Number(tip.amount), 0);
        }

        console.log('Totals:', { todayTotal, weekTotal, monthTotal }); // Debug log

        res.render('dashboard', {
            ...user,
            todayTotal: todayTotal || 0,
            weekTotal: weekTotal || 0,
            monthTotal: monthTotal || 0,
            logged_in: true,
            pageTitle: 'Dashboard',
            isDashboardPage: true
        });
    } catch (err) {
        console.error('Dashboard Error:', err);
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
