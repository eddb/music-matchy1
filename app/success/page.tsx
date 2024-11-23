'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../supabaseClient';

interface Song {
  title: string;
  thumbnail: string;
  url: string;
}

export default function SuccessPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    };

    getLatestSubmission();
  }, []);

  const shareGame = () => {
    const shareText = "Join our Music Matching Game! Think you know your colleagues' music taste? Test yourself here: ";
    const url = window.location.origin;
    
    if (navigator.share) {
      navigator.share({
        title: 'Music Matching Game',
        text: shareText,
        url: url
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText + url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto p-6">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Thanks for submitting your songs!
        </h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your submitted tracks:</h2>
          <div className="space-y-4">
            {songs.map((song, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <img 
                  src={song.thumbnail} 
                  alt={song.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{song.title}</p>
                  <a 
                    href={song.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Listen on YouTube
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={shareGame}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            <span>Share Game with Others</span>
          </button>

          <Link
            href="/game"
            className="block w-full bg-gray-100 py-3 px-4 rounded-lg text-center hover:bg-gray-200 transition-colors"
          >
            Play Game
          </Link>
        </div>
      </div>
    </main>
  );
}
