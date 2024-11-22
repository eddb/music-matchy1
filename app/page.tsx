import SongSubmissionForm from '../components/songsubmissionform'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          Music Matching Game!
        </h1>
        <SongSubmissionForm />
      </div>
    </main>
  )
}
