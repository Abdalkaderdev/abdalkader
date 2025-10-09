import { motion } from 'framer-motion';
import { FiQuote, FiStar, FiMapPin } from 'react-icons/fi';

interface ClientTestimonialsProps {
  className?: string;
}

export default function ClientTestimonials({ className = '' }: ClientTestimonialsProps) {
  const testimonials = [
    {
      quote: "Abdalkader transformed our e-commerce platform with AI-powered recommendations. Our conversion rate increased by 40% in just 3 months.",
      author: "Sarah Al-Rashid",
      role: "CTO, TechStart Dubai",
      location: "Dubai, UAE",
      rating: 5,
      project: "E-commerce AI Integration"
    },
    {
      quote: "The computer vision solution he built for our manufacturing process saved us thousands of hours in quality control. Exceptional work!",
      author: "Ahmed Hassan",
      role: "Operations Director, Industrial Solutions",
      location: "Riyadh, Saudi Arabia",
      rating: 5,
      project: "Computer Vision for Manufacturing"
    },
    {
      quote: "Working with Abdalkader was a game-changer. His expertise in ML model deployment helped us scale our AI infrastructure efficiently.",
      author: "Layla Al-Zahra",
      role: "Head of AI, FinTech Innovations",
      location: "Amman, Jordan",
      rating: 5,
      project: "ML Infrastructure Scaling"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 ${className}`}
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          What Clients Say
        </h3>
        <p className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          Trusted by startups and enterprises across the Middle East
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="lab-card p-6 relative"
          >
            <div className="absolute top-4 right-4 text-orange-500">
              <FiQuote className="w-6 h-6 opacity-50" />
            </div>

            <div className="flex items-center mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>

            <blockquote className="text-gray-300 mb-4 italic" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              "{testimonial.quote}"
            </blockquote>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                    {testimonial.author}
                  </div>
                  <div className="text-gray-400 text-sm" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                    {testimonial.role}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-gray-500 text-sm">
                    <FiMapPin className="w-3 h-3 mr-1" />
                    {testimonial.location}
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
                  {testimonial.project}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-400 text-sm" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          Ready to be the next success story? Let's discuss your AI project.
        </p>
      </div>
    </motion.div>
  );
}