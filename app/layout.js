import './globals.css'

export const metadata = {
  title: 'RWA Risk Assessment | AI-Powered Risk Intelligence',
  description: 'Advanced AI-powered risk assessment for Real World Assets on blockchain',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
