import { motion, useScroll, useTransform } from 'motion/react';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';

export default function Hero() {
  const { scrollY } = useScroll();
  const { openBooking } = useBooking();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image / Video */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/assets/images/sthalika_dome_hero_actual_1779193723165.png" 
          alt="STHALIKA Resort Hero" 
          className="w-full h-full object-cover scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-transparent to-charcoal/60" />
      </motion.div>

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-left px-16 max-w-7xl mx-auto w-full mt-24 md:mt-32"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-[1px] bg-beige"></div>
          <motion.span 
            initial={{ opacity: 0, letterSpacing: '0.2em' }}
            animate={{ opacity: 1, letterSpacing: '0.5em' }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="text-beige text-xs uppercase tracking-[0.5em]"
          >
            Chakrata, Uttarakhand
          </motion.span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-serif font-light mb-6 leading-[0.9] text-mist">
          Abode of <br/>
          <span className="italic font-normal">Serenity</span>
        </h1>
        
        <p className="text-mist/80 text-lg md:text-xl font-light max-w-md leading-relaxed mb-12">
          Wake up above the clouds in handcrafted luxury domes surrounded by ancient pine forests and the silent majesty of the Himalayas.
        </p>

        <div className="flex space-x-12 mb-12">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-beige mb-2">Elevation</span>
            <span className="text-2xl font-serif text-mist">7,000 ft</span>
          </div>
          <div className="w-[1px] h-12 bg-white/20"></div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-beige mb-2">Environment</span>
            <span className="text-2xl font-serif text-mist italic">Wilderness</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <button 
            onClick={() => openBooking()}
            className="luxury-button group flex items-center gap-4"
          >
            Book Now
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>

      {/* Decorative Text Overlay */}
      <div className="absolute top-1/2 -right-40 -translate-y-1/2 z-0 pointer-events-none opacity-[0.03] overflow-hidden hidden lg:block">
        <span className="text-[25rem] font-serif font-bold italic select-none">Glamping</span>
      </div>

      {/* Bottom Interface Elements */}
      <div className="absolute bottom-12 left-0 w-full z-20 flex justify-between items-end px-16">
        {/* Booking Quick Selector */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="glass-card p-1 flex items-center hidden md:flex z-30"
        >
          <div 
            onClick={() => openBooking()}
            className="px-8 py-4 border-r border-white/10 hover:bg-white/5 transition-all duration-300 cursor-pointer group/item"
          >
            <div className="text-[9px] uppercase tracking-tighter text-beige opacity-70 group-hover/item:text-amber transition-colors">Check-In</div>
            <div className="text-sm text-mist group-hover/item:text-white transition-colors">12 Oct, 2024</div>
          </div>
          <div 
            onClick={() => openBooking()}
            className="px-8 py-4 border-r border-white/10 hover:bg-white/5 transition-all duration-300 cursor-pointer group/item"
          >
            <div className="text-[9px] uppercase tracking-tighter text-beige opacity-70 group-hover/item:text-amber transition-colors">Guests</div>
            <div className="text-sm text-mist group-hover/item:text-white transition-colors">02 Adults</div>
          </div>
          <div className="px-8 py-4 hover:bg-white/5 transition-all duration-300 cursor-pointer rounded-r-none">
            <button 
              onClick={() => openBooking()}
              className="text-[11px] uppercase tracking-widest font-bold text-mist flex items-center hover:text-beige transition-colors cursor-pointer"
            >
              Check Availability
              <ArrowRight className="w-4 h-4 ml-3" />
            </button>
          </div>
        </motion.div>

        {/* Discover Vertical Rail */}
        <div className="flex flex-col items-center space-y-8 pb-4">
          <div className="h-24 w-[1px] bg-white/30"></div>
          <span className="vertical-label">Scroll Down</span>
        </div>
      </div>

      {/* Down Arrow */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-mist/30"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-mist/50 to-transparent mx-auto" />
      </motion.div>

      {/* Weather Widget */}
      <div className="absolute top-40 right-16 hidden xl:flex flex-col items-end gap-2 text-beige/40">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="block text-[10px] uppercase tracking-widest font-bold">Chakrata, IN</span>
            <span className="block text-2xl font-serif text-beige/80">18°C</span>
          </div>
          <Wind className="w-8 h-8 text-amber/40" />
        </div>
        <span className="text-[8px] uppercase tracking-[0.2em]">Mist & Pine Scented</span>
      </div>
    </section>
  );
}

function Wind(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4a2 2 0 1 0 1.4-3.4H2" />
    </svg>
  );
}
