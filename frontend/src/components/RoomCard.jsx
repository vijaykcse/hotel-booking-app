import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { calculatePrice } from '../helpers/calculatePrice';
import { checkRoomAvailability, bookRoomApi } from '../api/hotelApi';

// This should be fetched or defined in a shared config
const RATE_PLANS = {
    WITH_BREAKFAST: { id: 'wb', name: 'With Breakfast', multiplier: 1.15 },
    WITHOUT_BREAKFAST: { id: 'wob', name: 'Without Breakfast', multiplier: 1.0 },
};

function RoomCard({ room }) {
    const { checkInDate, checkOutDate, adults, numChildren } = useBooking();
    const [selectedRatePlan, setSelectedRatePlan] = useState(RATE_PLANS.WITHOUT_BREAKFAST.id);
    const [availability, setAvailability] = useState({ status: 'idle', isAvailable: false });
    const [bookingState, setBookingState] = useState('idle'); // idle | loading | success

    useEffect(() => {
        const check = async () => {
            if (checkInDate && checkOutDate && new Date(checkOutDate) > new Date(checkInDate)) {
                setAvailability({ status: 'checking', isAvailable: false });
                try {
                    const data = await checkRoomAvailability(room.id, checkInDate, checkOutDate);
                    setAvailability({ status: data.isAvailable ? 'available' : 'unavailable', isAvailable: data.isAvailable });
                } catch (error) {
                    console.error("Failed to check availability for room " + room.id, error);
                    setAvailability({ status: 'unavailable', isAvailable: false });
                }
            } else {
                setAvailability({ status: 'idle', isAvailable: false });
            }
        };
        check();
    }, [checkInDate, checkOutDate, room.id]);

    const bookingDetails = { checkInDate, checkOutDate, adults, numChildren };
    const totalPrice = calculatePrice(room, bookingDetails, selectedRatePlan, RATE_PLANS);
    const totalGuests = adults + numChildren;
    const isOccupancyExceeded = totalGuests > room.maxOccupancy;

    // Use the imageUrl from the sheet directly, with a single reliable fallback.
    const imageSrc = room.imageUrl && typeof room.imageUrl === 'string'
        ? room.imageUrl
        : 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Available';

    const handleBookNow = async () => {
        setBookingState('loading');
        try {
            const payload = {
                roomId: room.id,
                startDate: checkInDate,
                endDate: checkOutDate,
                adults,
                numChildren,
                ratePlanId: selectedRatePlan,
                totalPrice
            };
            const res = await bookRoomApi(payload);
            if (res.success) {
                setBookingState('success');
            } else {
                setBookingState('idle');
                alert('Booking failed: ' + (res.message || 'Unknown error'));
            }
        } catch (e) {
            setBookingState('idle');
            alert('Booking failed: ' + e.message);
        }
    };

    const AvailabilityStatus = () => {
        switch (availability.status) {
            case 'checking':
                return <p className="text-sm font-semibold text-[#0A2342]">Checking availability...</p>;
            case 'available':
                return null;
            case 'unavailable':
                return <p className="text-sm font-semibold text-red-600">Sold out for selected dates.</p>;
            default:
                return <p className="text-sm text-gray-500">Select dates to check availability.</p>;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row my-6 transform hover:-translate-y-0.5">
            <img
                src={imageSrc}
                alt={room.name}
                className="w-full md:w-1/3 h-48 md:h-auto object-cover"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Error'; }}
            />
            <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                    <h3 className="text-2xl font-extrabold tracking-tight text-[#0A2342]">{room.name}</h3>
                    <p className="text-[#1d1d1b]/80 mt-2">{room.description}</p>
                    <div className="mt-4">
                        <h4 className="font-semibold text-[#0A2342]">Amenities</h4>
                        <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-[#1d1d1b]/80">
                            {room.amenities.map(amenity => (
                                <li key={amenity} className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[#0A2342]/70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16Zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    <span>{amenity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p className="text-sm text-[#0A2342]/70 mt-3">Max Occupancy: {room.maxOccupancy} guests</p>
                    {isOccupancyExceeded && <p className="text-red-500 font-semibold mt-2">Guest number exceeds maximum occupancy.</p>}
                </div>
                <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="w-full md:w-auto">
                        <label htmlFor={`rate-plan-${room.id}`} className="text-sm font-semibold text-[#0A2342] mb-1 block">Rate Plan</label>
                        <select
                            id={`rate-plan-${room.id}`}
                            value={selectedRatePlan}
                            onChange={e => setSelectedRatePlan(e.target.value)}
                            className="p-2 border rounded-md bg-white w-full focus:ring-2 focus:ring-[#B8860B] focus:border-[#B8860B]"
                        >
                            <option value={RATE_PLANS.WITHOUT_BREAKFAST.id}>{RATE_PLANS.WITHOUT_BREAKFAST.name}</option>
                            <option value={RATE_PLANS.WITH_BREAKFAST.id}>{RATE_PLANS.WITH_BREAKFAST.name}</option>
                        </select>
                    </div>
                    <div className="text-center md:text-right w-full md:w-auto">
                        <div className="mb-2">
                            {totalPrice > 0 ? (
                                <>
                                    <p className="text-3xl font-extrabold tracking-tight text-[#0A2342]">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalPrice)}</p>
                                    <p className="text-sm text-[#0A2342]/70">Total for your stay</p>
                                </>
                            ) : (
                                <p className="text-lg font-semibold text-[#0A2342]/80">Select dates to see price</p>
                            )}
                        </div>
                        <AvailabilityStatus />
                        <button
                            onClick={handleBookNow}
                            disabled={bookingState !== 'idle' || !availability.isAvailable || isOccupancyExceeded || totalPrice <= 0}
                            className="mt-2 bg-[#B8860B] text-white px-6 py-2 rounded-md font-bold tracking-wide hover:bg-[#a1780a] transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed w-full md:w-auto transform hover:scale-[1.03] hover:shadow-md"
                        >
                            {bookingState === 'loading' ? 'Booking...' : bookingState === 'success' ? 'Room Booked!' : 'Book Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoomCard;
