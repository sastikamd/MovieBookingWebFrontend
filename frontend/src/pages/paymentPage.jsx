import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ bookingData, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  const token = localStorage.getItem('token');
  const backendUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Create payment intent when component mounts
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/payments/create-payment-intent`,
        { amount: bookingData.amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setClientSecret(response.data.clientSecret);
      }
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      alert('Payment setup failed');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Movie Booking Customer',
        },
      }
    });

    if (error) {
      console.error('Payment failed:', error);
      alert(`Payment failed: ${error.message}`);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded:', paymentIntent);
      
      // Create booking after successful payment
      try {
        const bookingResponse = await axios.post(
          `${backendUrl}/bookings`,
          {
            movieId: bookingData.movieId,
            showDate: bookingData.showDate,
            showTime: bookingData.showTime,
            seats: bookingData.seats,
            theater: bookingData.theater
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (bookingResponse.data.success) {
          onSuccess(bookingResponse.data.data);
        }
      } catch (bookingError) {
        console.error('Booking creation failed:', bookingError);
        alert('Payment successful but booking failed');
      }
      
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || processing || !clientSecret}
        className="w-full btn btn-primary disabled:opacity-50"
      >
        {processing ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Processing...
          </>
        ) : (
          `Pay ₹${bookingData.amount}`
        )}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const bookingData = location.state || {};

  const handlePaymentSuccess = (booking) => {
    alert('Payment and booking successful!');
    navigate(`/booking-confirmation/${booking._id}`);
  };

  if (!bookingData.amount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>No booking data found. Please start booking process again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Complete Payment</h2>
        
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Booking Summary</h3>
          <p><strong>Amount:</strong> ₹{bookingData.amount}</p>
          <p><strong>Seats:</strong> {bookingData.seats?.map(s => s.seatNumber).join(', ')}</p>
          <p><strong>Date:</strong> {bookingData.showDate}</p>
          <p><strong>Time:</strong> {bookingData.showTime}</p>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm 
            bookingData={bookingData}
            onSuccess={handlePaymentSuccess}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentPage;
