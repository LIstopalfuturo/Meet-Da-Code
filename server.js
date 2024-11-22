// Import required Node.js modules and dependencies
const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers/index');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const helpers = require('./utils/helpers');

// Initialize Express application
const app = express();
// Set port for the server (uses environment variable or defaults to 3001)
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

// Configure session settings
const sess = {
    // Secret key for session encryption
    secret: 'Super secret secret',
    // Cookie settings
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // Cookie expires after 24 hours
        httpOnly: true, // Cookie cannot be accessed through client-side script
        secure: false, // Cookie can be sent over non-HTTPS connections
        sameSite: 'strict', // Cookie only sent to same site
    },
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Save new sessions
    // Store session data in database
    store: new SequelizeStore({
        db: sequelize
    })
};

// Enable session middleware
app.use(session(sess));

// Set Handlebars as the default template engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Enable routing
app.use(routes);

// Sync database and start server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Visit http://localhost:${PORT} to view the application`);
    });
});
