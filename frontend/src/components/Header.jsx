import React, { useState } from 'react';

function Header() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 inset-x-0 z-50 bg-white shadow-md">
            <div className="container mx-auto px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-black text-white flex items-center justify-center font-bold">H</div>
                    <span className="text-xl font-extrabold tracking-tight text-[#0C0D0EFF]">HotelStay</span>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
                    <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Rooms</a>
                    <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Booking</a>
                    <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>

                </nav>

                <button
                    className="md:hidden inline-flex items-center justify-center p-0 border-0 bg-transparent"
                    aria-label="Toggle navigation"
                    onClick={() => setOpen(v => !v)}
                >
                    <svg
                        className="h-5 w-5 text-gray-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {open ? (
                            <path d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <>
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </>
                        )}
                    </svg>
                </button>

            </div>

            {open && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <nav className="px-6 py-3 flex flex-col gap-2">
                        <a href="#" className="py-2 rounded-lg px-2 hover:bg-gray-50 text-gray-700">Home</a>
                        <a href="#" className="py-2 rounded-lg px-2 hover:bg-gray-50 text-gray-700">Rooms</a>
                        <a href="#" className="py-2 rounded-lg px-2 hover:bg-gray-50 text-gray-700">Booking</a>
                        <a href="#" className="py-2 rounded-lg px-2 hover:bg-gray-50 text-gray-700">Contact</a>
                        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors w-full">Login</button>
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Header;
