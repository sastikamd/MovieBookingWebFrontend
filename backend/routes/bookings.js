const express = require('express');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      movieId,
      showDate,
      showTime,
      seats,
      theater
    } = req.body;

    // Get movie details
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    seats.forEach(seat => {
      totalAmount += seat.price;
    });

    // Add GST (18%) and booking fee (₹25 per ticket)
    const gst = totalAmount * 0.18;
    const bookingFee = seats.length * 25;
    totalAmount = totalAmount + gst + bookingFee;

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      movie: movieId,
      movieTitle: movie.title,
      showDate,
      showTime,
      seats,
      totalAmount: Math.round(totalAmount),
      theater,
      status: 'confirmed',
      paymentStatus: 'completed'
    });

    await booking.save();

    // Update movie booking count
    await Movie.findByIdAndUpdate(movieId, {
      $inc: { bookingCount: seats.length }
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating booking'
    });
  }
});

// @route   GET /api/bookings
// @desc    Get user bookings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('movie', 'title poster')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching bookings'
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('movie', 'title poster duration').lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching booking'
    });
  }
});

module.exports = router;