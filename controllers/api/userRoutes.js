const router = require('express').Router();
const { User } = require('../../models');

// POST /api/users - Create new user
router.post('/', async (req, res) => {
    try {
        // Create new user with request body data
        const userData = await User.create(req.body);

        // Save user session data after successful creation
        req.session.save(() => {
            // Store user ID and login status in session
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            // Send back the user data as JSON
            res.status(200).json(userData);
        });
    } catch (err) {
        // If there's an error (like duplicate email), send 400 status
        res.status(400).json(err);
    }
});

// POST /api/users/login - User login
router.post('/login', async (req, res) => {
    try {
        // Find user by email
        const userData = await User.findOne({ where: { email: req.body.email } });

        // If no user found, send error
        if (!userData) {
            res.status(400).json({ message: 'Incorrect email or password' });
            return;
        }

        // Check if password is valid using instance method from User model
        const validPassword = await userData.checkPassword(req.body.password);

        // If password invalid, send error
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password' });
            return;
        }

        // Save user session data after successful login
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            
            res.json({ user: userData, message: 'You are now logged in!' });
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

// POST /api/users/logout - User logout
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        // Destroy the session
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;
