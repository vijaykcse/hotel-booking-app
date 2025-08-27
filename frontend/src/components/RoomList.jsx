import React from 'react';
import RoomCard from './RoomCard';
import { useBooking } from '../context/BookingContext';

function RoomList() {
    const { rooms, loading, error, selectedRoomType } = useBooking();

    if (loading) {
        return <p className="text-center text-gray-600 py-8">Loading rooms...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 py-8">Error: {error}</p>;
    }

    const filteredRooms = selectedRoomType === 'all'
        ? rooms
        : rooms.filter(room => room.roomType === selectedRoomType);

    return (
        <main className="container mx-auto px-6 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Rooms</h2>
            <div>
                {filteredRooms.length > 0 ? (
                    filteredRooms.map(room => <RoomCard key={room.id} room={room} />)
                ) : (
                    <p className="text-center text-gray-600">No rooms match your criteria.</p>
                )}
            </div>
        </main>
    );
}

export default RoomList;
