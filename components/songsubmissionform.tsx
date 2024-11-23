'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SongSubmissionForm() {
  const [name, setName] = useState('');
  const [songs, setSongs] = useState(['', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

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
      // Validate inputs
      if (!name.trim()) {
        throw new Error('Please enter your name');
      }

      const invalidSongs = songs.some(url => !getYoutubeVideoId(url));
      if (invalidSongs) {
        throw new Error('Please enter valid YouTube URLs for all songs');
      }

      // Insert staff member
      const { data: staff, error: staffError } = await supabase
        .from('staff')
        .insert({ name })
        .select()
        .single();

      if (staffError) {
        throw new Error(staffError.message);
      }

      // Insert songs
      const songsData = songs.map(url => ({
        staff_id: staff.id,
        url,
        title: 'Temporary Title', // We'll update this with YouTube API later
        thumbnail: 'https://via.placeholder.com/120', // Temporary
        video_id: getYoutubeVideoId(url)!
      }));

      const { error: songsError } = await supabase
        .from('songs')
        .insert(songsData);

      if (songsError) {
        throw new Error(songsError.message);
      }

      // Clear form
      setName('');
      setSongs(['', '', '', '', '']);
      alert('Songs submitted successfully!');

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
