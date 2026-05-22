import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Instagram, Phone, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useBooking } from '../../context/BookingContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, login, logout, isAuthenticating } = useAuth();
  const { openBooking } = useBooking();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Philosophy', href: '#about' },
    { name: 'Accommodations', href: '#accommodation' },
    { name: 'Experiences', href: '#experiences' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Location', href: '#location' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 px-6 md:px-16 py-8 ${
        isScrolled ? 'bg-charcoal/90 backdrop-blur-md py-4' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1600px] mx-auto flex justify-between items-center">
        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-mist"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Logo */}
        <a href="/" className="flex flex-col items-center">
          <span className="text-2xl md:text-3xl font-serif text-mist tracking-[0.4em] uppercase font-light">
            Sthalika
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center md:gap-4 lg:gap-8 xl:gap-11 font-medium">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-[11px] uppercase tracking-[0.2em] text-beige/80 hover:text-mist transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          {user ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 group cursor-pointer">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-white/10" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <UserIcon className="w-4 h-4 text-mist" />
                  </div>
                )}
                <span className="text-[10px] uppercase tracking-widest text-mist font-bold hidden lg:block">
                  {user.displayName?.split(' ')[0]}
                </span>
                <button onClick={logout} className="p-2 hover:bg-white/5 rounded-full transition-colors text-beige/60 hover:text-mist cursor-pointer">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={login}
              disabled={isAuthenticating}
              className="text-[10px] uppercase tracking-[0.2em] text-amber border border-amber/30 px-6 py-2.5 hover:bg-amber hover:text-charcoal transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isAuthenticating ? 'Signing in...' : 'Log In'}
            </button>
          )}

          <button onClick={() => openBooking()} className="luxury-button cursor-pointer">
            Book Now
          </button>
        </div>

        {/* Desktop Social/Contact (Right) */}
        <div className="hidden md:flex items-center gap-6 text-beige/60 flex-shrink-0">
          <a href="#" className="hover:text-amber"><Instagram className="w-4 h-4" /></a>
          <a href="tel:+910000000000" className="hover:text-amber"><Phone className="w-4 h-4" /></a>
        </div>
        
        {/* Mobile Contact Link (Right) */}
        <div className="md:hidden flex items-center gap-3">
           {user && (
             <img src={user.photoURL || ''} alt="avatar" className="w-6 h-6 rounded-full border border-white/10" />
           )}
           <button 
             onClick={() => {
               if (user) {
                 openBooking();
               } else {
                 login();
               }
             }}
             className="text-amber uppercase text-[10px] tracking-widest font-semibold cursor-pointer"
           >
             {user ? 'Book' : 'Login'}
           </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-charcoal text-beige flex flex-col p-12 gap-8 md:hidden h-[calc(100dvh-100%)] overflow-y-auto pb-16"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-serif tracking-widest hover:text-amber transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Mobile Actions Container */}
            <div className="border-t border-white/10 pt-8 flex flex-col gap-4">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-7 h-7 rounded-full border border-white/10" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <UserIcon className="w-3.5 h-3.5 text-mist" />
                      </div>
                    )}
                    <span className="text-[11px] uppercase tracking-widest text-mist">
                      {user.displayName}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }} 
                    className="text-[10px] uppercase tracking-widest text-red-400 font-bold hover:text-red-300 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    login();
                    setIsMenuOpen(false);
                  }}
                  disabled={isAuthenticating}
                  className="w-full text-center text-[10px] uppercase tracking-[0.2em] text-amber border border-amber/30 py-3 hover:bg-amber hover:text-charcoal transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isAuthenticating ? 'Signing in...' : 'Sign In / Register'}
                </button>
              )}

              <button 
                onClick={() => {
                  openBooking();
                  setIsMenuOpen(false);
                }} 
                className="luxury-button w-full text-center py-4 cursor-pointer"
              >
                Book Now
              </button>
            </div>

            <div className="pt-8 border-t border-white/10 flex justify-between items-center mt-auto">
              <div className="flex gap-6">
                <a href="#" className="hover:text-amber transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="tel:+910000000000" className="hover:text-amber transition-colors"><Phone className="w-5 h-5" /></a>
              </div>
              <span className="text-[10px] uppercase tracking-widest opacity-50 font-mono">Chakrata, Uttarakhand</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
