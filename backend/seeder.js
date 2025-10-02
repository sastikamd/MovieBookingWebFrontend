const mongoose = require('mongoose');
const User = require('./models/User');
const Movie = require('./models/Movie');
const Booking = require('./models/Booking');
require('dotenv').config();

// Demo users with original credentials
const demoUsers = [
  {
    name: "Admin User",
    email: "admin@cinemabooking.com",
    password: "admin123",
    phone: "9876543210",
    role: "admin",
    isVerified: true,
    preferences: {
      favoriteGenres: ["Action", "Drama"],
      preferredLanguages: ["Hindi", "English"],
      location: {
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400070"
      }
    }
  },
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
    phone: "9876543211",
    role: "user",
    isVerified: true,
    preferences: {
      favoriteGenres: ["Action", "Sci-Fi", "Thriller"],
      preferredLanguages: ["Hindi", "English"],
      location: {
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400070"
      }
    }
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    password: "password123",
    phone: "9876543212",
    role: "user",
    isVerified: true,
    preferences: {
      favoriteGenres: ["Romance", "Drama", "Comedy"],
      preferredLanguages: ["Hindi", "Tamil"],
      location: {
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560029"
      }
    }
  }
];

// Indian blockbuster movies with valid poster URLs
const indianMovies = [
  {
    title: "RRR",
    description: "A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in the 1920s.",
    genre: ["Action", "Drama", "History"],
    director: "S. S. Rajamouli",
    cast: [
      { name: "N. T. Rama Rao Jr.", role: "Komaram Bheem" },
      { name: "Ram Charan", role: "Alluri Sitarama Raju" },
      { name: "Alia Bhatt", role: "Sita" }
    ],
    duration: 187,
    language: ["Telugu", "Hindi", "Tamil"],
    rating: { imdb: 7.8, certification: "UA" },
    poster: "https://picsum.photos/400/600.jpg",
    releaseDate: new Date("2022-03-25"),
    status: "now-showing",
    pricing: { premium: 400, regular: 280, economy: 200 },
    popularity: 95,
    bookingCount: 25000
  },
  {
    title: "K.G.F: Chapter 2",
    description: "In the blood-soaked Kolar Gold Fields, Rocky's name strikes fear into his foes. While his allies look up to him, the government sees him as a threat to law and order.",
    genre: ["Action", "Crime", "Drama"],
    director: "Prashanth Neel",
    cast: [
      { name: "Yash", role: "Rocky" },
      { name: "Sanjay Dutt", role: "Adheera" },
      { name: "Raveena Tandon", role: "Ramika Sen" }
    ],
    duration: 168,
    language: ["Kannada", "Hindi", "Telugu"],
    rating: { imdb: 8.4, certification: "UA" },
    poster: "https://picsum.photos/401/600.jpg",
    releaseDate: new Date("2022-04-14"),
    status: "now-showing",
    pricing: { premium: 350, regular: 250, economy: 180 },
    popularity: 92,
    bookingCount: 22000
  },
  {
    title: "Pushpa: The Rise",
    description: "Violence erupts between red sandalwood smugglers and the police charged with bringing down their organization in the Seshachalam forests of South India.",
    genre: ["Action", "Crime", "Drama"],
    director: "Sukumar",
    cast: [
      { name: "Allu Arjun", role: "Pushpa Raj" },
      { name: "Rashmika Mandanna", role: "Srivalli" },
      { name: "Fahadh Faasil", role: "Bhanwar Singh Shekhawat" }
    ],
    duration: 179,
    language: ["Telugu", "Hindi", "Tamil"],
    rating: { imdb: 7.6, certification: "UA" },
    poster: "https://picsum.photos/402/600.jpg",
    releaseDate: new Date("2021-12-17"),
    status: "now-showing",
    pricing: { premium: 380, regular: 260, economy: 190 },
    popularity: 88,
    bookingCount: 18000
  },
  {
    title: "Brahmastra Part One: Shiva",
    description: "A DJ with superpowers and his ladylove embark on a mission to protect the Brahmastra, a weapon of enormous energy, from dark forces closing in on them.",
    genre: ["Action", "Adventure", "Fantasy"],
    director: "Ayan Mukerji",
    cast: [
      { name: "Ranbir Kapoor", role: "Shiva" },
      { name: "Alia Bhatt", role: "Isha" },
      { name: "Amitabh Bachchan", role: "Professor Arvind Chaturvedi" }
    ],
    duration: 167,
    language: ["Hindi", "Telugu", "Tamil"],
    rating: { imdb: 5.6, certification: "UA" },
    poster: "https://picsum.photos/403/600.jpg",
    releaseDate: new Date("2022-09-09"),
    status: "now-showing",
    pricing: { premium: 420, regular: 300, economy: 220 },
    popularity: 75,
    bookingCount: 15000
  },
  {
    title: "Vikram",
    description: "Members of a black ops team must track and eliminate a gang of masked murderers.",
    genre: ["Action", "Crime", "Thriller"],
    director: "Lokesh Kanagaraj",
    cast: [
      { name: "Kamal Haasan", role: "Agent Vikram" },
      { name: "Vijay Sethupathi", role: "Santhanam" },
      { name: "Fahadh Faasil", role: "Amar" }
    ],
    duration: 174,
    language: ["Tamil", "Hindi", "Telugu"],
    rating: { imdb: 8.4, certification: "UA" },
    poster: "https://picsum.photos/404/600.jpg",
    releaseDate: new Date("2022-06-03"),
    status: "now-showing",
    pricing: { premium: 360, regular: 240, economy: 170 },
    popularity: 90,
    bookingCount: 20000
  },
  {
    title: "Avatar: The Way of Water",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri.",
    genre: ["Action", "Adventure", "Sci-Fi"],
    director: "James Cameron",
    cast: [
      { name: "Sam Worthington", role: "Jake Sully" },
      { name: "Zoe Saldana", role: "Neytiri" },
      { name: "Sigourney Weaver", role: "Kiri" }
    ],
    duration: 192,
    language: ["English", "Hindi"],
    rating: { imdb: 7.9, certification: "UA" },
    poster: "https://picsum.photos/405/600.jpg",
    releaseDate: new Date("2022-12-16"),
    status: "now-showing",
    pricing: { premium: 450, regular: 320, economy: 250 },
    popularity: 85,
    bookingCount: 16000
  }
];

const seedDatabase = async () => {
  try {
    console.log('🎬 Starting Cinema Booking System seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Movie.deleteMany({}),
      Booking.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Seed users
    console.log('👥 Seeding users...');
    const users = await User.insertMany(demoUsers);
    console.log(`✅ Seeded ${users.length} users`);

    // Seed movies  
    console.log('🎬 Seeding movies...');
    const movies = await Movie.insertMany(indianMovies);
    console.log(`✅ Seeded ${movies.length} movies`);

    // Verify seeding
    const userCount = await User.countDocuments();
    const movieCount = await Movie.countDocuments();

    console.log('\n🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('=' + '='.repeat(49));
    console.log(`📊 Users: ${userCount}`);
    console.log(`🎬 Movies: ${movieCount}`);

    console.log('\n🔐 Demo Credentials:');
    console.log('👨‍💼 Admin: admin@cinemabooking.com / admin123');
    console.log('👤 User 1: john.doe@example.com / password123');
    console.log('👤 User 2: priya.sharma@example.com / password123');

    console.log('\n🎬 Available Movies:');
    movies.forEach(movie => {
      const price = `₹${movie.pricing.economy} - ₹${movie.pricing.premium}`;
      console.log(`• ${movie.title} (${movie.language.join(', ')}) - ${price}`);
    });

    console.log('\n💰 Pricing Information:');
    console.log('🎫 Ticket prices: ₹170 - ₹450 (depending on movie and seat type)');
    console.log('💳 GST: 18% on all bookings');
    console.log('🎟️  Booking fee: ₹25 per ticket');

    console.log('\n🚀 Next Steps:');
    console.log('1. Start backend: npm run dev');
    console.log('2. Test API: http://localhost:5000/api/health');
    console.log('3. Check movies: http://localhost:5000/api/movies');
    console.log('4. Start frontend: npm run dev');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;