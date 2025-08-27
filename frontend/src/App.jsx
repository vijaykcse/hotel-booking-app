import React from 'react';
import { BookingProvider } from './context/BookingContext';
import Header from './components/Header';
import BookingForm from './components/BookingForm';
import RoomList from './components/RoomList';

function App() {
  return (
    <BookingProvider>
      <div className="bg-gray-50 min-h-screen  font-sans">
        <Header />
        <BookingForm />
        <RoomList />
      </div>
    </BookingProvider>
  );
}

export default App;
