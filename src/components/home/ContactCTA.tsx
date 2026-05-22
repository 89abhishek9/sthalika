import { motion } from 'motion/react';
import { ArrowRight, Mail, Send } from 'lucide-react';

export default function ContactCTA() {
  return (
    <section className="relative py-48 md:py-64 bg-charcoal overflow-hidden text-center text-mist">
      {/* Background Stargazing Image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="/assets/images/stargazing_night_view_1779192695345.png" 
          alt="Night sky" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.5 }}
           className="flex flex-col items-center gap-10"
        >
          <div className="flex items-center gap-6">
             <div className="w-12 h-px bg-beige" />
             <span className="text-[11px] uppercase tracking-[0.5em] text-beige">Begin Your Journey</span>
             <div className="w-12 h-px bg-beige" />
          </div>

          <h2 className="text-6xl md:text-9xl font-serif font-light leading-none">
            Your Mountain <br/><span className="italic font-normal">Stillness</span> Awaits.
          </h2>

          <p className="text-mist/50 text-xl font-light max-w-2xl leading-relaxed">
            Reserved for those who seek the extraordinary. Experience the luxury of Himalayan silence combined with modern dome living.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 mt-6">
            <button className="luxury-button !px-16 !py-6 !text-sm">
              Reserve Stay
            </button>
            <button className="luxury-button-outline !px-16 !py-6 !text-sm">
              Concierge
            </button>
          </div>
        </motion.div>
      </div>

      {/* Floating Sparkle Elements */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber rounded-full animate-pulse shadow-[0_0_10px_#C58B55]" />
      <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-amber rounded-full animate-pulse delay-500 shadow-[0_0_10px_#C58B55]" />
    </section>
  );
}
