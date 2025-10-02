# 🎬 CinemaBooking - Complete Movie Booking System

A modern, full-stack movie booking application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## ✨ Features

- 🔐 **User Authentication**: Secure JWT-based login/registration
- 🎥 **Movie Browsing**: Search and filter movies by genre, language, rating
- 🎟️ **Ticket Booking**: Interactive seat selection and booking system
- 📱 **Responsive Design**: Works perfectly on mobile and desktop
- 💰 **Indian Pricing**: INR pricing with GST calculation
- 📊 **User Dashboard**: View booking history and profile management
- 🔒 **Admin Features**: Movie management capabilities
- 🚀 **Modern UI**: Beautiful interface with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (URI already configured)

### Installation

1. **Extract the project**
   ```bash
   # Extract the ZIP file
   cd cinema-booking-fixed
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install      # Install dependencies
   npm run seed     # Seed database with demo data
   npm run dev      # Start backend server (port 5000)
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd ../frontend
   npm install      # Install dependencies
   npm run dev      # Start frontend server (port 3000)
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 🔐 Demo Credentials

### Admin Account
- **Email**: admin@cinemabooking.com
- **Password**: admin123

### User Account
- **Email**: john.doe@example.com
- **Password**: password123

## 📁 Project Structure

```
cinema-booking-fixed/
├── backend/                 # Node.js + Express API
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── server.js           # Main server file
│   ├── seeder.js          # Database seeder
│   └── package.json       # Backend dependencies
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   └── App.jsx        # Main app component
│   ├── index.html         # HTML template
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **React Router** - Client-side routing

## 🎬 Available Movies

The system comes pre-loaded with popular Indian movies:

1. **RRR** (Telugu, Hindi, Tamil) - ₹200-₹400
2. **K.G.F: Chapter 2** (Kannada, Hindi, Telugu) - ₹180-₹350
3. **Pushpa: The Rise** (Telugu, Hindi, Tamil) - ₹190-₹380
4. **Brahmastra Part One: Shiva** (Hindi) - ₹220-₹420
5. **Vikram** (Tamil, Hindi, Telugu) - ₹170-₹360
6. **Avatar: The Way of Water** (English, Hindi) - ₹250-₹450

## 💰 Pricing Structure

- **Ticket Categories**: Economy, Regular, Premium
- **GST**: 18% on all bookings
- **Booking Fee**: ₹25 per ticket
- **Payment**: Simulated (no real payment gateway)

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Movies
- `GET /api/movies` - Get all movies (with filters)
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/:id` - Get single movie

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get single booking

## 🔧 Environment Variables

### Backend (.env is already configured)
```
MONGODB_URI=mongodb+srv://apple:LlOUH8bbHkR1ZOUl@cluster0.v0kul.mongodb.net/moviebooking
JWT_SECRET=your-super-secret-jwt-key-for-cinema-booking-2024
PORT=5000
```

### Frontend (.env is already configured)
```
VITE_API_URL=http://localhost:5000/api
```

## 🔧 Key Fixes Implemented

✅ **PostCSS Config**: Uses .cjs extension (fixes ES module errors)
✅ **Tailwind Config**: Uses .cjs extension (fixes ES module errors)  
✅ **Movie Model**: NO text indexing (fixes MongoDB bulk write errors)
✅ **API Connection**: Properly configured frontend-backend communication
✅ **Demo Credentials**: Clickable buttons in login page
✅ **Seeder**: Working database seeder with proper data validation

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 5000 or 3000
   npx kill-port 5000
   npx kill-port 3000
   ```

2. **Database Connection Error**
   - MongoDB URI is pre-configured and should work automatically
   - Check internet connection

3. **Frontend Can't Connect to Backend**
   - Ensure backend server is running on port 5000
   - Check VITE_API_URL in frontend/.env

4. **PostCSS/Tailwind Errors**
   - Files use .cjs extension - this is correct!
   - Don't change to .js extension

## 🚀 Success Criteria

After setup, you should be able to:
- ✅ Access homepage at http://localhost:3000
- ✅ See trending movies on homepage
- ✅ Login with demo credentials (clickable buttons)
- ✅ Browse movies with search/filter
- ✅ Book tickets for a movie with seat selection
- ✅ View booking confirmation
- ✅ Check booking history in profile

## 🎯 Complete User Flow

1. **Homepage**: View trending movies and features
2. **Movies Page**: Browse all movies with search/filter
3. **Authentication**: Login/register (demo credentials provided)
4. **Movie Details**: View movie info and select seats
5. **Booking**: Complete booking with pricing calculation
6. **Confirmation**: View booking confirmation with details
7. **Profile**: Manage profile and view booking history

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Ensure both backend and frontend servers are running
2. Check that seeder ran successfully (creates movies)
3. Use demo credentials for quick testing
4. Check browser console for any errors

---

**Made with ❤️ for movie lovers**

*This is a demo application. No real payments are processed.*
