const Seat = require('../models/seat.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Seat.find());
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Seat.countDocuments();
    if (count === 0) return res.status(404).json({ message: 'Not found' });
    const rand = Math.floor(Math.random() * count);
    const seat = await Seat.findOne().skip(rand);
    res.json(seat);
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
};

exports.getById = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if (!seat) res.status(404).json({ message: 'Not found' });
    else res.json(seat);
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
};

exports.create = async (req, res) => {
  const { day, seat, client, email } = req.body;
  try {
    const isTaken = await Seat.findOne({ day: Number(day), seat: Number(seat) });
    if (isTaken) {
      return res.status(409).json({ message: "The slot is already taken..." });
    }

    const newSeat = new Seat({ day: Number(day), seat: Number(seat), client, email });
    await newSeat.save();

    const allSeats = await Seat.find();
    req.io.emit('seatsUpdated', allSeats);

    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
};

exports.update = async (req, res) => {
  const { day, seat, client, email } = req.body;
  try {
    const s = await Seat.findById(req.params.id);
    if (s) {
      if (day) s.day = Number(day);
      if (seat) s.seat = Number(seat);
      if (client) s.client = client;
      if (email) s.email = email;
      await s.save();
      
      const allSeats = await Seat.find();
      req.io.emit('seatsUpdated', allSeats);

      res.json({ message: 'OK' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
};

exports.delete = async (req, res) => {
  try {
    const s = await Seat.findById(req.params.id);
    if (s) {
      await Seat.deleteOne({ _id: req.params.id });

      const allSeats = await Seat.find();
      req.io.emit('seatsUpdated', allSeats);

      res.json({ message: 'OK' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || err });
  }
};
