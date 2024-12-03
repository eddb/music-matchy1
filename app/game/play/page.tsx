'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

interface Song {
  title: string;
  thumbnail: string;
  url: string;
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
  const [streak, setStreak] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
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

    // Get all staff and their songs
    const { data: allStaff, error } = await supabase
      .from('staff')
      .select(`
        id,
        name,
        songs (
          title,
          thumbnail,
          url,
          video_id
        )
      `);

    if (error) throw error;
    if (!allStaff) throw new Error('No data returned');

    // Filter out current player and ensure 5 songs
    const validStaff = allStaff
      .filter(s => s.name.toLowerCase() !== playerName.toLowerCase())
      .filter(s => s.songs && s.songs.length === 5);

    // Randomly select 10 staff members for this game
    const tenRandomStaff = [...validStaff]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    console.log(`Selected ${tenRandomStaff.length} random staff members for the game`);
    setAvailableStaff(tenRandomStaff);
    setupNextRound(tenRandomStaff);

  } catch (err) {
    console.error('Game load error:', err);
    setError(err instanceof Error ? err.message : 'Failed to load game');
  } finally {
    setLoading(false);
  }
};

    loadGameData();
  }, [playerName]);

  const setupNextRound = (staff: Staff[]) => {
    if (staff.length === 0) {
      finishGame();
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
    setWrongGuesses([]); // Reset wrong guesses for next round
    setStreak(prev => prev + 1);
    let roundScore = 20;
    if (streak > 0) {
      const streakBonus = Math.min(streak * 10, 30);
      roundScore += streakBonus;
    }
    setScore(prev => prev + roundScore);
    setFeedback({ 
      message: streak > 0 
        ? `Correct! +${roundScore} points (${streak + 1}x streak!)` 
        : `Correct! +${roundScore} points`, 
      isCorrect: true 
    });
    setCurrentRound(prev => prev + 1);
    const updatedStaff = availableStaff.filter(s => s.id !== correctStaff.id);
    setAvailableStaff(updatedStaff);
    setTimeout(() => {
      setupNextRound(updatedStaff);
    }, 1500);
  } else {
    // Wrong guess
    setWrongGuesses(prev => [...prev, guessedName]);
    setStreak(0);
    const penalty = 5;
    setScore(prev => Math.max(0, prev - penalty));
    setFeedback({ 
      message: `Wrong guess! -${penalty} points`, 
      isCorrect: false 
    });
  }
};

  const finishGame = async () => {
    setGameOver(true);
    
    // Save score to Supabase
    try {
      await supabase.from('game_scores').insert({
        player_name: playerName,
        score: score,
        rounds_played: currentRound
      });
    } catch (err) {
      console.error('Failed to save score:', err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8" style={{ backgroundColor: '#d2c8c4' }}>
        <div className="max-w-2xl mx-auto text-center font-tech">
          Loading game...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8" style={{ backgroundColor: '#d2c8c4' }}>
        <div className="max-w-2xl mx-auto p-6 bg-white/90 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-4 font-tech">Error Loading Game</h2>
          <p className="text-gray-700 mb-6 font-tech">{error}</p>
          <a 
            href="/game"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-tech"
          >
            Back to Game Start
          </a>
        </div>
      </main>
    );
  }

  if (gameOver) {
    return (
      <main className="min-h-screen p-8" style={{ backgroundColor: '#d2c8c4' }}>
        <div className="max-w-2xl mx-auto p-6 bg-white/90 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-4 font-tech">Game Over!</h2>
          <div className="space-y-4 mb-8">
            <p className="text-2xl font-tech">Final Score: {score}</p>
            <p className="text-lg font-tech">Rounds Played: {currentRound}</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/game'}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-tech"
            >
              Play Again
            </button>
            <a 
              href="/admin/scores"
              className="block mt-4 text-blue-600 hover:underline font-tech"
            >
              View Leaderboard
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8" style={{ backgroundColor: '#d2c8c4' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-lg font-semibold font-tech">Score: {score}</p>
            <p className="text-sm text-gray-600 font-tech">Round: {currentRound + 1}</p>
            {streak > 1 && (
              <p className="text-sm text-green-600 font-tech">
              Streak: {streak}x
              </p>
            )}
        </div>
        <p className="text-sm text-gray-600 font-tech">Playing as: {playerName}</p>
    </div>

        <div className="flex gap-8">
          {/* Songs List - Left Side */}
          <div className="flex-grow">
            <h2 className="text-xl font-bold mb-6 font-tech">Whose playlist is this?</h2>
            <div className="space-y-4">
              {currentSongs.map((song, index) => (
                <div key={index} className="flex flex-col gap-4 p-4 bg-white/90 backdrop-blur-sm rounded-lg">
                  <div className="relative aspect-video w-full">
                    <iframe
                      src={`https://www.youtube.com/embed/${song.video_id}`}
                      className="absolute inset-0 w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div>
                    <p className="font-tech">{song.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Names Panel - Right Side */}
          <div className="w-72 sticky top-8 h-fit">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6">
              {feedback && (
                <div className={`p-4 mb-4 rounded-md text-center font-tech ${
                  feedback.isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {feedback.message}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {nameOptions.map((name, index) => (
                  <button
                    key={index}
                    onClick={() => handleGuess(name)}
                    className={`p-4 text-lg rounded-lg transition-colors font-tech
                      ${wrongGuesses.includes(name) 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-gray-100 hover:bg-gray-200'} 
                      ${!!feedback?.isCorrect ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    disabled={!!feedback?.isCorrect}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
