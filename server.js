const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer = require('multer');

const app = express();

// Configure multer to hold files in memory (buffer)
const upload = multer();

// Configure template engine
app.engine('hbs', hbs({ extname: 'hbs', layoutsDir: './views/layouts', defaultLayout: 'main' }));
app.set('view engine', 'hbs');

// Middleware for parsing forms
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

// 404 handler
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
