'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Feather, Clock, Sparkles, User, Heart } from 'lucide-react';

// Sample poems - will be replaced with database content later
const SAMPLE_POEMS = [
  {
    id: '1',
    title: "Morning Light",
    content: `Golden threads unfold\nAcross the quiet canvas—\nDay begins to breathe.`,
    type: "Haiku"
  },
  {
    id: '2',
    title: "For What Remains",
    content: `We kept the small things:\nA button, smooth from your thumb,\nThe recipe card stained with oil and time,\nYour laugh caught in the pause\nBetween the tick and tock.\n\nLoss is not the absence\nBut the learning how to hold\nWhat can't be held—\nThe shape of you in every empty chair,\nThe echo of your name\nIn rooms that know you're gone.`,
    type: "Free Verse"
  },
  {
    id: '3',
    title: "First Steps",
    content: `Tiny toes on wooden floor,\nWobble, fall, then try once more—\nBalance found in baby's eyes,\nWatch them bloom before they fly.`,
    type: "Limerick"
  }
];

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-black' 
        : 'bg-white'
    }`}
    style={{ fontFamily: 'Philosopher, Georgia, serif' }}
    >
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isDark 
          ? 'bg-black/80 border-b border-white/10' 
          : 'bg-white/80 border-b border-slate-200'
      } backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Feather className={`w-6 h-6 ${isDark ? 'text-white' : 'text-slate-900'}`} />
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Appoet
            </span>
          </motion.div>

          <div className="flex items-center gap-6">
            <a 
              href="#samples" 
              className={`text-sm transition-colors ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Samples
            </a>
            <a 
              href="#pricing" 
              className={`text-sm transition-colors ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Pricing
            </a>
            <a 
              href="#about" 
              className={`text-sm transition-colors ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              About
            </a>
            
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full transition-all ${
                isDark 
                  ? 'hover:bg-white/10 text-white' 
                  : 'hover:bg-slate-100 text-slate-900'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Main Glass Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`rounded-2xl p-12 ${
              isDark 
                ? 'bg-transparent' 
                : 'backdrop-blur-sm bg-white/40 shadow-lg border border-white/60'
            }`}
          >
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 ${
                isDark 
                  ? 'bg-white/5 text-white border border-white/20' 
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              <Feather className="w-4 h-4" />
              <span>Written by a human poet</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-6xl md:text-7xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              APPOET
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-xl md:text-2xl mb-12 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Commission poetry written with care, delivered with human meaning.
            </motion.p>

            {/* Featured Poem */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`my-12 p-8 rounded-xl border ${
                isDark 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white/60 border-slate-200'
              }`}
            >
              <p className={`text-lg md:text-xl italic leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Words carefully chosen,<br />
                Each line a gentle offering—<br />
                Not from circuits, but soul.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-8 py-4 rounded-lg text-lg font-semibold transition-all ${
                isDark
                  ? 'bg-white text-black hover:bg-slate-100'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Request Your Poem
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`mt-6 text-sm ${
                isDark ? 'text-slate-500' : 'text-slate-500'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              I do no AI. Just authentic words.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Tier Pricing
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
            style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Choose according to your needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Quick Poem */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`rounded-xl p-8 border transition-all ${
                isDark 
                  ? 'bg-white/5 border-white/10 hover:border-white/20' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className={`w-5 h-5 ${isDark ? 'text-white' : 'text-slate-900'}`} />
                <h3 className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Quick Poem
                </h3>
              </div>
              
              <div className="mb-6">
                <span className={`text-5xl font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>$0.99</span>
              </div>

              <ul className={`space-y-3 mb-8 text-sm ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <li className="flex items-start gap-2">
                  <span className={isDark ? 'text-white' : 'text-slate-900'}>•</span>
                  <span>2 stanzas (8-12 lines)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={isDark ? 'text-white' : 'text-slate-900'}>•</span>
                  <span>Haiku, Limerick, or Short Free Verse</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>24-hour delivery upon accepting</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="font-semibold">Request 5 poems, get 1 extra free</span>
                </li>
              </ul>

              <button className={`w-full py-3 rounded-lg font-semibold transition-all ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Choose Quick Poem
              </button>
            </motion.div>

            {/* Custom Poem */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`rounded-xl p-8 border-2 transition-all ${
                isDark 
                  ? 'bg-white/5 border-white/30 hover:border-white/50' 
                  : 'bg-slate-50 border-slate-900 hover:border-slate-700 shadow-md hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Feather className={`w-5 h-5 ${isDark ? 'text-white' : 'text-slate-900'}`} />
                  <h3 className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    Custom Poem
                  </h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  isDark ? 'bg-white/10 text-white' : 'bg-slate-900 text-white'
                }`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  POPULAR
                </span>
              </div>
              
              <div className="mb-6">
                <span className={`text-5xl font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>$1.99</span>
                <span className={`text-lg ml-2 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  starting
                </span>
              </div>

              <ul className={`space-y-3 mb-8 text-sm ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <li className="flex items-start gap-2">
                  <span className={isDark ? 'text-white' : 'text-slate-900'}>•</span>
                  <span>Up to 5 stanzas (~25 lines)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={isDark ? 'text-white' : 'text-slate-900'}>•</span>
                  <span>Any style you choose: Sonnet, Free Verse, Acrostic, Custom</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={isDark ? 'text-white' : 'text-slate-900'}>•</span>
                  <span>Full customization: tone, dedication, theme</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Based on your pay you can request for short delivery time</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="font-semibold">Request 2 poems, get 1 extra free</span>
                </li>
              </ul>

              <button className={`w-full py-3 rounded-lg font-semibold transition-all ${
                isDark
                  ? 'bg-white text-black hover:bg-slate-100'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Book Custom Poem
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sample Poems Section */}
      <section id="samples" className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Sample Works
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
            style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              A glimpse into the craft I offer
            </p>
          </motion.div>

          <div className="space-y-8">
            {SAMPLE_POEMS.map((poem, index) => (
              <motion.article
                key={poem.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl p-8 border ${
                  isDark 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {poem.title}
                  </h3>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-600'
                  }`}
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                  >
                    {poem.type}
                  </span>
                </div>
                <p className={`text-lg leading-relaxed whitespace-pre-line ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {poem.content}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`relative py-24 px-6 border-t ${
        isDark ? 'border-white/10' : 'border-slate-200'
      }`}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`rounded-xl p-12 border ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <User className={`w-6 h-6 ${isDark ? 'text-white' : 'text-slate-900'}`} />
              <h2 className={`text-3xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                About Appoet
              </h2>
            </div>
            
            <div className={`space-y-4 text-lg leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
            style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              <p>
                Appoet was created to offer something increasingly rare in this age: words written by a real person, 
                for a real person, with genuine care and attention.
              </p>
              
              <p>
                In a world saturated with AI-generated content, this platform exists as a quiet resistance — a 
                commitment to the craft of poetry, to the weight of carefully chosen words, and to the 
                human connection that only authentic writing can create.
              </p>
              
              <p>
                Every poem commissioned through Appoet is written by me, a poet who believes in the power 
                of language to capture moments, express what feels inexpressible, and offer comfort or 
                celebration exactly when it is needed. But if you support me generously I will add more writers
                or if want to partner so that you can write for others as well please contact me.
              </p>
              
              <p className="pt-4 border-t border-current/20">
                <span className="font-semibold">My promise:</span> No shortcuts. No templates. 
                No artificial intelligence. Just thoughtful messy poetry, crafted for you, to you.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative py-12 px-6 border-t ${
        isDark ? 'border-white/10' : 'border-slate-200'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`text-sm ${
              isDark ? 'text-slate-500' : 'text-slate-600'
            }`}
            style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              © 2026 Appoet. Every poem written by hand, with heart to a soul.
            </p>
            <div className="flex gap-6">
              <a 
                href="#" 
                className={`text-sm transition-colors ${
                  isDark ? 'text-slate-500 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Privacy
              </a>
              <a 
                href="#" 
                className={`text-sm transition-colors ${
                  isDark ? 'text-slate-500 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Terms
              </a>
              <a 
                href="#" 
                className={`text-sm transition-colors ${
                  isDark ? 'text-slate-500 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}