'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export default function SongSubmissionForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [songs, setSongs] = useState<string[]>(['', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getYoutubeVideoId = (url: string) => {
    try {
      // Handle youtu.be URLs
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1].split(/[#?&]/)[0];
        return id.length === 11 ? id : null;
      }
      
      // Handle youtube.com URLs
      if (url.includes('youtube.com/')) {
        const searchParams = new URL(url).searchParams;
        const id = searchParams.get('v');
        return id?.length === 11 ? id : null;
      }

      return null;
    } catch {
      return null;
    }
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
      if (!name.trim()) {
        throw new Error('Please enter your name');
      }

      // Validate all songs have valid YouTube URLs
      const videoIds = songs.map(url => getYoutubeVideoId(url));
      if (videoIds.some(id => !id)) {
        throw new Error('Please enter valid YouTube URLs for all songs');
      }

      // Get YouTube video details
      const youtubePromises = videoIds.map(async (videoId) => {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        const video = data.items[0];
        return {
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.high.url
        };
      });

      const videoDetails = await Promise.all(youtubePromises);

      // Insert staff member
      const { data: staff, error: staffError } = await supabase
        .from('staff')
        .insert({ name })
        .select()
        .single();

      if (staffError) {
        throw new Error(staffError.message);
      }

      // Insert songs with YouTube details
      const songsData = songs.map((url, index) => ({
        staff_id: staff.id,
        url,
        title: videoDetails[index].title,
        thumbnail: videoDetails[index].thumbnail,
        video_id: videoIds[index]
      }));

      const { error: songsError } = await supabase
        .from('songs')
        .insert(songsData);

      if (songsError) {
        throw new Error(songsError.message);
      }

      // Redirect to success page
      router.push('/success');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-tech text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border font-departure bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter your name"
            required
          /><p></p>
        </div>

        {songs.map((song, index) => (
          <div key={index}>
            <label className="block font-tech text-gray-700 mb-2">
              Song {index + 1}
            </label>
            <input
              type="url"
              value={song}
              onChange={(e) => handleSongChange(index, e.target.value)}
              className="w-full px-4 py-3 rounded-lg border font-departure bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter YouTube URL"
              required
            />
          </div>
        ))}

        {error && (
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 font-tech">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white py-4 rounded-lg font-tech text-lg transition-all hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 transform"
        >
          {loading ? 'Submitting...' : 'Submit Songs'}
        </button>
      </form>
    </div>
  );
}
