'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function SuccessPage() {
  const [songs, setSongs] = useState([]);

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
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl text-center mb-4 font-cherry">
          GUESSIC
        </h1>
        <p className="text-xl text-center mb-12 font-departure">
          the music matching game
        </p>

        <div className="space-y-6">
          {songs.map((song, index) => (
            <div key={index} className="relative h-64 rounded-lg overflow-hidden group">
              <img 
                src={song.thumbnail}
                alt={song.title}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <h3 className="text-white text-2xl font-departure text-center px-4">
                  {song.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-4">
          <button
            onClick={shareGame}
            className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white py-4 px-8 rounded-lg font-departure text-lg hover:opacity-90 transition-opacity"
          >
            Share Game with Others
          </button>
        </div>
      </div>
    </main>
  );
}
