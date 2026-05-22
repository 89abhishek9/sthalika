import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Users, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { addDoc, collection, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { format, addDays } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';

interface Room {
  id: string;
  name: string;
  price: number;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoom: Room | null;
}

export default function BookingModal({ isOpen, onClose, selectedRoom }: BookingModalProps) {
  const { user, login, isAuthenticating } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [liveRoom, setLiveRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    checkIn: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    guests: 2,
    roomsCount: 1,
    guestName: '',
    guestEmail: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        guestName: user.displayName || '',
        guestEmail: user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!selectedRoom) {
      setLiveRoom(null);
      return;
    }
    setLiveRoom(selectedRoom);

    const unsubscribe = onSnapshot(doc(db, 'rooms', selectedRoom.id), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLiveRoom(prev => ({
          id: selectedRoom.id,
          name: data.name !== undefined ? data.name : selectedRoom.name,
          price: data.price !== undefined ? data.price : selectedRoom.price,
        }));
      }
    }, (error) => {
      console.warn("Could not retrieve live room details in modal:", error);
    });

    return unsubscribe;
  }, [selectedRoom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return login();
    const activeRoom = liveRoom || selectedRoom;
    if (!activeRoom) return;

    setLoading(true);
    try {
      const nightlyPrice = activeRoom.price;
      const days = Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1;
      const totalPrice = nightlyPrice * days * Number(formData.roomsCount);

      await addDoc(collection(db, 'bookings'), {
        roomId: activeRoom.id,
        roomName: activeRoom.name,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guests: Number(formData.guests),
        roomsCount: Number(formData.roomsCount),
        totalPrice,
        status: 'pending',
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });
      setStep(3);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bookings');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-charcoal/80 backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-charcoal border border-white/10 w-full max-w-2xl overflow-hidden relative shadow-2xl"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-mist/40 hover:text-mist z-10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-5 h-full">
            {/* Sidebar info */}
            <div className="md:col-span-2 bg-forest-dark p-8 md:p-12 border-r border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-beige mb-4 block">Reservation</span>
                <h2 className="text-3xl font-serif text-mist mb-8">Secure Your Stay</h2>
                
                {(liveRoom || selectedRoom) && (() => {
                  const activeRoom = liveRoom || selectedRoom;
                  if (!activeRoom) return null;
                  const daysNum = Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1;
                  const totalEst = activeRoom.price * daysNum * formData.roomsCount;
                  return (
                    <div className="space-y-6">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-mist/30 block mb-1">Selected Sanctuary</span>
                        <span className="text-mist font-serif text-lg leading-snug block">{activeRoom.name}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-mist/30 block mb-1">Nightly Rate</span>
                        <span className="text-mist font-serif text-lg italic">₹{activeRoom.price.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-mist/30 block mb-1">Duration</span>
                        <span className="text-mist font-serif text-lg">{daysNum} {daysNum === 1 ? 'Night' : 'Nights'}</span>
                      </div>
                      {formData.roomsCount > 1 && (
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-mist/30 block mb-1">Domes Selected</span>
                          <span className="text-mist font-serif text-lg">{formData.roomsCount} Domes</span>
                        </div>
                      )}
                      <div className="border-t border-white/10 pt-6">
                        <span className="text-[9px] uppercase tracking-widest text-beige block mb-1 font-bold">Estimated Total</span>
                        <span className="text-amber font-serif text-2xl font-bold">₹{totalEst.toLocaleString()}</span>
                        <span className="block text-[8px] uppercase tracking-widest text-mist/35 mt-1 font-sans">
                          ₹{activeRoom.price.toLocaleString()} x {daysNum} {daysNum === 1 ? 'night' : 'nights'} {formData.roomsCount > 1 ? `x ${formData.roomsCount} domes` : ''}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="pt-8 mt-auto border-t border-white/5">
                <p className="text-mist/30 text-[10px] leading-relaxed uppercase tracking-widest">
                  Personal concierge service available 24/7 post confirmation.
                </p>
              </div>
            </div>

            {/* Form Area */}
            <div className="md:col-span-3 p-8 md:p-12">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="text-xl font-serif text-mist mb-8">Select Dates</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-beige mb-2 font-bold">Check In</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-beige/50" />
                        <input 
                          type="date" 
                          value={formData.checkIn}
                          onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-none p-4 pl-12 text-mist focus:outline-none focus:border-beige transition-colors appearance-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-beige mb-2 font-bold">Check Out</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-beige/50" />
                        <input 
                          type="date" 
                          value={formData.checkOut}
                          onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-none p-4 pl-12 text-mist focus:outline-none focus:border-beige transition-colors appearance-none"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-beige mb-2 font-bold font-bold">Guests</label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-beige/50" />
                          <select 
                            value={formData.guests}
                            onChange={(e) => setFormData({...formData, guests: Number(e.target.value)})}
                            className="w-full bg-white/5 border border-white/10 rounded-none p-4 pl-12 text-mist focus:outline-none focus:border-beige transition-colors appearance-none cursor-pointer"
                          >
                            <option value="1" className="bg-charcoal">1 Guest</option>
                            <option value="2" className="bg-charcoal">2 Guests</option>
                            <option value="3" className="bg-charcoal">3 Guests</option>
                            <option value="4" className="bg-charcoal">4 Guests</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-beige mb-2 font-bold font-bold">No. of Domes</label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-beige/50" />
                          <select 
                            value={formData.roomsCount}
                            onChange={(e) => setFormData({...formData, roomsCount: Number(e.target.value)})}
                            className="w-full bg-white/5 border border-white/10 rounded-none p-4 pl-12 text-mist focus:outline-none focus:border-beige transition-colors appearance-none cursor-pointer"
                          >
                            <option value="1" className="bg-charcoal">1 Dome</option>
                            <option value="2" className="bg-charcoal">2 Domes</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={nextStep}
                    className="w-full mt-12 bg-beige text-charcoal py-5 font-bold uppercase text-[11px] tracking-widest hover:bg-beige/90 transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    Guest Information <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="text-xl font-serif text-mist mb-8">Guest Details</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-beige mb-2 font-bold">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.guestName}
                        onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-none p-4 text-mist focus:outline-none focus:border-beige transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-beige mb-2 font-bold">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.guestEmail}
                        onChange={(e) => setFormData({...formData, guestEmail: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-none p-4 text-mist focus:outline-none focus:border-beige transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div className="flex gap-4 mt-12">
                      <button 
                        type="button"
                        onClick={prevStep}
                        className="flex-1 border border-white/10 text-mist/60 py-5 font-bold uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all cursor-pointer"
                      >
                        Back
                      </button>
                      <button 
                        type="submit"
                        disabled={loading || isAuthenticating}
                        className="flex-[2] bg-amber text-charcoal py-5 font-bold uppercase text-[11px] tracking-widest hover:bg-amber/90 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                         isAuthenticating ? 'Signing in...' :
                         user ? 'Confirm Reservation' : 'Login to Book'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-24 h-24 rounded-full bg-amber/10 flex items-center justify-center mb-8">
                    <CheckCircle2 className="w-12 h-12 text-amber" />
                  </div>
                  <h3 className="text-3xl font-serif text-mist mb-4">Inquiry Sent</h3>
                  <p className="text-mist/50 mb-12 max-w-xs mx-auto text-sm leading-relaxed">
                    Your reservation request for {(liveRoom || selectedRoom)?.name} has been received. Our team will contact you shortly at {formData.guestEmail}.
                  </p>
                  <button 
                    onClick={onClose}
                    className="luxury-button"
                  >
                    Return to Sthalika
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
