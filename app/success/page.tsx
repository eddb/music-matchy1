import Link from 'next/link'

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Songs Submitted Successfully!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Thank you for submitting your favorite songs. When everyone has submitted their songs,
            you&apos;ll be able to play the matching game!
          </p>

          <div className="space-y-4">
            <Link 
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors"
            >
              Return Home
            </Link>
            
            <Link
              href="/game"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Play Game
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
