'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SongSubmissionForm() {
  const [name, setName] = useState('');
  const [songs, setSongs] = useState<Array<string>>(['', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Extract video ID from YouTube URL
  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Update song at specific index
  const handleSongChange = (index: number, value: string) => {
    const newSongs = [...songs];
    newSongs[index] = value;
    setSongs(newSongs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Basic validation
      if (!name.trim()) {
        throw new Error('Please enter your name');
      }

      // Validate all songs are YouTube URLs
      for (const song of songs) {
        if (!getYoutubeVideoId(song)) {
          throw new Error('Please enter valid YouTube URLs for all songs');
        }
      }

      // For now, just console log
      console.log('Submitted:', { name, songs });
      
      // Clear form
      setName('');
      setSongs(['', '', '', '', '']);
      
      // TODO: Add actual submission logic

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter your name"
            required
          />
        </div>

        {songs.map((song, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Song {index + 1}
            </label>
            <input
              type="url"
              value={song}
              onChange={(e) => handleSongChange(index, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter YouTube URL"
              required
            />
          </div>
        ))}

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
          {loading ? 'Submitting...' : 'Submit Songs'}
        </button>
      </form>
    </div>
  );
}
