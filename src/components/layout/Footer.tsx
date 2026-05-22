import { Instagram, Facebook, Mail, MapPin, Phone, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-charcoal text-beige/80 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 pb-20 border-b border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-5">
            <div className="mb-8">
              <h2 className="text-3xl font-serif text-beige tracking-[0.1em] uppercase">Sthalika</h2>
              <span className="text-[10px] text-amber tracking-[0.3em] uppercase">Abode of Serenity</span>
            </div>
            <p className="text-beige/85 font-light leading-relaxed max-w-sm mb-8 text-sm">
              A luxury glamping and boutique mountain retreat designed to reconnect modern travelers with the primal beauty of the Himalayas. Discover silence, elevated.
            </p>
            <div className="flex gap-6">
               <a href="#" className="hover:text-amber transition-colors"><Instagram className="w-5 h-5" /></a>
               <a href="#" className="hover:text-amber transition-colors"><Facebook className="w-5 h-5" /></a>
               <a href="#" className="hover:text-amber transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-beige mb-8 font-bold">The Retreat</h4>
            <ul className="flex flex-col gap-4 text-sm font-light">
              <li><a href="#about" className="hover:text-amber transition-colors">Philosophy</a></li>
              <li><a href="#accommodation" className="hover:text-amber transition-colors">Luxury Domes</a></li>
              <li><a href="#experiences" className="hover:text-amber transition-colors">Experiences</a></li>
              <li><a href="#location" className="hover:text-amber transition-colors">Location</a></li>
              <li><a href="#" className="hover:text-amber transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-beige mb-8 font-bold">Get in Touch</h4>
            <ul className="flex flex-col gap-6 text-sm font-light">
              <li className="flex gap-4">
                <MapPin className="w-5 h-5 text-amber shrink-0" />
                <span>Tiger Falls Road, Chakrata, <br />Uttarakhand 248123, India</span>
              </li>
              <li className="flex gap-4">
                <Phone className="w-5 h-5 text-amber shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex gap-4 items-center">
                <div className="flex-1 bg-white/5 p-4 flex justify-between items-center group cursor-pointer hover:bg-white/10 transition-colors">
                  <span className="text-[10px] uppercase tracking-widest font-bold">WhatsApp Concierge</span>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] uppercase tracking-[0.2em] opacity-40">
            © 2026 Sthalika Luxury Resorts. All Rights Reserved.
          </div>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 group text-[10px] uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity"
          >
            Back to sky
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-amber transition-colors">
              <ArrowUp className="w-4 h-4 group-hover:text-amber transition-colors" />
            </div>
          </button>

          <div className="flex gap-8 text-[10px] uppercase tracking-[0.1em] opacity-30">
            <a href="#" className="hover:opacity-100 italic font-serif">Privacy Policy</a>
            <a href="#" className="hover:opacity-100 italic font-serif">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
