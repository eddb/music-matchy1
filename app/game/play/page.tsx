'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Song {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  video_id: string;
}

interface Staff {
  id: string;
  name: string;
  songs: Song[];
}

export default function GamePlay() {
  const searchParams = useSearchParams();
  const playerName = searchParams.get('player');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [score, setScore] = useState(100);
  const [currentRound, setCurrentRound] = useState(0);
  const [availableStaff, setAvailableStaff] = useState<Staff[]>([]);
  const [currentSongs, setCurrentSongs] = useState<Song[]>([]);
  const [nameOptions, setNameOptions] = useState<string[]>([]);
  const [correctStaff, setCorrectStaff] = useState<Staff | null>(null);
  const [gameOver, setGameOver] = useState(false);

  // Load game data
  useEffect(() => {
    const loadGameData = async () => {
      try {
        const response = await fetch('/api/game-data');
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error);
        }

        setAvailableStaff(data.staff.filter((s: Staff) => s.name !== playerName));
        setupNextRound(data.staff.filter((s: Staff) => s.name !== playerName));
      } catch (err) {
        setError('Failed to load game data');
      } finally {
        setLoading(false);
      }
    };

    if (playerName) {
      loadGameData();
    }
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
  };

  const handleGuess = (guessedName: string) => {
    if (!correctStaff) return;

    if (guessedName === correctStaff.name) {
      // Correct guess
      setCurrentRound(prev => prev + 1);
      setAvailableStaff(prev => prev.filter(s => s.id !== correctStaff.id));
      setupNextRound(availableStaff.filter(s => s.id !== correctStaff.id));
    } else {
      // Wrong guess - deduct points
      setScore(prev => Math.max(0, prev - 10));
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading game...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (gameOver) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
        <p className="text-xl mb-6">Final Score: {score}</p>
        <button
          onClick={() => window.location.href = '/game'}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold">Score: {score}</p>
          <p className="text-sm text-gray-600">Round: {currentRound + 1}</p>
        </div>
        <p className="text-sm text-gray-600">Playing as: {playerName}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Whose songs are these?</h2>
        
        <div className="space-y-4 mb-6">
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

        <div className="grid grid-cols-2 gap-4">
          {nameOptions.map((name, index) => (
            <button
              key={index}
              onClick={() => handleGuess(name)}
              className="p-4 text-lg bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
