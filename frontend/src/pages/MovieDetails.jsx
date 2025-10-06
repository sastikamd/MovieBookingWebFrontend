import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatType, setSeatType] = useState('regular');
  const [selectedShowDate, setSelectedShowDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]);
  const [selectedShowTime, setSelectedShowTime] = useState('7:00 PM');
  const [selectedTheater, setSelectedTheater] = useState({
    name: 'PVR Phoenix MarketCity',
    location: 'Mumbai'
  });

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await axios.get(`/movies/${id}`);
      if (response.data.success) {
        setMovie(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRuntime = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  const generateSeatNumbers = (count) => {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E'];
    for (let i = 0; i < count; i++) {
      const row = rows[Math.floor(i / 10)];
      const number = (i % 10) + 1;
      seats.push(`${row}${number}`);
    }
    return seats;
  };

  const handleSeatSelection = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else if (selectedSeats.length < 10) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  // Calculate total price including GST and booking fees
  const calculateTotalPrice = () => {
    if (!movie || selectedSeats.length === 0) return 0;
    const ticketPrice = movie.pricing[seatType] || 280;
    const subtotal = ticketPrice * selectedSeats.length;
    const gst = subtotal * 0.18;
    const bookingFee = selectedSeats.length * 25;
    return Math.round(subtotal + gst + bookingFee);
  };

  // New handleBookTickets navigates to payment page with booking info
 const handleBookTickets = () => {
  if (!isAuthenticated) {
    navigate('/login', { state: { from: `/movie/${id}` } });
    return;
  }

  if (selectedSeats.length === 0) {
    alert('Please select seats.');
    return;
  }

  // Fixed path from '/paymentPage' to '/payment'
  navigate('/payment', {
  state: {
    amount: calculateTotalPrice(),
    movieId: id,
    showDate: selectedShowDate,
    showTime: selectedShowTime,
    seats: selectedSeats.map(seatNumber => ({
      seatNumber,
      seatType,
      price: movie.pricing[seatType] || 280,
    })),
    theater: selectedTheater
  }
});

};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Movie not found</h2>
          <button onClick={() => navigate('/movies')} className="btn btn-primary">
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Movie Hero Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full max-w-md mx-auto rounded-lg shadow-xl"
              />
            </div>

            {/* Movie Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                <div className="flex flex-wrap items-center space-x-6 text-gray-300">
                  <span className="flex items-center">
                    <i className="fas fa-star text-yellow-500 mr-1"></i>
                    {movie.rating?.imdb || 'N/A'}/10
                  </span>
                  <span>{formatRuntime(movie.duration)}</span>
                  <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                    {movie.rating?.certification}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Director</h3>
                <p className="text-gray-300">{movie.director}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genre?.map((genre, index) => (
                    <span key={index} className="bg-primary-600 px-3 py-1 rounded text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.language?.map((lang, index) => (
                    <span key={index} className="bg-gray-700 px-3 py-1 rounded text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Plot</h3>
                <p className="text-gray-300 leading-relaxed">{movie.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Book Your Tickets
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Form */}
            <div className="space-y-6">
              {/* Seat Type */}
              <div>
                <label className="form-label">Seat Category</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(movie.pricing || {}).map(([type, price]) => (
                    <button
                      key={type}
                      onClick={() => setSeatType(type)}
                      className={`p-3 rounded border text-center transition-colors ${
                        seatType === type
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium capitalize">{type}</div>
                      <div className="text-sm text-gray-600">₹{price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seat Selection */}
              <div>
                <label className="form-label">
                  Select Seats ({selectedSeats.length}/10)
                </label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="inline-block bg-gray-300 px-6 py-2 rounded text-sm font-medium">
                      SCREEN
                    </div>
                  </div>
                  <div className="grid grid-cols-10 gap-1">
                    {generateSeatNumbers(50).map(seatNumber => (
                      <button
                        key={seatNumber}
                        onClick={() => handleSeatSelection(seatNumber)}
                        className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                          selectedSeats.includes(seatNumber)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        {seatNumber}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                      Available
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                      Selected
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-gray-50 p-6 rounded-lg h-fit">
              <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Movie:</span>
                  <span className="font-medium">{movie.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{selectedShowDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{selectedShowTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Theater:</span>
                  <span className="font-medium">{selectedTheater.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seats:</span>
                  <span className="font-medium">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium capitalize">{seatType}</span>
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <>
                  <div className="border-t border-gray-300 my-4 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tickets ({selectedSeats.length}):</span>
                      <span>₹{(movie.pricing[seatType] || 280) * selectedSeats.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%):</span>
                      <span>₹{Math.round((movie.pricing[seatType] || 280) * selectedSeats.length * 0.18)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Booking Fee:</span>
                      <span>₹{selectedSeats.length * 25}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-green-600">₹{calculateTotalPrice()}</span>
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={handleBookTickets}
                disabled={selectedSeats.length === 0}
                className="w-full btn btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-credit-card mr-2"></i>
                Book Tickets (₹{calculateTotalPrice()})
              </button>

              {!isAuthenticated && (
                <p className="text-sm text-gray-600 mt-3 text-center">
                  Please <Link to="/login" className="text-primary-600">login</Link> to book tickets
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
