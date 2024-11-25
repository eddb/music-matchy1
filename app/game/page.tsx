'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function GameEntryPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if user has submitted songs
      const { data, error: dbError } = await supabase
        .from('staff')
        .select('id')
        .ilike('name', name)
        .single();

      if (dbError || !data) {
        throw new Error('Please submit your songs first before playing the game');
      }

      // Redirect to game
      router.push(`/game/play?player=${encodeURIComponent(name)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8" style={{ backgroundColor: '#d2c8c4' }}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Ready to Play?
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-tech text-black-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 font-tech"
                placeholder="Enter your name"
                required
              />
              <p className="block font-tech text-gray-500">
                Enter the same name you used when submitting songs
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Start Game'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
