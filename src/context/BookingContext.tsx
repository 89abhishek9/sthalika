import { createContext, useContext, useState, ReactNode } from 'react';
import BookingModal from '../components/booking/BookingModal';

interface Room {
  id: string;
  name: string;
  price: number;
}

interface BookingContextType {
  openBooking: (room?: Room) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const defaultRoom: Room = {
  id: 'celestial-dome',
  name: 'Celestial Luxury Dome',
  price: 8000
};

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const openBooking = (room?: Room) => {
    setSelectedRoom(room || defaultRoom);
    setIsOpen(true);
  };

  const closeBooking = () => {
    setIsOpen(false);
    setSelectedRoom(null);
  };

  return (
    <BookingContext.Provider value={{ openBooking, closeBooking }}>
      {children}
      <BookingModal 
        isOpen={isOpen} 
        onClose={closeBooking} 
        selectedRoom={selectedRoom} 
      />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
