'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Feather, Clock, Sparkles, User, Heart } from 'lucide-react';

interface Tier {
  id: string;
  name: string;
  description: string;
  poemCount: number;
  price: number;
  bonusPoems: number;
  deliveryHours: number;
}

interface SamplePoem {
  id: string;
  title: string;
  content: string;
  poemType: string;
}

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [samples, setSamples] = useState<SamplePoem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tiersRes, samplesRes] = await Promise.all([
          fetch('/api/tiers'),
          fetch('/api/samples'),
        ]);

        const tiersData = await tiersRes.json();
        const samplesData = await samplesRes.json();

        setTiers(tiersData);
        setSamples(samplesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatPoemType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

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

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-6xl md:text-7xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Appoet
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
              Commission poetry written with care, delivered with meaning.
            </motion.p>

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
              No AI. No algorithms. Just authentic words.
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
              Honest Pricing
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
            style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Simple tiers for different needs
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <p className={isDark ? 'text-white' : 'text-slate-900'}>Loading pricing...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {tiers.map((tier, index) => {
                const isPopular = tier.name === 'Custom Poem';
                const totalPoems = tier.poemCount + tier.bonusPoems;
                
                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`rounded-xl p-8 transition-all ${
                      isPopular
                        ? isDark 
                          ? 'bg-white/5 border-2 border-white/30 hover:border-white/50' 
                          : 'bg-slate-50 border-2 border-slate-900 hover:border-slate-700 shadow-md hover:shadow-lg'
                        : isDark 
                          ? 'bg-white/5 border border-white/10 hover:border-white/20' 
                          : 'bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {tier.name === 'Quick Poem' ? (
                          <Sparkles className={`w-5 h-5 ${isDark ? 'text-white' : 'text-slate-900'}`} />
                        ) : (
                          <Feather className={`w-5 h-5 ${isDark ? 'text-white' : 'text-slate-900'}`} />
                        )}
                        <h3 className={`text-2xl font-bold ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {tier.name}
                        </h3>
                      </div>
                      {isPopular && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          isDark ? 'bg-white/10 text-white' : 'bg-slate-900 text-white'
                        }`}
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                        >
                          POPULAR
                        </span>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <span className={`text-5xl font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>${tier.price.toFixed(2)}</span>
                      {tier.name === 'Custom Poem' && (
                        <span className={`text-lg ml-2 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                        >
                          starting
                        </span>
                      )}
                    </div>

                    <p className={`text-sm mb-6 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      {tier.description}
                    </p>

                    <ul className={`space-y-3 mb-8 text-sm ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      <li className="flex items-start gap-2">
                        <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{tier.deliveryHours}-hour delivery</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="font-semibold">
                          Request {tier.poemCount} poems, get {tier.bonusPoems} extra free ({totalPoems} total)
                        </span>
                      </li>
                    </ul>

                    <button className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      isPopular
                        ? isDark
                          ? 'bg-white text-black hover:bg-slate-100'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                        : isDark
                          ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      Choose {tier.name}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
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
              A glimpse into the craft
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <p className={isDark ? 'text-white' : 'text-slate-900'}>Loading samples...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {samples.map((poem, index) => (
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
                      {formatPoemType(poem.poemType)}
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
          )}
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
                Appoet was created to offer something increasingly rare: words written by a real person, 
                for a real person, with genuine care and attention.
              </p>
              
              <p>
                In a world saturated with AI-generated content, this platform exists as a quiet resistance—a 
                commitment to the craft of poetry, to the weight of carefully chosen words, and to the 
                human connection that only authentic writing can create.
              </p>
              
              <p>
                Every poem commissioned through Appoet is written by me, a poet who believes in the power 
                of language to capture moments, express what feels inexpressible, and offer comfort or 
                celebration exactly when it is needed.
              </p>
              
              <p className="pt-4 border-t border-current/20">
                <span className="font-semibold">My promise:</span> No shortcuts. No templates. 
                No artificial intelligence. Just thoughtful poetry, crafted for you.
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
              © 2026 Appoet. Every poem written by hand, with heart.
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