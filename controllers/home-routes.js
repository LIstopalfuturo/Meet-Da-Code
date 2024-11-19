router.get('/', async (req, res) => {
    try {
        let recentTips = [];
        if (req.session.logged_in) {
            recentTips = await Tip.findAll({
                where: {
                    user_id: req.session.user_id
                },
                order: [['date', 'DESC']],
                limit: 5
            });
        }

        res.render('homepage', {
            logged_in: req.session.logged_in,
            recentTips: recentTips.map(tip => tip.get({ plain: true }))
        });
    } catch (err) {
        res.status(500).json(err);
    }
}); 