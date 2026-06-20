const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer = require('multer');
const cors = require('cors');
const socket = require('socket.io');
const mongoose = require('mongoose');

// import routes
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

const app = express();

// Configure multer to hold files in memory (buffer)
const upload = multer();

// Configure template engine
app.engine('hbs', hbs({ extname: 'hbs', layoutsDir: './views/layouts', defaultLayout: 'main' }));
app.set('view engine', 'hbs');

// Middleware for parsing forms and request bodies
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware for static files
app.use(express.static(path.join(__dirname, '/public')));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

// API Routes
app.use('/api', (req, res, next) => {
  req.io = io;
  next();
}, testimonialsRoutes);

app.use('/api', (req, res, next) => {
  req.io = io;
  next();
}, concertsRoutes);

app.use('/api', (req, res, next) => {
  req.io = io;
  next();
}, seatsRoutes);

// Fallback to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

// 404 handler for other methods
app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

// Connect to DB
mongoose.connect('mongodb://0.0.0.0:27017/NewWaveDB');
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', err => console.log('Error ' + err));

io.on('connection', (socketInstance) => {
  console.log('New socket!');
});
