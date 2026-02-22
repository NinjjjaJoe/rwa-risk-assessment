'use client'

import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>RWA Risk Assessment | AI-Powered Risk Intelligence</title>
        <meta name="description" content="Advanced AI-powered risk assessment for Real World Assets on blockchain" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
