'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

interface Score {
  id: number;
  player_name: string;
  score: number;
  rounds_played: number;
  played_at: string;
}

interface Player {
  name: string;
  hasPlayed: boolean;
}

export default function AdminScores() {
  const [scores, setScores] = useState<Score[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get all scores
      const { data: scoreData, error: scoreError } = await supabase
        .from('game_scores')
        .select('*')
        .order('score', { ascending: false });

      if (scoreError) throw scoreError;
      setScores(scoreData || []);

      // Get all staff members
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('name')
        .order('name');

      if (staffError) throw staffError;

      // Create players array with played status
      const playersWithStatus = staffData?.map(staff => ({
        name: staff.name,
        hasPlayed: scoreData?.some(score => score.player_name === staff.name) || false
      })) || [];

      setPlayers(playersWithStatus);

    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          Loading scores...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white text-center">Game Scores</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Leaderboard */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Top Scores</h2>
            {scores.length === 0 ? (
              <p className="text-gray-500">No scores yet</p>
            ) : (
              <div className="space-y-2">
                {scores.map((score) => (
                  <div 
                    key={score.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{score.player_name}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(score.played_at).toLocaleDateString()} - {score.rounds_played} rounds
                      </span>
                    </div>
                    <span className="text-lg font-bold">{score.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Player List */}
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Players</h2>
            {players.length === 0 ? (
              <p className="text-gray-500">No players yet</p>
            ) : (
              <div className="space-y-2">
                {players.map((player) => (
                  <Link 
                    key={player.name}
                    href={`/admin/player/${encodeURIComponent(player.name)}`}
                    className={`block p-3 rounded-lg transition-colors ${
                      player.hasPlayed 
                        ? 'bg-green-100 hover:bg-green-200' 
                        : 'bg-red-100 hover:bg-red-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{player.name}</span>
                      <span className="text-sm">
                        {player.hasPlayed ? '✓ Played' : '✗ Not played'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="text-white/80 hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
