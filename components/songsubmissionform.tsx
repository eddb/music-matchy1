'use client';

// ... keep existing imports and interfaces ...

export default function SongSubmissionForm() {
  // ... keep existing state and functions ...

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
            className="w-full px-4 py-3 font-departure border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="Enter your name"
            required
          />
        </div>

        {songs.map((song, index) => (
          <div key={index} className="space-y-2">
            <label className="block font-tech text-gray-700">
              Song {index + 1}
            </label>
            <input
              type="url"
              value={song}
              onChange={(e) => handleSongChange(index, e.target.value)}
              className="w-full px-4 py-3 font-departure border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter YouTube URL"
              required
            />
          </div>
        ))}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-tech">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white py-4 px-6 rounded-lg font-tech text-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 transform hover:scale-[1.02]"
        >
          {loading ? 'Submitting...' : 'Submit Songs'}
        </button>
      </form>
    </div>
  );
}
