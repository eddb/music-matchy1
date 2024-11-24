'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

interface Song {
  title: string;
  thumbnail: string;
  url: string;
}

export default function SuccessPage() {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const getLatestSubmission = async () => {
      const { data } = await supabase
        .from('songs')
        .select('title, thumbnail, url')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (data) {
        setSongs(data);
      }
    };

    getLatestSubmission();
  }, []);

  const shareGame = () => {
    const shareText = "Join our Music Matching Game! Think you know your colleagues' music taste? Test yourself here: ";
    const url = window.location.origin;
    
    if (navigator.share) {
      navigator.share({
        title: 'GUESSIC',
        text: shareText,
        url: url
      });
    } else {
      navigator.clipboard.writeText(shareText + url);
      alert('Link copied to clipboard!');
    }
  };

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

<div className="mt-12 mb-20 space-y-4">
          <button
            onClick={shareGame}
            className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white py-4 rounded-xl font-tech text-lg transition-all hover:opacity-90 hover:scale-[1.02] transform"
          >
            Share Game with Others
          </button>
          
          <Link
            href="/game"
            className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-tech text-lg text-center transition-all hover:opacity-90 hover:scale-[1.02] transform"
          >
            Play Game
          </Link>
        </div>

        
        <div className="space-y-8">
          {songs.map((song, index) => (
            <div 
              key={index} 
              className="relative h-80 rounded-xl overflow-hidden group transform transition-all duration-500 hover:scale-[1.02]"
            >
              <img 
                src={song.thumbnail}
                alt={song.title}
                className="w-full h-full object-cover scale-105"
              />
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm group-hover:bg-black/40 transition-all">
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-3xl font-departure text-white text-center px-6 transform transition-all group-hover:scale-105">
                    {song.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </main>
  );
}
