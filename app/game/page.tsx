'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GamePage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');

  const handleStartGame = () => {
    if (playerName) {
      router.push(`/game/play?player=${encodeURIComponent(playerName)}`);
    }
  };

  return (
    <main className="min-h-screen p-8" style={{ backgroundColor: '#d2c8c4' }}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-lg">

          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center font-tech">Match the songs to the person</h2>
            <h3 className="text-lg font-tech mb-4">How Scoring Works:</h3>
            <div className="space-y-2 font-tech text-gray-700">
              <p>🎯 +20 points for each correct guess</p>
              <p>🔥 Streak Bonuses:</p>
              <ul className="list-disc pl-8 space-y-1">
                <li>2 correct in a row: +10 bonus points</li>
                <li>3 correct in a row: +20 bonus points</li>
                <li>4+ correct in a row: +30 bonus points</li>
              </ul>
              <p>❌ -5 points for incorrect guesses</p>
            </div>
          </div>

          <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6 text-center font-tech">Enter Your Name to Play</h2>
            <div>
              <label className="block text-sm font-tech mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border font-tech bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your name"
              />
            </div>

            <p className="text-sm text-gray-600 font-tech italic">
              Note: Use the same name you used when submitting your songs
            </p>

            <button
              onClick={handleStartGame}
              disabled={!playerName.trim()}
              className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white py-4 rounded-lg font-tech text-lg transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 transform"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
