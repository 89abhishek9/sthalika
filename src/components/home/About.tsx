import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-24 md:py-40 bg-charcoal px-6 relative overflow-hidden text-mist">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-forest/5 -z-0 rounded-l-full translate-x-1/2 opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center relative z-10">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
        >
          <div className="relative group">
            <div className="absolute -inset-4 border border-white/10 -z-10 group-hover:inset-0 transition-all duration-1000" />
            <img 
              src="/assets/images/forest_dining_experience_1779192713719.png" 
              alt="Luxury at Sthalika" 
              className="w-full h-[600px] object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, delay: 0.3 }}
           className="flex flex-col gap-10"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-beige" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-beige font-semibold">Our Philosophy</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-serif text-mist leading-tight font-light">
            Designed for those <br/> who seek <span className="italic font-normal">Stillness</span>.
          </h2>

          <div className="flex flex-col gap-6 text-mist/90 text-lg leading-relaxed font-light">
            <p>
              Hidden in the peaceful hills near Tiger Falls, STHALIKA was born from a desire to bridge the gap between primitive nature and contemporary luxury. We call it "Abode of Serenity" because here, the mountains do most of the talking.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="flex flex-col gap-2">
              <span className="text-4xl font-serif text-beige font-light">01</span>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-mist/70">Eco-Luxury</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-4xl font-serif text-beige font-light">02</span>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-mist/70">Elevation</span>
            </div>
          </div>

          <button className="luxury-button-outline w-fit mt-4">
            The Philosophy
          </button>
        </motion.div>
      </div>
    </section>
  );
}
