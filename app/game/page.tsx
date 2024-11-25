'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GamePage() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
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
          <h2 className="text-2xl font-bold mb-6 text-center font-tech">Enter Your Name to Play</h2>
          
          <div className="space-y-6">
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
