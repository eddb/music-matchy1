'use client';

// ... keep existing imports ...

export default function SuccessPage() {
  // ... keep existing state and functions ...

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 animate-fade-in">
        <h1 className="text-6xl text-center mb-4 font-cherry text-white drop-shadow-lg">
          GUESSIC
        </h1>
        <p className="text-xl text-center mb-12 font-departure text-white opacity-90">
          the music matching game
        </p>

        <div className="space-y-8">
          {songs.map((song, index) => (
            <div 
              key={index} 
              className="relative h-64 rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-[1.02]"
              style={{animationDelay: `${index * 200}ms`}}
            >
              <img 
                src={song.thumbnail}
                alt={song.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center backdrop-blur-sm">
                <h3 className="text-white text-2xl font-departure text-center px-6">
                  {song.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-6">
          <button
            onClick={shareGame}
            className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white py-4 px-8 rounded-lg font-tech text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Share Game with Others
          </button>
        </div>
      </div>
    </main>
  );
}
