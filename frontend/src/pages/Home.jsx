import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LoadingMovieCard } from '../components/LoadingSpinner';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  const fetchTrendingMovies = async () => {
    try {
      const response = await axios.get('/movies/trending?limit=6');
      if (response.data.success) {
        setTrendingMovies(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      setError('Failed to load trending movies');
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow">
              Book Your Movie
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-shadow">
              Experience the magic of cinema with instant booking
            </p>
            <Link 
              to="/movies" 
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <i className="fas fa-ticket-alt mr-2"></i>
              Book Tickets Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CinemaBooking?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make movie booking simple, fast, and secure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-2xl text-primary-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
              <p className="text-gray-600">
                Book your tickets in seconds with our lightning-fast platform
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-2xl text-primary-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Your transactions are protected with bank-level security
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-mobile-alt text-2xl text-primary-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile Tickets</h3>
              <p className="text-gray-600">
                Skip the queue with digital tickets on your phone
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Movies Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trending Movies
            </h2>
            <p className="text-lg text-gray-600">
              Book tickets for the hottest movies this week
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array(6).fill(0).map((_, index) => (
                <LoadingMovieCard key={index} />
              ))
            ) : (
              trendingMovies.map((movie) => (
                <div key={movie._id} className="movie-card group">
                  <div className="aspect-poster overflow-hidden">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="movie-poster"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                      {movie.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>
                        <i className="fas fa-star text-yellow-500 mr-1"></i>
                        {movie.rating?.imdb || 'N/A'}
                      </span>
                      <span>{formatRuntime(movie.duration)}</span>
                      <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                        {movie.rating?.certification}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {movie.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600 font-semibold">
                        {formatPrice(movie.pricing)}
                      </span>
                      <Link
                        to={`/movie/${movie._id}`}
                        className="btn btn-primary"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {!loading && trendingMovies.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/movies"
                className="btn btn-secondary text-lg px-8"
              >
                View All Movies
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Book Your Next Movie?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of movie lovers who trust CinemaBooking
          </p>
          <Link
            to="/movies"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <i className="fas fa-play-circle mr-2"></i>
            Explore Movies
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;