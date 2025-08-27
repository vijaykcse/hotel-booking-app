import express from 'express';
import { getRooms, checkAvailability, bookRoom } from '../../services/googleSheets.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rooms = await getRooms();
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/availability', async (req, res) => {
  const { startDate, endDate, roomId } = req.query;
  if (!startDate || !endDate || !roomId) {
    return res.status(400).json({ msg: 'Please provide start date, end date, and room ID' });
  }
  try {
    const isAvailable = await checkAvailability(startDate, endDate, roomId);
    res.json({ isAvailable });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Booking endpoint
router.post('/book', async (req, res) => {
  try {
    const { roomId, startDate, endDate, adults, numChildren, ratePlanId, totalPrice } = req.body || {};
    if (!roomId || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'roomId, startDate, endDate are required' });
    }
    const result = await bookRoom({ roomId, startDate, endDate, adults, numChildren, ratePlanId, totalPrice });
    if (!result.success) {
      return res.status(409).json(result);
    }
    res.json(result);
  } catch (err) {
    console.error('[POST /api/rooms/book]', err?.message || err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;