const express = require('express');
const router = express.Router();
const db = require('./../db');
const { v4: uuidv4 } = require('uuid');

// get all concerts
router.route('/concerts').get((req, res) => {
  res.json(db.concerts);
});

// get concert by id
router.route('/concerts/:id').get((req, res) => {
  const id = req.params.id;
  const concert = db.concerts.find(item => item.id.toString() === id);
  if (!concert) {
    res.status(404).json({ message: 'Not found' });
  } else {
    res.json(concert);
  }
});

// add new concert
router.route('/concerts').post((req, res) => {
  const { performer, genre, price, day, image } = req.body;
  if (performer && genre && price && day && image) {
    const newConcert = {
      id: uuidv4(),
      performer,
      genre,
      price: Number(price),
      day: Number(day),
      image
    };
    db.concerts.push(newConcert);
    res.json({ message: 'OK' });
  } else {
    res.status(400).json({ message: 'Bad request. All fields are required.' });
  }
});

// update concert
router.route('/concerts/:id').put((req, res) => {
  const id = req.params.id;
  const { performer, genre, price, day, image } = req.body;
  const index = db.concerts.findIndex(item => item.id.toString() === id);
  if (index !== -1) {
    if (performer) db.concerts[index].performer = performer;
    if (genre) db.concerts[index].genre = genre;
    if (price) db.concerts[index].price = Number(price);
    if (day) db.concerts[index].day = Number(day);
    if (image) db.concerts[index].image = image;
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

// delete concert
router.route('/concerts/:id').delete((req, res) => {
  const id = req.params.id;
  const index = db.concerts.findIndex(item => item.id.toString() === id);
  if (index !== -1) {
    db.concerts.splice(index, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

module.exports = router;
