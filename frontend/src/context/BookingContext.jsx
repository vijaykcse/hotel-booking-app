import React, { useState, createContext, useContext, useMemo, useEffect } from 'react';
import { fetchRooms } from '../api/hotelApi';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [adults, setAdults] = useState(1);
    const [numChildren, setNumChildren] = useState(0);
    const [selectedRoomType, setSelectedRoomType] = useState('all');
    const [error, setError] = useState('');
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getRooms = async () => {
            try {
                const data = await fetchRooms();
                setRooms(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getRooms();
    }, []);

    const value = useMemo(() => ({
        checkInDate, setCheckInDate,
        checkOutDate, setCheckOutDate,
        adults, setAdults,
        numChildren, setNumChildren,
        selectedRoomType, setSelectedRoomType,
        error, setError,
        rooms, loading
    }), [checkInDate, checkOutDate, adults, numChildren, selectedRoomType, error, rooms, loading]);

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);
