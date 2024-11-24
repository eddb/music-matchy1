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
