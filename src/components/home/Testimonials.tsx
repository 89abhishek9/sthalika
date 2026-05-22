import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    text: "Mornings at Sthalika are magical. Waking up to the mist rolling over the domes is an experience words can't capture. The ultimate mountain luxury.",
    author: "Ananya Sharma",
    location: "New Delhi",
    role: "Architect"
  },
  {
    text: "The perfect blend of wilderness and comfort. We spent our evenings stargazing from the private deck. It felt like we were the only people on earth.",
    author: "Rohan Mehra",
    location: "Dehradun",
    role: "Creative Director"
  },
  {
    text: "Sthalika isn't just a stay; it's a reset button for the soul. The attention to detail in the rustic interiors is world-class.",
    author: "Elena Petrova",
    location: "Moscow",
    role: "Wellness Traveler"
  }
];

export default function Testimonials() {
  return (
    <section className="py-32 bg-charcoal overflow-hidden border-y border-white/5 text-mist">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-24">
          <Quote className="w-16 h-16 text-beige/10 mb-8" />
          <h2 className="text-5xl md:text-7xl font-serif font-light">Guest Whispers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {testimonials.map((t, i) => (
            <motion.div 
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 1 }}
              className="flex flex-col items-start bg-transparent p-4 transition-all duration-500"
            >
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-beige text-beige opacity-50" />)}
              </div>
              <p className="text-mist/95 italic text-xl leading-relaxed mb-10 font-light">"{t.text}"</p>
              <div className="mt-auto flex items-center gap-4">
                <div className="w-10 h-[1px] bg-beige/50" />
                <div>
                  <span className="block font-serif text-mist text-2xl font-light">{t.author}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-beige/90 font-bold">{t.role} • {t.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
