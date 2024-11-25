'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

interface Score {
  name: string;
  score: number;
  played_at: string;
}

export default function AdminScores() {
  const [scores, setScores] = useState<Score[]>([]);
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    loadScores();
    loadUsers();
  }, []);

  const loadScores = async () => {
    const { data } = await supabase
      .from('game_scores')
      .select('*')
      .order('score', { ascending: false });
    
    if (data) setScores(data);
  };

  const loadUsers = async () => {
    const { data } = await supabase
      .from('staff')
      .select('name')
      .order('name');
    
    if (data) setUsers(data.map(u => u.name));
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">High Scores</h1>
        
        <div className="bg-white/90 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Top Scores</h2>
          <div className="space-y-2">
            {scores.map((score, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-tech">{score.name}</span>
                <span className="font-bold">{score.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/90 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">All Users</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {users.map((user, i) => (
              <Link
                key={i}
                href={`/admin/user/${encodeURIComponent(user)}`}
                className="p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                {user}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
