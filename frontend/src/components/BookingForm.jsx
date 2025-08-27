import React from 'react';
import { useBooking } from '../context/BookingContext';

function BookingForm() {
    const {
        checkInDate, setCheckInDate,
        checkOutDate, setCheckOutDate,
        adults, setAdults,
        numChildren, setNumChildren,
        selectedRoomType, setSelectedRoomType,
        error, setError,
        rooms,
    } = useBooking();

    const handleSearch = (e) => {
        e.preventDefault();
        if (!checkInDate || !checkOutDate) {
            setError('Please select both check-in and check-out dates.');
            return;
        }
        if (new Date(checkOutDate) <= new Date(checkInDate)) {
            setError('Check-out date must be after the check-in date.');
            return;
        }
        setError('');
    };

    const today = new Date().toISOString().split('T')[0];
    const roomTypes = ['all', ...new Set(rooms.map(room => room.roomType))];

    return (
        <section
            className="relative pt-28 pb-10"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1519710884009-2f43f31112c0?q=80&w=1600&auto=format&fit=crop')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="container mx-auto px-4">
                <div className="bg-white/90 backdrop-blur-md border border-white/40 p-6 rounded-2xl shadow-xl">
                    <h2 className="text-3xl font-extrabold tracking-tight text-[#0A2342] mb-4">Book Your Stay</h2>
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex flex-col w-full md:w-auto md:flex-1">
                            <label htmlFor="checkin" className="text-sm font-semibold mb-1 text-gray-600">Check-in</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="checkin"
                                    min={today}
                                    value={checkInDate}
                                    onChange={e => setCheckInDate(e.target.value)}
                                    className="p-3 h-12 border rounded-xl shadow-sm text-black w-full pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full md:w-auto md:flex-1">
                            <label htmlFor="checkout" className="text-sm font-semibold mb-1 text-gray-600">Check-out</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="checkout"
                                    min={checkInDate || today}
                                    value={checkOutDate}
                                    onChange={e => setCheckOutDate(e.target.value)}
                                    className="p-3 h-12 border rounded-xl shadow-sm text-black w-full pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full md:w-40">
                            <label htmlFor="adults" className="text-sm font-semibold mb-1 text-gray-600">Adults</label>
                            <select id="adults" value={adults} onChange={e => setAdults(Number(e.target.value))} className="p-3 h-12 border rounded-xl shadow-sm bg-white focus:ring-2 focus:ring-blue-500 text-black w-full">
                                {[...Array(5).keys()].map(i => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col w-full md:w-44">
                            <label htmlFor="children" className="text-sm font-semibold mb-1 text-gray-600">Children</label>
                            <select id="children" value={numChildren} onChange={e => setNumChildren(Number(e.target.value))} className="p-3 h-12 border rounded-xl shadow-sm bg-white focus:ring-2 focus:ring-blue-500 text-black w-full">
                                {[...Array(5).keys()].map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col w-full md:w-56">
                            <label htmlFor="roomType" className="text-sm font-semibold mb-1 text-gray-600">Room Type</label>
                            <select id="roomType" value={selectedRoomType} onChange={e => setSelectedRoomType(e.target.value)} className="p-3 h-12 border rounded-xl shadow-sm bg-white focus:ring-2 focus:ring-blue-500 capitalize text-black w-full">
                                {roomTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <button type="submit" className="bg-blue-600 text-white font-bold px-6 h-12 rounded-2xl shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all duration-150 w-full md:w-44 md:self-end">Search Rooms</button>
                    </form>
                    {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
                </div>
            </div>
        </section>
    );
}

export default BookingForm;