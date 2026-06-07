const express = require('express');
const router = express.Router();
const db = require('./../db');
const { v4: uuidv4 } = require('uuid');

// get all seats
router.route('/seats').get((req, res) => {
  res.json(db.seats);
});

// get seat by id
router.route('/seats/:id').get((req, res) => {
  const id = req.params.id;
  const seat = db.seats.find(item => item.id.toString() === id);
  if (!seat) {
    res.status(404).json({ message: 'Not found' });
  } else {
    res.json(seat);
  }
});

// add new seat
router.route('/seats').post((req, res) => {
  const { day, seat, client, email } = req.body;
  if (day && seat && client && email) {
    const newSeat = {
      id: uuidv4(),
      day: Number(day),
      seat: Number(seat),
      client,
      email
    };
    db.seats.push(newSeat);
    res.json({ message: 'OK' });
  } else {
    res.status(400).json({ message: 'Bad request. All fields are required.' });
  }
});

// update seat
router.route('/seats/:id').put((req, res) => {
  const id = req.params.id;
  const { day, seat, client, email } = req.body;
  const index = db.seats.findIndex(item => item.id.toString() === id);
  if (index !== -1) {
    if (day) db.seats[index].day = Number(day);
    if (seat) db.seats[index].seat = Number(seat);
    if (client) db.seats[index].client = client;
    if (email) db.seats[index].email = email;
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

// delete seat
router.route('/seats/:id').delete((req, res) => {
  const id = req.params.id;
  const index = db.seats.findIndex(item => item.id.toString() === id);
  if (index !== -1) {
    db.seats.splice(index, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

module.exports = router;
