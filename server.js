const express = require('express');
const path = require('path');

const app = express();

// Middleware adding res.show helper
app.use((req, res, next) => {
  res.show = (name) => {
    res.sendFile(path.join(__dirname, `/views/${name}`));
  };
  next();
});

// Middleware for static files
app.use(express.static(path.join(__dirname, '/public')));

// Middleware for user paths check (forbidden)
app.use('/user', (req, res, next) => {
  res.show('forbidden.html');
});

// Routes
app.get('/', (req, res) => {
  res.show('home.html');
});

app.get('/home', (req, res) => {
  res.show('home.html');
});

app.get('/about', (req, res) => {
  res.show('about.html');
});

// 404 handler
app.use((req, res) => {
  res.status(404).show('404.html');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
