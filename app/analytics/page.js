'use client'

import Link from 'next/link'
import Navigation from '../components/Navigation'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-tesla-light-gray">
      <Navigation />
      
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-tesla-dark-gray">Analytics</h1>
            <Link href="/" className="text-tesla-blue hover:text-[#3358c9] font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
          </div>
          
          <div className="risk-card text-center py-20">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h2 className="text-2xl font-bold text-tesla-dark-gray mb-2">Coming Soon</h2>
            <p className="text-gray-600 mb-6">Advanced analytics dashboard under development</p>
            <Link href="/dashboard" className="btn-primary inline-block">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
