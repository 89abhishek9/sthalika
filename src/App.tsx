/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import About from './components/home/About';
import Accommodation from './components/home/Accommodation';
import Experiences from './components/home/Experiences';
import Gallery from './components/home/Gallery';
import Testimonials from './components/home/Testimonials';
import Location from './components/home/Location';
import ContactCTA from './components/home/ContactCTA';
import { BookingProvider, useBooking } from './context/BookingContext';

function AppContent() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const { openBooking } = useBooking();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="relative min-h-screen bg-charcoal selection:bg-beige selection:text-charcoal">
      {/* Immersive Effects */}
      <div className="grain-overlay" />
      <div 
        className="cursor-glow hidden lg:block" 
        style={{ left: mousePos.x, top: mousePos.y }}
      />
      
      {/* Scroll Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-beige/30 z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <Navbar />

      {/* Layout Sections */}
      <Hero />
      <About />
      <Accommodation />
      <Experiences />
      <Gallery />
      <Testimonials />
      <Location />
      <ContactCTA />

      {/* Footer */}
      <Footer />

      {/* Ambient Audio Toggle placeholder */}
      <div className="fixed bottom-10 left-10 z-[50] hidden md:block">
        <button className="w-12 h-12 glass-card rounded-full flex items-center justify-center group">
          <div className="w-4 h-4 bg-amber/40 rounded-full animate-ping group-hover:bg-amber transition-colors" />
          <span className="absolute left-16 text-[8px] uppercase tracking-widest text-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity">Ambient Silence</span>
        </button>
      </div>

      {/* Floating CTA (Mobile) */}
      <div className="fixed bottom-6 left-6 right-6 z-[40] md:hidden">
        <button 
          onClick={() => openBooking()}
          className="w-full luxury-button !bg-amber !text-charcoal shadow-2xl uppercase tracking-widest font-bold"
        >
          Book Your Sanctuary
        </button>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <AppContent />
    </BookingProvider>
  );
}
