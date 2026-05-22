import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Maximize2, Coffee, ShieldCheck, Wifi, Shield, Edit3, CheckCircle, Clock, Calendar, Check, X as CancelIcon, User, Layers, Info } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../hooks/useAuth';
import { collection, doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestEmail: string;
  guests: number;
  roomsCount: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  userId: string;
  createdAt: string;
}

const DEFAULT_ROOMS = [
  {
    id: 'celestial-dome',
    name: 'Celestial Luxury Dome',
    description: 'Our flagship experience featuring 360-degree views of the Tiger Falls valley and the Himalayan range.',
    price: 8000,
    image: '/assets/images/dome_interior_luxury_1779192676982.png',
    amenities: ['King Size Bed', 'Private Deck', 'Heated Interiors', 'Fiber Wi-Fi'],
    size: '450 sq.ft',
    views: 'Valley Panorama'
  },
  {
    id: 'stellar-dome',
    name: 'Stellar Vista Dome',
    description: 'A stellar escape featuring expansive skylights and pristine views of the rolling pine forest and starry mountain skies.',
    price: 8000,
    image: '/assets/images/dome_interior_luxury_1779192676982.png', // reusing existing highly aesthetic image
    amenities: ['King Size Bed', 'Star-Gazing Deck', 'Heated Interiors', 'Plush Bathrobe'],
    size: '450 sq.ft',
    views: 'Sunset Pine Valley'
  }
];

export default function Accommodation() {
  const { openBooking } = useBooking();
  const { user } = useAuth();
  
  const [rooms, setRooms] = useState(DEFAULT_ROOMS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [priceInputs, setPriceInputs] = useState<{ [key: string]: number }>({
    'celestial-dome': 8000,
    'stellar-dome': 8000
  });
  const [successStatus, setSuccessStatus] = useState<{ [key: string]: boolean }>({});
  const [loadingStatus, setLoadingStatus] = useState<{ [key: string]: boolean }>({});
  const [adminTab, setAdminTab] = useState<'bookings' | 'rates'>('bookings');
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    size: string;
    views: string;
    amenities: string;
  } | null>(null);

  const isAdmin = user?.email === 'hosting1356@gmail.com';

  useEffect(() => {
    // Listen to real-time changes of the room details
    const unsubscribe = onSnapshot(collection(db, 'rooms'), (snapshot) => {
      const dbRooms: { [key: string]: any } = {};
      snapshot.forEach((doc) => {
        dbRooms[doc.id] = doc.data();
      });

      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          if (dbRooms[room.id] !== undefined) {
            const data = dbRooms[room.id];
            return {
              ...room,
              name: data.name !== undefined ? data.name : room.name,
              price: data.price !== undefined ? data.price : room.price,
              description: data.description !== undefined ? data.description : room.description,
              image: data.image !== undefined ? data.image : room.image,
              size: data.size !== undefined ? data.size : room.size,
              views: data.views !== undefined ? data.views : room.views,
              amenities: data.amenities !== undefined ? data.amenities : room.amenities,
            };
          }
          return room;
        })
      );

      setPriceInputs((prevInputs) => {
        const nextInputs = { ...prevInputs };
        Object.keys(dbRooms).forEach((roomId) => {
          if (dbRooms[roomId].price !== undefined) {
            nextInputs[roomId] = dbRooms[roomId].price;
          }
        });
        return nextInputs;
      });
    }, (error) => {
      console.warn("Firestore collection rooms read failure:", error);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    // Listen to real-time bookings
    const unsubscribe = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      const list: Booking[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Booking);
      });
      // Sort by newest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setBookings(list);
    }, (error) => {
      console.warn("Firestore bookings read failure:", error);
    });

    return unsubscribe;
  }, [isAdmin]);

  const handleUpdatePrice = async (roomId: string) => {
    const newPrice = priceInputs[roomId];
    if (isNaN(newPrice) || newPrice <= 0) {
      alert("Please enter a valid positive number for the price.");
      return;
    }

    setLoadingStatus(prev => ({ ...prev, [roomId]: true }));
    try {
      await setDoc(doc(db, 'rooms', roomId), {
        price: Number(newPrice),
        updatedBy: user?.email,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setSuccessStatus(prev => ({ ...prev, [roomId]: true }));
      setTimeout(() => {
        setSuccessStatus(prev => ({ ...prev, [roomId]: false }));
      }, 3000);
    } catch (err) {
      console.error("Error setting new room price:", err);
      alert("Failed to write live pricing. Make sure you are signed in as admin.");
    } finally {
      setLoadingStatus(prev => ({ ...prev, [roomId]: false }));
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    setUpdatingBookingId(bookingId);
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: status
      });
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const handleStartEdit = (room: any) => {
    setEditForm({
      id: room.id,
      name: room.name,
      price: room.price,
      description: room.description,
      image: room.image,
      size: room.size,
      views: room.views,
      amenities: room.amenities.join(', '),
    });
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;
    if (!editForm.name.trim()) {
      alert("Please enter a sanctuary name.");
      return;
    }
    if (isNaN(editForm.price) || editForm.price <= 0) {
      alert("Please enter a valid positive pricing rate.");
      return;
    }

    setLoadingStatus(prev => ({ ...prev, [editForm.id]: true }));
    try {
      const amenitiesArray = editForm.amenities
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0);

      await setDoc(doc(db, 'rooms', editForm.id), {
        name: editForm.name.trim(),
        price: Number(editForm.price),
        description: editForm.description.trim(),
        image: editForm.image.trim(),
        size: editForm.size.trim(),
        views: editForm.views.trim(),
        amenities: amenitiesArray,
        updatedBy: user?.email,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setSuccessStatus(prev => ({ ...prev, [editForm.id]: true }));
      setTimeout(() => {
        setSuccessStatus(prev => ({ ...prev, [editForm.id]: false }));
      }, 3000);
      setEditForm(null);
    } catch (err) {
      console.error("Error setting custom room properties in Firestore:", err);
      alert("Failed to save room details. Ensure you are signed in as an administrator.");
    } finally {
      setLoadingStatus(prev => ({ ...prev, [editForm.id]: false }));
    }
  };

  return (
    <section id="accommodation" className="py-24 md:py-32 bg-charcoal px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-[1px] bg-beige"></div>
            <motion.span 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               className="text-[10px] uppercase tracking-[0.4em] text-beige font-semibold"
            >
              The Sanctuary
            </motion.span>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif text-mist font-light">
            Living Above <br/>
            <span className="italic font-normal">The Clouds</span>
          </h2>
        </div>

        {/* Admin Pricing Panel & Bookings Board */}
        {isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 p-8 border border-amber/30 bg-charcoal shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 bg-amber/10 border-l border-b border-amber/20 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-amber" />
              <span className="text-[8px] uppercase tracking-widest text-amber font-bold">Admin Panel</span>
            </div>
            
            <h3 className="text-xl font-serif text-mist mb-2 flex items-center gap-3">
              <span>Sthalika Concierge Control</span>
            </h3>
            <p className="text-xs text-mist/60 leading-relaxed mb-6 max-w-2xl">
              Manage your retreat's essential configurations. Instantly adjust booking statuses, approve guest itineraries, or shift pricing according to season and demand.
            </p>

            {/* Admin Tabs switcher */}
            <div className="flex border-b border-white/10 mb-8 gap-6">
              <button 
                onClick={() => setAdminTab('bookings')}
                className={`pb-4 text-[10px] uppercase tracking-widest font-bold transition-all relative cursor-pointer ${adminTab === 'bookings' ? 'text-amber' : 'text-mist/40 hover:text-mist/70'}`}
              >
                Reservations Log
                <span className="ml-2 px-1.5 py-0.5 text-[8px] bg-white/10 text-mist font-mono rounded-full">{bookings.length}</span>
                {adminTab === 'bookings' && <motion.div layoutId="admLine" className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber" />}
              </button>
              <button 
                onClick={() => setAdminTab('rates')}
                className={`pb-4 text-[10px] uppercase tracking-widest font-bold transition-all relative cursor-pointer ${adminTab === 'rates' ? 'text-amber' : 'text-mist/40 hover:text-mist/70'}`}
              >
                Stay Pricing
                {adminTab === 'rates' && <motion.div layoutId="admLine" className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber" />}
              </button>
            </div>

            {/* TAB CONTENT: BOOKINGS */}
            {adminTab === 'bookings' && (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="p-12 text-center border border-white/5 bg-white/[0.01]">
                    <Clock className="w-8 h-8 text-mist/20 mx-auto mb-3" />
                    <p className="text-xs text-mist/40 uppercase tracking-widest leading-relaxed">No reservation records submitted yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {bookings.map((booking) => {
                      const isPending = booking.status === 'pending';
                      const isConfirmed = booking.status === 'confirmed';
                      const isCancelled = booking.status === 'cancelled';
                      const isWorking = updatingBookingId === booking.id;

                      return (
                        <div 
                          key={booking.id} 
                          className="p-6 bg-[#222222] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-white/15 transition-colors"
                        >
                          <div className="space-y-2">
                            {/* Guest details & Status */}
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-xs text-mist font-bold tracking-wide flex items-center gap-2">
                                <User className="w-3 h-3 text-beige" /> {booking.guestName}
                              </span>
                              <span className="text-[10px] text-mist/40 font-mono">({booking.guestEmail})</span>
                              
                              {/* Status Badge */}
                              <span className={`px-2 py-0.5 text-[8px] uppercase tracking-widest font-bold font-sans rounded-sm ${
                                isConfirmed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                isCancelled ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                                'bg-amber/10 text-amber border border-amber/20'
                              }`}>
                                {booking.status}
                              </span>
                            </div>

                            {/* Stay specifications */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs text-mist/50 font-light">
                              <div className="flex items-center gap-1.5">
                                <Layers className="w-3 h-3 text-amber/60" />
                                <span className="font-serif text-amber/90">{booking.roomName}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-mist/30" />
                                <span className="font-mono">{booking.checkIn}</span>
                                <span className="text-mist/30">to</span>
                                <span className="font-mono">{booking.checkOut}</span>
                              </div>
                              <div className="font-sans text-[11px] uppercase tracking-wider text-beige">
                                {booking.roomsCount || 1} Dome{(booking.roomsCount || 1) > 1 ? 's' : ''} • {booking.guests} Guest{booking.guests > 1 ? 's' : ''}
                              </div>
                            </div>
                            
                            <div className="text-[9px] text-mist/30 font-mono">
                              Booking Document ID: {booking.id} • Created: {new Date(booking.createdAt).toLocaleString()}
                            </div>
                          </div>

                          {/* Price and Action Buttons */}
                          <div className="flex sm:flex-row md:flex-col lg:flex-row items-stretch md:items-end lg:items-center gap-4 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                            <div className="text-left md:text-right flex-1 md:flex-initial">
                              <span className="block text-[8px] uppercase tracking-widest text-mist/30 mb-0.5 font-sans font-bold">Reservation Price</span>
                              <span className="text-xl font-serif text-mist font-light">₹{booking.totalPrice.toLocaleString()}</span>
                            </div>

                            <div className="flex gap-2">
                              {isPending ? (
                                <>
                                  <button
                                    onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                    disabled={isWorking}
                                    title="Confirm Reservation"
                                    className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-charcoal p-3 rounded-none transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                    disabled={isWorking}
                                    title="Cancel Reservation"
                                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50 p-3 rounded-none transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center"
                                  >
                                    <CancelIcon className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] uppercase tracking-widest text-mist/30 italic py-2 pr-2">
                                  Action Logs Locked
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: PRICES & CONTENT */}
            {adminTab === 'rates' && (
              <div className="space-y-8">
                {editForm ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 border border-white/10 bg-white/[0.02]"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-lg font-serif text-amber uppercase tracking-widest">
                        Configure Sanctuary: <span className="text-mist font-sans font-medium hover:underline">{editForm.id}</span>
                      </h4>
                      <button 
                        onClick={() => setEditForm(null)}
                        className="text-mist/40 hover:text-mist text-xs uppercase tracking-wider font-bold p-2 hover:bg-white/5 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {/* Name */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-beige mb-2 font-bold">Sanctuary Name</label>
                        <input 
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-none p-4 text-mist text-sm font-sans focus:outline-none focus:border-amber transition-colors"
                          placeholder="e.g. Celestial Luxury Dome"
                        />
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-beige mb-2 font-bold">Nightly Price (₹)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mist/40 text-sm font-serif">₹</span>
                          <input 
                            type="number"
                            value={editForm.price}
                            onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                            className="w-full bg-white/5 border border-white/10 rounded-none p-4 pl-8 text-mist text-sm font-serif focus:outline-none focus:border-amber transition-colors"
                            placeholder="8000"
                          />
                        </div>
                      </div>

                      {/* Image URL */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] uppercase tracking-widest text-beige mb-2 font-bold">Image URL</label>
                        <input 
                          type="text"
                          value={editForm.image}
                          onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-none p-4 text-mist text-sm font-mono focus:outline-none focus:border-amber transition-colors"
                          placeholder="/assets/images/dome_interior_luxury_1779192676982.png"
                        />
                        <span className="text-[10px] text-mist/35 block mt-1 font-mono">Provide an image path or direct URL.</span>
                      </div>

                      {/* Size */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-beige mb-2 font-bold">Space Size</label>
                        <input 
                          type="text"
                          value={editForm.size}
                          onChange={(e) => setEditForm({ ...editForm, size: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-none p-4 text-mist text-sm font-sans focus:outline-none focus:border-amber transition-colors"
                          placeholder="e.g. 450 sq.ft"
                        />
                      </div>

                      {/* Views */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-beige mb-2 font-bold">Mountain Views</label>
                        <input 
                          type="text"
                          value={editForm.views}
                          onChange={(e) => setEditForm({ ...editForm, views: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-none p-4 text-mist text-sm font-sans focus:outline-none focus:border-amber transition-colors"
                          placeholder="e.g. Sunset Pine Valley"
                        />
                      </div>

                      {/* Amenities */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] uppercase tracking-widest text-beige mb-2 font-bold">Amenities (separated by commas)</label>
                        <input 
                          type="text"
                          value={editForm.amenities}
                          onChange={(e) => setEditForm({ ...editForm, amenities: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-none p-4 text-mist text-sm font-sans focus:outline-none focus:border-amber transition-colors"
                          placeholder="e.g. King Size Bed, Private Deck, Heated Interiors, Fiber Wi-Fi"
                        />
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] uppercase tracking-widest text-beige mb-2 font-bold">Description / Story Description</label>
                        <textarea 
                          rows={3}
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-none p-4 text-mist text-sm font-sans focus:outline-none focus:border-amber transition-colors leading-relaxed resize-none"
                          placeholder="Short introductory description for guests..."
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleSaveEdit}
                        disabled={loadingStatus[editForm.id]}
                        className="bg-amber text-charcoal px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-amber/90 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {loadingStatus[editForm.id] ? 'Saving...' : 'Publish Changes'}
                      </button>
                      <button
                        onClick={() => setEditForm(null)}
                        className="border border-white/10 text-mist/60 px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-white/5 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {rooms.map((room) => (
                      <div key={room.id} className="p-6 bg-white/[0.02] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-4">
                          <img src={room.image} alt={room.name} className="w-14 h-14 object-cover border border-white/10 grayscale-[0.3]" />
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-mist/40 block mb-0.5">Stay Unit</span>
                            <span className="text-mist font-bold text-sm tracking-wide block">{room.name}</span>
                            <span className="text-amber font-mono text-xs mt-0.5 block">Rate: ₹{room.price.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleStartEdit(room)}
                          className="bg-white/5 hover:bg-amber hover:text-charcoal border border-white/10 hover:border-amber text-mist/80 px-4 py-3 text-[10px] uppercase tracking-widest font-bold w-full md:w-auto flex justify-center items-center gap-2 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Accommodation Cards */}
        <div className="space-y-16">
          {rooms.map((room, index) => (
            <motion.div 
              key={room.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden bg-charcoal border border-white/5 shadow-2xl"
            >
              {/* Image Section */}
              <div className={`lg:col-span-7 relative overflow-hidden h-[400px] lg:h-[600px] ${index % 2 === 1 ? 'lg:order-last' : ''}`}>
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-8 left-8 flex gap-3">
                  <span className="bg-charcoal/80 backdrop-blur-md text-mist text-[10px] uppercase tracking-[0.2em] px-4 py-2 border border-white/10">
                    Celestial Series
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="lg:col-span-5 p-12 lg:p-16 flex flex-col justify-center bg-charcoal relative">
                <span className="absolute top-8 right-12 text-9xl font-serif text-white/[0.02] pointer-events-none select-none">
                  {`0${index + 1}`}
                </span>
                
                <h3 className="text-3xl lg:text-4xl font-serif text-mist mb-6 font-light">{room.name}</h3>
                <p className="text-mist/85 font-light leading-relaxed mb-10 text-base lg:text-lg">{room.description}</p>
                
                <div className="flex flex-wrap gap-8 mb-12">
                  <div className="flex flex-col gap-2">
                     <span className="text-[9px] uppercase tracking-widest text-beige font-bold">Space</span>
                     <span className="text-mist font-serif">{room.size}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                     <span className="text-[9px] uppercase tracking-widest text-beige font-bold">Views</span>
                     <span className="text-mist font-serif italic">{room.views}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                     <span className="text-[9px] uppercase tracking-widest text-beige font-bold">Amenities</span>
                     <span className="text-mist/95 text-[11px] font-sans flex flex-wrap gap-2 pt-1 font-semibold max-w-xs uppercase tracking-wide leading-relaxed">
                       {room.amenities.join(' • ')}
                     </span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-10 flex items-center justify-between">
                  <div>
                    <span className="block text-[9px] uppercase tracking-widest text-beige/50 mb-2 font-bold font-semibold">Per Night</span>
                    <span className="text-3xl font-serif text-mist font-light">₹{room.price.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => openBooking(room)}
                    className="luxury-button flex items-center gap-3 group/btn cursor-pointer"
                  >
                    Reserve
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center">
           <p className="text-mist/40 italic font-serif text-xl font-light">
             "Our stays are designed for those who value privacy and proximity to stars."
           </p>
        </div>
      </div>
    </section>
  );
}
