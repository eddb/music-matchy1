'use client';

import React, { useState } from 'react';

export default function SongSubmissionForm() {
  const [name, setName] = useState('');
  const [songs, setSongs] = useState(['', '', '', '', '']);

  const handleSongChange = (index: number, value: string) => {
    const newSongs = [...songs];
    newSongs[index] = value;
    setSongs(newSongs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', { name, songs });
    alert('Form submitted! Check console for details.');
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Submit Songs
        </button>
      </form>
    </div>
  );
}
