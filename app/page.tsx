'use client';

import { useEffect, useState } from 'react';
import SongSubmissionForm from '@/components/songsubmissionform';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-12 relative overflow-hidden">
      {/* Background image with GUESSIC title */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src="/guessic-bg.jpg" 
          alt="GUESSIC" 
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-6xl md:text-8xl mb-4 font-cherry tracking-wider">
          GUESSIC
        </h1>
        <p className="text-xl mb-12 font-departure">
          the music matching game
        </p>

        <div 
          className={`transform transition-all duration-1000 ${
            isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-10 opacity-0'
          }`}
        >
          <SongSubmissionForm />
        </div>
      </div>
    </main>
  );
}
