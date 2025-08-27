export const roomData = [
    {
      id: 1,
      name: 'Deluxe Queen Room',
      description: 'A spacious room with a queen-sized bed, perfect for couples or solo travelers.',
      imageUrl: 'https://placehold.co/600x400/a2d2ff/ffffff?text=Deluxe+Queen',
      basePrice: { single: 150, double: 180 },
      extraPerson: { adult: 50, child: 25 },
      amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini Fridge'],
      maxOccupancy: 3,
    },
    {
      id: 2,
      name: 'Executive King Suite',
      description: 'Luxurious suite with a king-sized bed, separate living area, and stunning city views.',
      imageUrl: 'https://placehold.co/600x400/bde0fe/ffffff?text=Executive+Suite',
      basePrice: { single: 250, double: 280 },
      extraPerson: { adult: 60, child: 30 },
      amenities: ['Free WiFi', 'Breakfast Included', 'Jacuzzi Tub', 'Work Desk'],
      maxOccupancy: 4,
    },
    {
      id: 3,
      name: 'Family Garden View',
      description: 'Ideal for families, this room features two double beds and a view of our beautiful gardens.',
      imageUrl: 'https://placehold.co/600x400/ffafcc/ffffff?text=Family+Room',
      basePrice: { single: 200, double: 240 },
      extraPerson: { adult: 50, child: 25 },
      amenities: ['Free WiFi', 'Connecting Rooms Available', 'Garden Access', 'Bathtub'],
      maxOccupancy: 5,
    },
  ];
  
  export const RATE_PLANS = {
    WITH_BREAKFAST: { id: 'wb', name: 'With Breakfast', multiplier: 1.15 }, // 15% extra for breakfast
    WITHOUT_BREAKFAST: { id: 'wob', name: 'Without Breakfast', multiplier: 1.0 },
  };