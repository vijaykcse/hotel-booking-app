import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import roomRoutes from './routes/api/rooms.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173', 
  'https://vijaykcse.github.io/hotel-booking-app',
  'https://hotel-booking-app-pzfs-9ttiizauk-vijays-projects-df95abbd.vercel.app',  
];


const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

// ... rest of your server code
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hotel Booking API Running');
});

app.use('/api/rooms', roomRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));