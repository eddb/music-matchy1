'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Song {
  title: string;
  url: string;
  video_id: string;
}

interface StaffMember {
  name: string;
  songs: Song[];
}

export default function FinalPage() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAllSubmissions = async () => {
      try {
        const { data, error } = await supabase
          .from('staff')
          .select(`
            name,
            songs (
              title,
              url,
              video_id
            )
          `)
          .order('name');

        if (error) throw error;
        setStaffMembers(data || []);
      } catch (err) {
        console.error('Error loading submissions:', err);
        setError('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };

    loadAllSubmissions();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen p-8" style={{ backgroundColor: '#d2c8c4' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-tech text-lg">Loading submissions...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8" style={{ backgroundColor: '#d2c8c4' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-tech text-lg text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8" style={{ backgroundColor: '#d2c8c4' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 font-tech">
          All Submissions
        </h1>

        <div className="space-y-8">
          {staffMembers.map((staff, index) => (
            <div 
              key={index} 
              className="bg-white/90 backdrop-blur-sm rounded-lg p-6"
            >
              <h2 className="text-2xl font-tech mb-4">{staff.name}</h2>
              <div className="grid gap-4">
                {staff.songs.map((song, songIndex) => (
                  <div 
                    key={songIndex} 
                    className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
                  >
                    <span className="font-tech text-gray-500 w-6">
                      {songIndex + 1}.
                    </span>
                    <div className="flex-1">
                      <p className="font-tech">{song.title}</p>
                      <a 
                        href={song.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline font-tech"
                      >
                        Listen on YouTube
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/"
            className="inline-block text-blue-600 hover:underline font-tech"
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
