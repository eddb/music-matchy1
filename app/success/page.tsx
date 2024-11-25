export default function SuccessPage() {
  // ... keep existing state and functions ...

  return (
    <main className="min-h-screen pt-12">
      <div className="max-w-4xl mx-auto px-4">
<div className="text-center mb-8 animate-fade-in">
  <h1 className="text-7xl mb-4 tracking-wide text-white drop-shadow-lg">
    GUESSIC
  </h1>
  <p className="text-xl font-departure text-white/90 mb-8">
    the music matching game
  </p>
  
  <div className="flex gap-4 justify-center mb-12">
    <button
      onClick={shareGame}
      className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white py-4 px-8 rounded-xl font-tech text-lg transition-all hover:opacity-90 hover:scale-[1.02] transform"
    >
      Share Game with Others
    </button>
    
    <Link
      href="/game"
      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-xl font-tech text-lg text-center transition-all hover:opacity-90 hover:scale-[1.02] transform"
    >
      Play Game
    </Link>
  </div>
</div>
    </main>
  );
}
