import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getVideoDetails(videoId: string) {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
  );
  const data = await response.json();
  return data.items[0]?.snippet;
}

export async function POST(request: Request) {
  try {
    const { name, songs } = await request.json();

    // Insert staff member
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .insert({ name })
      .select()
      .single();

    if (staffError) {
      return NextResponse.json({ error: staffError.message }, { status: 400 });
    }

    // Process each song
    const videoIds = songs.map((url: string) => {
      const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/);
      return match?.[1];
    });

    // Get video details for each song
    const songDetails = await Promise.all(
      videoIds.map(async (videoId: string) => {
        const details = await getVideoDetails(videoId);
        return {
          staff_id: staff.id,
          url: `https://youtube.com/watch?v=${videoId}`,
          video_id: videoId,
          title: details.title,
          thumbnail: details.thumbnails.default.url
        };
      })
    );

    // Insert songs
    const { error: songsError } = await supabase
      .from('songs')
      .insert(songDetails);

    if (songsError) {
      return NextResponse.json({ error: songsError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
