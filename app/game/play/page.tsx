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
  const [timeBonus, setTimeBonus] = useState(50); // Starting time bonus
  const [currentRound, setCurrentRound] = useState(0);
  const [availableStaff, setAvailableStaff] = useState<Staff[]>([]);
  const [currentSongs, setCurrentSongs] = useState<Song[]>([]);
  const [nameOptions, setNameOptions] = useState<string[]>([]);
  const [correctStaff, setCorrectStaff] = useState<Staff | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{message: string, isCorrect: boolean} | null>(null);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [roundStartTime, setRoundStartTime] = useState<Date | null>(null);

  useEffect(() => {
    const loadGameData = async () => {
      try {
        if (!playerName) {
          throw new Error('Please start the game from the main game page');
        }

        const { data, error } = await supabase
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
        if (!data) throw new Error('No data returned');

        const validStaff = data
          .filter(s => s.name.toLowerCase() !== playerName.toLowerCase())
          .filter(s => s.songs && s.songs.length === 5);

        if (validStaff.length < 4) {
          throw new Error(`Need at least 4 other players with songs. Currently have ${validStaff.length}`);
        }

        setAvailableStaff(validStaff);
        setupNextRound(validStaff);
      } catch (err) {
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

    // Reset round timer
    setRoundStartTime(new Date());
    setTimeBonus(50);

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

    // Start time bonus countdown
    const timer = setInterval(() => {
      setTimeBonus(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  };

  const calculateRoundScore = (isCorrect: boolean) => {
    if (!isCorrect) return -10;
    
    // Base score for correct answer
    let roundScore = 20;

    // Add time bonus
    roundScore += timeBonus;

    // Add streak bonus
    if (consecutiveCorrect > 0) {
      roundScore += Math.min(consecutiveCorrect * 5, 25);
    }

    return roundScore;
  };

  const handleGuess = async (guessedName: string) => {
    if (!correctStaff) return;

    const isCorrect = guessedName === correctStaff.name;
    const roundScore = calculateRoundScore(isCorrect);

    if (isCorrect) {
      setConsecutiveCorrect(prev => prev + 1);
      setFeedback({ 
        message: `Correct! +${roundScore} points${consecutiveCorrect > 0 ? ` (${consecutiveCorrect + 1}x streak!)` : ''}`, 
        isCorrect: true 
      });
      setScore(prev => prev + roundScore);
      setCurrentRound(prev => prev + 1);
      
      const updatedStaff = availableStaff.filter(s => s.id !== correctStaff.id);
      setAvailableStaff(updatedStaff);
      
      setTimeout(() => {
        setupNextRound(updatedStaff);
      }, 1500);
    } else {
      setConsecutiveCorrect(0);
      setFeedback({ 
        message: `Wrong guess! ${roundScore} points`, 
        isCorrect: false 
      });
      setScore(prev => Math.max(0, prev + roundScore));
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
          <div className="space-y-4 mb-8">
            <p className="text-2xl">Final Score: {score}</p>
            <p className="text-lg">Rounds Played: {currentRound}</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/game'}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Play Again
            </button>
            <a 
              href="/admin/scores"
              className="block mt-4 text-blue-600 hover:underline"
            >
              View Leaderboard
            </a>
          </div>
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
            <p className="text-sm text-gray-600">Time Bonus: +{timeBonus}</p>
            {consecutiveCorrect > 0 && (
              <p className="text-sm text-green-600">Streak: {consecutiveCorrect}x</p>
            )}
          </div>
          <p className="text-sm text-gray-600">Playing as: {playerName}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Whose playlist is this?</h2>
          
          {/* Songs Display */}
          <div className="space-y-4 mb-8">
            {currentSongs.map((song, index) => (
              <div key={index} className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="relative aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${song.video_id}`}
                    className="absolute inset-0 w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div>
                  <p className="font-medium">{song.title}</p>
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
