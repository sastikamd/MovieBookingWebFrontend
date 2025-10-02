const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  genre: [{
    type: String,
    required: true
  }],
  director: {
    type: String,
    required: [true, 'Director name is required']
  },
  cast: [{
    name: String,
    role: String
  }],
  duration: {
    type: Number,
    required: [true, 'Duration is required']
  },
  language: [{
    type: String,
    required: true
  }],
  rating: {
    imdb: {
      type: Number,
      min: 0,
      max: 10
    },
    certification: {
      type: String,
      enum: ['U', 'UA', 'A'],
      required: true
    }
  },
  poster: {
    type: String,
    required: [true, 'Poster URL is required'],
    match: [/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i, 'Valid image URL required']
  },
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required']
  },
  status: {
    type: String,
    enum: ['coming-soon', 'now-showing', 'ended'],
    default: 'now-showing'
  },
  pricing: {
    premium: { type: Number, default: 400 },
    regular: { type: Number, default: 280 },
    economy: { type: Number, default: 200 }
  },
  popularity: {
    type: Number,
    default: 0
  },
  bookingCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Simple indexes (NO text search to avoid conflicts)
movieSchema.index({ status: 1 });
movieSchema.index({ genre: 1 });
movieSchema.index({ language: 1 });

module.exports = mongoose.model('Movie', movieSchema);