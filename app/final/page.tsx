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

function VideoThumbnail({ videoId, title }: { videoId: string; title: string }) {
  const [showVideo, setShowVideo] = useState(false);

  if (showVideo) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <div 
      onClick={() => setShowVideo(true)}
      className="cursor-pointer relative group"
    >
      <img
        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
        alt={title}
        className="w-full h-full object-cover rounded-lg"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all">
        <div className="bg-red-600 text-white p-3 rounded-full opacity-80 group-hover:opacity-100">
          ▶
        </div>
      </div>
    </div>
  );
}

export default function FinalPage() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadSubmissions = async () => {
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
          .order('name')
          .range(page * itemsPerPage, (page + 1) * itemsPerPage - 1);

        if (error) throw error;
        setStaffMembers(data || []);
      } catch (err) {
        setError('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, [page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 0) {
    return (
      <main className="min-h-screen p-8" style={{ backgroundColor: '#d2c8c4' }}>
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-tech text-lg">Loading submissions...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8" style={{ backgroundColor: '#d2c8c4' }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 font-tech">
          All Submissions
        </h1>

        <div className="space-y-8">
          {staffMembers.map((staff, index) => (
            <div 
              key={index} 
              className="bg-white/90 backdrop-blur-sm rounded-lg p-6"
            >
              <h2 className="text-2xl font-tech mb-6 border-b pb-2">{staff.name}</h2>
              <div className="space-y-4">
                {staff.songs.map((song, songIndex) => (
                  <div 
                    key={songIndex} 
                    className="flex flex-col md:flex-row gap-4 items-start"
                  >
                    <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                      <span className="font-tech text-gray-500 inline-block w-8">
                        {songIndex + 1}.
                      </span>
                      <span className="font-tech">{song.title}</span>
                    </div>
                    <div className="w-full md:w-80 aspect-video">
                      <VideoThumbnail videoId={song.video_id} title={song.title} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!loading && staffMembers.length === itemsPerPage && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              className="bg-white/90 px-6 py-3 rounded-lg font-tech hover:bg-white/100 transition-all"
            >
              Load More
            </button>
          </div>
        )}

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
