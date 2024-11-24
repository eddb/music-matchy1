'use client';

import { useEffect, useState } from 'react';
import SongSubmissionForm from '../components/songsubmissionform';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen pt-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-7xl mb-4 tracking-wide text-white drop-shadow-lg">
            GUESSIC
          </h1>
          <p className="text-xl font-departure text-white/90">
            the music matching game
          </p>
        </div>

        <div 
          className={`transform transition-all duration-1000 ease-out ${
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
