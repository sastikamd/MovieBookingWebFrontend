import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ clientSecret, bookingData, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + '/booking-confirmation' },
    });

    if (error) {
      setMessage(error.message);
      setProcessing(false);
    } else {
      // On success, call backend to create booking record
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/bookings`,
          bookingData,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        onSuccess();
      } catch {
        setMessage('Booking failed after payment.');
        setProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: 'tabs' }} />
      {message && <p className="text-red-600">{message}</p>}
      <button disabled={processing || !stripe} className="btn btn-primary mt-4">
        {processing ? 'Processing...' : `Pay ₹${bookingData.amount}`}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingData || !bookingData.amount) {
      navigate('/movies');
      return;
    }

    async function createPaymentIntent() {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/create-payment-intent`,
        { amount: bookingData.amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClientSecret(data.clientSecret);
      setLoading(false);
    }

    createPaymentIntent();
  }, []);

  if (loading) return <p>Loading payment form...</p>;

  const onSuccess = () => {
    navigate('/booking-confirmation');
  };

  return (
    <div className="payment-page max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="mb-4 text-xl font-bold">Complete Your Payment</h2>

      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm clientSecret={clientSecret} bookingData={bookingData} onSuccess={onSuccess} />
      </Elements>
    </div>
  );
};

export default PaymentPage;
