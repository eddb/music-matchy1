return (
  <main className="min-h-screen p-8" style={{ backgroundColor: '#d2c8c4' }}>
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold">Score: {score}</p>
          <p className="text-sm text-gray-600">Round: {currentRound + 1}</p>
        </div>
        <p className="text-sm text-gray-600">Playing as: {playerName}</p>
      </div>

      <div className="flex gap-8">
        {/* Songs List - Left Side */}
        <div className="flex-grow">
          <h2 className="text-xl font-bold mb-6">Whose playlist is this?</h2>
          <div className="space-y-4">
            {currentSongs.map((song, index) => (
              <div key={index} className="flex flex-col gap-4 p-4 bg-white/90 backdrop-blur-sm rounded-lg">
                <div className="relative aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${song.video_id}`}
                    className="absolute inset-0 w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div>
                  <p className="font-medium">{song.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Names Panel - Right Side */}
        <div className="w-72 sticky top-8 h-fit">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6">
            {feedback && (
              <div className={`p-4 mb-4 rounded-md text-center ${
                feedback.isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {feedback.message}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {nameOptions.map((name, index) => (
                <button
                  key={index}
                  onClick={() => handleGuess(name)}
                  className="p-4 text-lg bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={!!feedback?.isCorrect}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
);
