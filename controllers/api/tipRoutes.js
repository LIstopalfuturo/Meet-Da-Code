const router = require('express').Router();
const { Tip } = require('../../models');
const withAuth = require('../../utils/auth');
const { Op } = require('sequelize');

// GET /api/tips - Get all tips for logged-in user
router.get('/', withAuth, async (req, res) => {
    try {
        // Find all tips belonging to logged-in user
        const tipData = await Tip.findAll({
            where: {
                user_id: req.session.user_id
            }
        });
        res.status(200).json(tipData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// POST /api/tips - Create new tip entry
router.post('/', withAuth, async (req, res) => {
    try {
        // Create new tip with request body data and user ID from session
        const newTip = await Tip.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newTip);
    } catch (err) {
        res.status(400).json(err);
    }
});

// PUT /api/tips/:id - Update existing tip entry
router.put('/:id', withAuth, async (req, res) => {
    try {
        // Update tip where ID matches and belongs to logged-in user
        const tipData = await Tip.update(req.body, {
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        // If no tip found, send 404
        if (!tipData[0]) {
            res.status(404).json({ message: 'No tip found with this id!' });
            return;
        }

        res.status(200).json(tipData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE /api/tips/:id - Delete tip entry
router.delete('/:id', withAuth, async (req, res) => {
    try {
        // Delete tip where ID matches and belongs to logged-in user
        const tipData = await Tip.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        // If no tip found, send 404
        if (!tipData) {
            res.status(404).json({ message: 'No tip found with this id!' });
            return;
        }

        res.status(200).json(tipData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET /api/tips/analytics - Get tip analytics
router.get('/analytics/:timeRange', withAuth, async (req, res) => {
    try {
        // Get time range from params (week, month, year)
        const { timeRange } = req.params;
        
        // Calculate start date based on time range
        const startDate = new Date();
        switch(timeRange) {
            case 'week':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
        }

        // Get tips within date range
        const tipData = await Tip.findAll({
            where: {
                user_id: req.session.user_id,
                shift_date: {
                    [Op.gte]: startDate
                }
            },
            order: [['shift_date', 'ASC']]
        });

        res.status(200).json(tipData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
