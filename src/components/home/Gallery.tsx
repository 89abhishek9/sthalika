import { motion } from 'motion/react';

const images = [
  '/assets/images/hero_cinematic_resort_1779192662182.png',
  '/assets/images/dome_interior_luxury_1779192676982.png',
  '/assets/images/stargazing_night_view_1779192695345.png',
  '/assets/images/forest_dining_experience_1779192713719.png',
  '/assets/images/tiger_falls_excursion_1779192731284.png',
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 bg-charcoal text-beige overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-[10px] uppercase tracking-[0.4em] text-amber mb-4">Captured Stillness</span>
          <h2 className="text-4xl md:text-6xl font-serif mb-8">The Sthalika Lens</h2>
          <div className="w-px h-24 bg-gradient-to-b from-amber to-transparent" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 auto-rows-[250px] md:auto-rows-[400px]">
          {/* Item 1 - Wide */}
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="col-span-2 row-span-1 md:row-span-2 relative group overflow-hidden"
          >
            <img 
              src={images[0]} 
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000" 
              alt="Gallery 1"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-charcoal/40 group-hover:bg-transparent transition-colors duration-700" />
          </motion.div>

          {/* Item 2 - Tall */}
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="col-span-1 row-span-2 relative group overflow-hidden"
          >
            <img 
              src={images[1]} 
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000" 
              alt="Gallery 2"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-charcoal/40 group-hover:bg-transparent transition-colors duration-700" />
          </motion.div>

          {/* Item 3 */}
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="col-span-1 row-span-1 relative group overflow-hidden"
          >
            <img 
              src={images[2]} 
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000" 
              alt="Gallery 3"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Item 4 */}
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="col-span-1 row-span-1 relative group overflow-hidden"
          >
            <img 
              src={images[3]} 
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000" 
              alt="Gallery 4"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Item 5 - Wide Bottom */}
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="col-span-full md:col-span-2 row-span-1 relative group overflow-hidden"
          >
            <img 
              src={images[4]} 
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 origin-bottom" 
              alt="Gallery 5"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-transparent transition-colors duration-700 px-8 flex items-end pb-8">
               <span className="text-xs uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-700">Tiger Falls Cascade</span>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 flex justify-center">
           <button className="luxury-button-outline !text-beige !border-beige/20 hover:!bg-beige hover:!text-charcoal px-12">
             Follow Our Journey @sthalika
           </button>
        </div>
      </div>
    </section>
  );
}
