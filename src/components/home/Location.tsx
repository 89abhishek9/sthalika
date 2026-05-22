import { motion } from 'motion/react';
import { MapPin, Navigation, Car, Calendar } from 'lucide-react';

export default function Location() {
  return (
    <section id="location" className="py-24 md:py-40 bg-charcoal px-6 text-mist border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-12"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-[1px] bg-beige"></div>
                 <span className="text-[10px] uppercase tracking-[0.4em] text-beige font-semibold">Location</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-serif text-mist font-light leading-tight">Hidden In The <br /><span className="italic font-normal">Chakrata Hills</span></h2>
            </div>

            <div className="flex flex-col gap-10">
              <div className="flex gap-8">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-beige" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl text-mist mb-3 font-light">Tiger Falls Proximity</h4>
                  <p className="text-mist/85 text-sm leading-relaxed font-light">Secluded location just 15 minutes from the majestic 312ft Tiger Falls. A ridge-side retreat where the sky meets the deodar canopy.</p>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                  <Navigation className="w-5 h-5 text-beige" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl text-mist mb-3 font-light">Secluded Access</h4>
                  <p className="text-mist/85 text-sm leading-relaxed font-light">A scenic 3-hour journey from Dehradun. The drive itself is the beginning of your meditation.</p>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-white/10 flex flex-wrap gap-12">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-beige font-bold block mb-2">Distance</span>
                <span className="text-mist font-serif text-xl">Dehradun • 90 km</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-beige font-bold block mb-2">Duration</span>
                <span className="text-mist font-serif text-xl">3.5 Hours Ascent</span>
              </div>
            </div>

            <button className="luxury-button w-fit">
              Get Directions
            </button>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative"
          >
            {/* Cinematic Map Mockup */}
            <div className="aspect-[4/5] bg-charcoal rounded-sm overflow-hidden shadow-2xl relative border border-white/10 grayscale">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3435.545!2d77.9060054!3d30.7099112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390f4b721037b841%3A0xb2b4124af3e3f5dc!2sSTHALIKA%20RESORT!5e0!3m2!1sen!2sin!4v1716121000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(1.2) contrast(0.8)' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Sparkles(props: any) {
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
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
