// Load environment variables
require('dotenv').config();

// Core dependencies
const express = require('express');
const path = require('path');
const flash = require('connect-flash');

// Security and optimization middleware
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Session handling
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Logging and parsing middleware
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Template engine
const ejs = require('ejs');

// Route handlers
// const userRoutes = require('./router/route');
const pagesRender = require('./router/pagesRender');
const staffRouter = require('./router/staffrouter');
const hospitalRouter = require('./router/hospitalrouter')
const PwaRouter = require('./router/pwaRouter')

// Error handlers
const notFoundHandler = require('./handlers/404');
const { validationErrorHandler, errorHandler } = require('./handlers/400');

// Initialize express app
const app = express();
let server;

// Session configuration
const sessionConfig = {
  secret: 'Secret_Key',
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.DBConnectionLink
  })
};


// Essential middleware stack
app.use(compression());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session(sessionConfig));

app.use(express.static(path.join(__dirname, 'public')));


// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Global middleware for messages
app.use(flash());

app.use((req, res, next) => {
    res.locals.message = req.flash('alert');
    next();
});
// Performance monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} took ${duration}ms timestamp ${new Date()}`);
  });
  next();
});

// Database configuration
require('./database/dbConfig')();

// Routes
// app.use('/api', userRoutes);
app.use('/',pagesRender);
app.use(staffRouter)
app.use(hospitalRouter)
// app.use(PwaRouter)

// Error handling middleware stack
app.use(notFoundHandler);
app.use(validationErrorHandler);
app.use(errorHandler);

// Server startup function
async function startServer() {
  const PORT = process.env.PORT || 8080;
  try {
    server = app.listen(PORT,() => {
      console.log(`----Server running on http://localhost:${PORT} ----`);
    });
  } catch (err) {
    console.error("Server connection error:", err);
    process.exit(1);
  }
}

// Global error handlers
process.on("uncaughtException", (err) => {
  console.log("UNHANDLED EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

// Start the server
startServer();