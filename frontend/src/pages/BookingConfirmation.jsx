import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await axios.get(`/bookings/${bookingId}`);
      if (response.data.success) {
        setBooking(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking not found</h2>
          <Link to="/profile" className="btn btn-primary">View My Bookings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check-circle text-4xl text-green-500"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Your tickets have been successfully booked
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
            <h2 className="text-2xl font-bold">{booking.movieTitle}</h2>
            <p className="text-primary-100 mt-1">Booking ID: {booking.bookingId}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Show Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                  Show Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <i className="fas fa-calendar text-gray-400 w-5"></i>
                    <span className="ml-3 text-gray-900">
                      {formatDate(booking.showDate)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-clock text-gray-400 w-5"></i>
                    <span className="ml-3 text-gray-900">{booking.showTime}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-gray-400 w-5"></i>
                    <span className="ml-3 text-gray-900">
                      {booking.theater?.name || 'PVR Phoenix MarketCity'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                  Seat Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <i className="fas fa-chair text-gray-400 w-5"></i>
                    <span className="ml-3 text-gray-900">
                      {booking.seats.length} Seat(s)
                    </span>
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-list text-gray-400 w-5 mt-1"></i>
                    <div className="ml-3">
                      <div className="flex flex-wrap gap-2">
                        {booking.seats.map((seat, index) => (
                          <span
                            key={index}
                            className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-sm font-medium"
                          >
                            {seat.seatNumber}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
                Payment Details
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-gray-900">Total Paid</span>
                  <span className="text-green-600">₹{booking.totalAmount}</span>
                </div>
                <div className="mt-2 text-sm text-green-600">
                  <i className="fas fa-check-circle mr-1"></i>
                  Payment Status: Completed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/profile" className="btn btn-secondary flex-1 text-center">
            <i className="fas fa-list mr-2"></i>
            View All Bookings
          </Link>
          <Link to="/movies" className="btn btn-primary flex-1 text-center">
            <i className="fas fa-film mr-2"></i>
            Book More Movies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;