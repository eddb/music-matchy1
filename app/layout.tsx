import './globals.css'

export const metadata = {
  title: 'Music Matching Game',
  description: 'Match the songs to their submitters!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
