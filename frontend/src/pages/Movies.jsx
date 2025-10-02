import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LoadingMovieCard } from '../components/LoadingSpinner';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    genres: [],
    languages: [],
    certifications: []
  });

  // Search and filter states
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [search, selectedGenre, selectedLanguage]);

  const fetchMovies = async () => {
    try {
      const params = {
        limit: 20
      };

      if (search) params.search = search;
      if (selectedGenre) params.genre = selectedGenre;
      if (selectedLanguage) params.language = selectedLanguage;

      const response = await axios.get('/movies', { params });

      if (response.data.success) {
        setMovies(response.data.data.movies);
        setFilters(response.data.data.filters);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const formatPrice = (pricing) => {
    if (!pricing) return '₹200+';
    return `₹${pricing.economy} - ₹${pricing.premium}`;
  };

  const formatRuntime = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Now Showing
          </h1>
          <p className="text-lg text-gray-600">
            Book tickets for the latest movies
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="form-label">Search Movies</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by movie title..."
                  value={search}
                  onChange={handleSearchChange}
                  className="form-input pl-10"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="form-label">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="form-input"
              >
                <option value="">All Genres</option>
                {filters.genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="form-label">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="form-input"
              >
                <option value="">All Languages</option>
                {filters.languages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {error}
          </div>
        )}

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {loading ? (
            Array(12).fill(0).map((_, index) => (
              <LoadingMovieCard key={index} />
            ))
          ) : movies.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <i className="fas fa-film text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No movies found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            movies.map((movie) => (
              <div key={movie._id} className="movie-card group">
                <div className="aspect-poster overflow-hidden">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="movie-poster"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {movie.title}
                  </h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
                    <span>
                      <i className="fas fa-star text-yellow-500 mr-1"></i>
                      {movie.rating?.imdb || 'N/A'}
                    </span>
                    <span>{formatRuntime(movie.duration)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-semibold text-sm">
                      {formatPrice(movie.pricing)}
                    </span>
                    <Link
                      to={`/movie/${movie._id}`}
                      className="btn btn-primary text-sm"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Movies;