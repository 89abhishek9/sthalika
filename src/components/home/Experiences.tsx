import { motion } from 'motion/react';
import { Camera, MapPin, Music, Sparkles, Wind } from 'lucide-react';

const experiences = [
  {
    title: 'Stargazing Nights',
    description: 'Witness the Milky Way in all its glory from our private decks, far from city lights.',
    icon: Sparkles,
    image: '/assets/images/stargazing_night_view_1779192695345.png'
  },
  {
    title: 'Tiger Falls Excursion',
    description: 'A guided trek to the majestic 312ft waterfall, just minutes away from our retreat.',
    icon: MapPin,
    image: '/assets/images/tiger_falls_excursion_1779192731284.png'
  },
  {
    title: 'Forest Meditation',
    description: 'Find your center amidst whispering pines with our sunrise meditation sessions.',
    icon: Wind,
    image: '/assets/images/forest_dining_experience_1779192713719.png'
  }
];

export default function Experiences() {
  return (
    <section id="experiences" className="py-24 md:py-32 bg-charcoal px-6 overflow-hidden text-mist">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-[1px] bg-beige"></div>
              <motion.span 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 className="text-[10px] uppercase tracking-[0.4em] text-beige font-semibold"
              >
                Curated Moments
              </motion.span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif text-mist font-light leading-tight">Beyond The <br/><span className="italic font-normal">Standard Stay</span></h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-[1px] h-20 bg-white/20 hidden md:block"></div>
            <p className="text-mist/80 max-w-sm font-light leading-relaxed text-sm">
              Discover a collection of experiences designed to heighten your connection with the peak and the pine.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {experiences.map((exp, index) => (
            <motion.div 
              key={exp.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.2 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-8 border border-white/5">
                <img 
                  src={exp.image} 
                  alt={exp.title} 
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-transparent transition-colors duration-700" />
                <div className="absolute top-8 right-8 w-12 h-12 rounded-full glass-card flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                  <exp.icon className="w-5 h-5 text-beige" />
                </div>
              </div>
              <div className="flex items-baseline gap-4 mb-4">
                 <span className="text-[10px] uppercase tracking-widest text-beige font-bold">0{index + 1}</span>
                 <h3 className="text-3xl font-serif text-mist font-light tracking-wide">{exp.title}</h3>
              </div>
              <p className="text-mist/85 text-sm leading-relaxed font-light mb-8">{exp.description}</p>
              
              <div className="flex items-center gap-4 group-hover:gap-6 transition-all duration-500 text-beige">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Discover</span>
                <div className="w-12 h-[1px] bg-beige group-hover:w-20 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
