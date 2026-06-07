const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer = require('multer');
const cors = require('cors');

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

// Middleware for user paths check (forbidden)
app.use('/user', (req, res, next) => {
  res.render('forbidden');
});

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/home', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/contact/send-message', upload.single('file'), (req, res) => {
  const { author, sender, title, message } = req.body;
  const file = req.file;

  if (author && sender && title && message && file) {
    res.render('contact', { isSent: true, fileName: file.originalname });
  } else {
    res.render('contact', { isError: true });
  }
});

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/history', (req, res) => {
  res.render('history');
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', { name: req.params.name });
});

// API Routes
app.use('/api', testimonialsRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
