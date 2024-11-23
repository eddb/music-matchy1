

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

// Add debug logs
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase client initialized:', !!supabase);

interface Song {
  title: string;
  thumbnail: string;
  url: string;
}

interface Staff {
  id: string;
  name: string;
  songs: Song[];
}

export default function GamePlay() {
  console.log('Component mounting...');
  const searchParams = useSearchParams();
  const playerName = searchParams.get('player');
  console.log('Player name:', playerName);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [score, setScore] = useState(100);
  const [currentRound, setCurrentRound] = useState(0);
  const [availableStaff, setAvailableStaff] = useState<Staff[]>([]);
  const [currentSongs, setCurrentSongs] = useState<Song[]>([]);
  const [nameOptions, setNameOptions] = useState<string[]>([]);
  const [correctStaff, setCorrectStaff] = useState<Staff | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{message: string, isCorrect: boolean} | null>(null);

  useEffect(() => {
    const loadGameData = async () => {
      try {
        if (!playerName) {
          throw new Error('Please start the game from the main game page');
        }

        console.log('Loading data for player:', playerName);

        // First, get all staff with their songs
        const { data, error } = await supabase
          .from('staff')
          .select(`
            id,
            name,
            songs (
              title,
              thumbnail,
              url
            )
          `);

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (!data) {
          throw new Error('No data returned from database');
        }

        console.log('Total staff loaded:', data.length);

        // Filter out the current player and any staff without 5 songs
        const validStaff = data
          .filter(s => s.name.toLowerCase() !== playerName.toLowerCase())
          .filter(s => s.songs && s.songs.length === 5);

        console.log('Valid staff (with 5 songs):', validStaff.length);

        if (validStaff.length === 0) {
          throw new Error('No other staff members have submitted 5 songs yet');
        }

        if (validStaff.length < 4) {
          throw new Error(`Need at least 4 other players with 5 songs each. Currently have ${validStaff.length}`);
        }

        setAvailableStaff(validStaff);
        setupNextRound(validStaff);
      } catch (err) {
        console.error('Game load error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load game data');
      } finally {
        setLoading(false);
      }
    };

    loadGameData();
  }, [playerName]);

  const setupNextRound = (staff: Staff[]) => {
    if (staff.length === 0) {
      setGameOver(true);
      return;
    }

    // Pick random staff member
    const randomIndex = Math.floor(Math.random() * staff.length);
    const selectedStaff = staff[randomIndex];
    setCorrectStaff(selectedStaff);
    setCurrentSongs(selectedStaff.songs);

    // Create name options (1 correct + 3 random)
    const otherStaff = staff.filter(s => s.id !== selectedStaff.id);
    const randomOthers = otherStaff
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(s => s.name);
    
    setNameOptions([selectedStaff.name, ...randomOthers].sort(() => 0.5 - Math.random()));
    setFeedback(null);
  };

  const handleGuess = async (guessedName: string) => {
    if (!correctStaff) return;

    if (guessedName === correctStaff.name) {
      // Correct guess
      setFeedback({ message: 'Correct! Well done!', isCorrect: true });
      setCurrentRound(prev => prev + 1);
      
      // Remove this staff member from available pool
      const updatedStaff = availableStaff.filter(s => s.id !== correctStaff.id);
      setAvailableStaff(updatedStaff);
      
      // Short delay before next round
      setTimeout(() => {
        setupNextRound(updatedStaff);
      }, 1500);
    } else {
      // Wrong guess
      setFeedback({ message: 'Wrong guess! Try again!', isCorrect: false });
      setScore(prev => Math.max(0, prev - 10));
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          Loading game...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Game</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <a 
            href="/game"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Game Start
          </a>
        </div>
      </main>
    );
  }

  if (gameOver) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
          <p className="text-xl mb-6">Final Score: {score}</p>
          <button
            onClick={() => window.location.href = '/game'}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Play Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">Score: {score}</p>
            <p className="text-sm text-gray-600">Round: {currentRound + 1}</p>
          </div>
          <p className="text-sm text-gray-600">Playing as: {playerName}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Whose playlist is this?</h2>
          
          {/* Songs Display */}
          <div className="space-y-4 mb-8">
            {currentSongs.map((song, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-20 h-20 object-cover rounded"
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

          {/* Feedback Message */}
          {feedback && (
            <div className={`p-4 mb-4 rounded-md text-center ${
              feedback.isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {feedback.message}
            </div>
          )}

          {/* Name Options */}
          <div className="grid grid-cols-2 gap-4">
            {nameOptions.map((name, index) => (
              <button
                key={index}
                onClick={() => handleGuess(name)}
                className="p-4 text-lg bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={!!feedback?.isCorrect}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
