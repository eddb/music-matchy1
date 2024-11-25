import './globals.css'
import { Cherry_Bomb_One } from 'next/font/google'

const cherryBomb = Cherry_Bomb_One({ 
  weight: '400',
  subsets: ['latin'] 
})

export const metadata = {
  title: 'GUESSIC',
  description: 'The music matching game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.cdnfonts.com/css/share-tech-mono" rel="stylesheet" />
        <link rel="stylesheet" href="https://departuremono.com/departure-mono.css" />
      </head>
      <body className={`${cherryBomb.className} min-h-screen`} style={{ backgroundColor: '#d2c8c4' }}>
        <div 
  className="fixed inset-0 w-full h-[380px] z-0"
  style={{
    backgroundImage: 'url("/back.png")',
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    WebkitMask: 'linear-gradient(to right, transparent, black 100px, black calc(100% - 100px), transparent), linear-gradient(to bottom, black, black 280px, transparent)',
    mask: 'linear-gradient(to right, transparent, black 100px, black calc(100% - 100px), transparent), linear-gradient(to bottom, black, black 280px, transparent)',
  }}
/>
        <div className="relative pt-[260px] min-h-screen z-10">
          {children}
        </div>
       <div className="fixed bottom-4 right-4 text-sm text-gray-500 font-tech z-50">
  made by <a 
    href="https://stalkthewolv.es/" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="hover:text-gray-700 transition-colors hover:underline"
  >
    @eddb
  </a>
</div>
      </body>
    </html>
  )
}
