const express = require('express');
const router = express.Router();
const { Events, Drivers, Passengers } = require('../models/events');

// Routes to implement
// GET all events
// GET event of specific ID
// DELETE event
// PUT new driver
// PUT new passenger

// Also need to implement validation and stuff
// Then, config and new routes and stuff
// And also error handling

// Eventually, it will get tiring to have to pull up the event with specific ID each time.
// How can we automate this?
// Middleware?

// GET all events
router.get('/', async (req, res) => {
  const allEvents = await Events.find();
  res.send(allEvents);
});

// GET event with specific ID
router.get('/:id', async (req, res) => {
  const event = await Events.findById(req.params.id);
  res.send(event);
});

// POST new passenger to pool
router.post('/:id/newpassenger', async (req, res) => {
  const event = await Events.findById(req.params.id);
  const newPassenger = new Passengers({
    name: 'Carl D',
    nickname: 'CarlsJr3',
  });
  // There's probably a cleaner way to do this using Mongoose syntax, but this vanilla solution is OK for now
  const passengerPool = event.drivers.find(element => element.isPassengerPool);
  passengerPool.passengers.push(newPassenger);
  event.save();
  res.send(newPassenger);
});

// POST new driver
router.post('/:id/newdriver', async (req, res) => {
  const event = await Events.findById(req.params.id);
  const newDriver = new Drivers({
    name: 'Carl D',
    nickname: 'CarlsJr',
    seats: 6,
  });
  event.drivers.push(newDriver);
  event.save();
  res.send(newDriver);
});

// POST new blank event
router.post('/new', async (req, res) => {
  const newEvent = new Events({
    name: 'Ice Skating With Friends',
    author: 'Carl D.',
    drivers: [],
  });
  // Include a default subdocument for the passenger pool
  const passengerPool = new Drivers({
    isPassengerPool: true,
    name: null,
    nickname: null,
    seats: null,
  });
  newEvent.drivers.push(passengerPool);
  const event = await newEvent.save();
  res.send(event);
});

module.exports = router;
