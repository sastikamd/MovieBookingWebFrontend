const express = require('express');
const Movie = require('../models/Movie');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/movies
// @desc    Get all movies with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      search,
      genre,
      language,
      status = 'now-showing',
      page = 1,
      limit = 12,
      sort = 'popularity'
    } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (genre) {
      query.genre = { $in: [genre] };
    }

    if (language) {
      query.language = { $in: [language] };
    }

    if (status) {
      query.status = status;
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'title':
        sortOption = { title: 1 };
        break;
      case 'rating':
        sortOption = { 'rating.imdb': -1 };
        break;
      case 'release':
        sortOption = { releaseDate: -1 };
        break;
      default:
        sortOption = { popularity: -1, bookingCount: -1 };
    }

    // Execute query with pagination
    const movies = await Movie.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await Movie.countDocuments(query);

    // Get filter options
    const allMovies = await Movie.find({ status: 'now-showing' });
    const genres = [...new Set(allMovies.flatMap(movie => movie.genre))];
    const languages = [...new Set(allMovies.flatMap(movie => movie.language))];
    const certifications = [...new Set(allMovies.map(movie => movie.rating?.certification).filter(Boolean))];

    res.json({
      success: true,
      data: {
        movies,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        filters: {
          genres: genres.sort(),
          languages: languages.sort(),
          certifications: certifications.sort()
        }
      }
    });

  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching movies'
    });
  }
});

// @route   GET /api/movies/trending
// @desc    Get trending movies
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const movies = await Movie.find({ status: 'now-showing' })
      .sort({ popularity: -1, bookingCount: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: movies
    });

  } catch (error) {
    console.error('Get trending movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching trending movies'
    });
  }
});

// @route   GET /api/movies/:id
// @desc    Get single movie
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).lean();

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.json({
      success: true,
      data: movie
    });

  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching movie'
    });
  }
});

module.exports = router;