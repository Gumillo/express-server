const express = require('express');
const router = express.Router();
const db = require('./../db');
const { v4: uuidv4 } = require('uuid');

// get all testimonials
router.route('/testimonials').get((req, res) => {
  res.json(db.testimonials);
});

// get random testimonial (must be before /testimonials/:id)
router.route('/testimonials/random').get((req, res) => {
  if (db.testimonials.length === 0) {
    return res.status(404).json({ message: 'No testimonials found' });
  }
  const randomIndex = Math.floor(Math.random() * db.testimonials.length);
  res.json(db.testimonials[randomIndex]);
});

// get testimonial by id
router.route('/testimonials/:id').get((req, res) => {
  const id = req.params.id;
  const testimonial = db.testimonials.find(item => item.id.toString() === id);
  if (!testimonial) {
    res.status(404).json({ message: 'Not found' });
  } else {
    res.json(testimonial);
  }
});

// add new testimonial
router.route('/testimonials').post((req, res) => {
  const { author, text } = req.body;
  if (author && text) {
    const newTestimonial = {
      id: uuidv4(),
      author,
      text
    };
    db.testimonials.push(newTestimonial);
    res.json({ message: 'OK' });
  } else {
    res.status(400).json({ message: 'Bad request. Author and text are required.' });
  }
});

// update testimonial
router.route('/testimonials/:id').put((req, res) => {
  const id = req.params.id;
  const { author, text } = req.body;
  const index = db.testimonials.findIndex(item => item.id.toString() === id);
  if (index !== -1 && (author || text)) {
    if (author) db.testimonials[index].author = author;
    if (text) db.testimonials[index].text = text;
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

// delete testimonial
router.route('/testimonials/:id').delete((req, res) => {
  const id = req.params.id;
  const index = db.testimonials.findIndex(item => item.id.toString() === id);
  if (index !== -1) {
    db.testimonials.splice(index, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

module.exports = router;
