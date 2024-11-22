import SongSubmissionForm from '../components/songsubmissionform'

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-8">
        Music Matching Game
      </h1>
      <SongSubmissionForm />
    </main>
  )
}
