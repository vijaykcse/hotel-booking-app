const API_URL = 'https://hotel-booking-app-1-fpat.onrender.com';

export const fetchRooms = async () => {
  const response = await fetch(`${API_URL}/api/rooms`); // <-- add /api
  if (!response.ok) {
    throw new Error('Failed to fetch rooms from the server.');
  }
  return await response.json();
};

export const checkRoomAvailability = async (roomId, startDate, endDate) => {
  const response = await fetch(`${API_URL}/api/rooms/availability?roomId=${roomId}&startDate=${startDate}&endDate=${endDate}`); // <-- add /api
  if (!response.ok) {
    throw new Error('Failed to check room availability.');
  }
  return await response.json();
};

export const bookRoomApi = async (payload) => {
  const response = await fetch(`${API_URL}/api/rooms/book`, { // <-- add /api
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to book room.');
  }
  return await response.json();
};
