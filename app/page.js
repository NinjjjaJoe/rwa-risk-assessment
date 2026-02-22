'use client'

import Link from 'next/link'
import Navigation from './components/Navigation'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section - Tesla Style */}
      <section className="hero-gradient text-white pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            AI-Powered Risk<br />Assessment Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Advanced machine learning models analyze Real World Assets with enterprise-grade precision.
            Real-time risk intelligence on Ethereum and Polygon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-tesla">
              Launch Dashboard
            </Link>
            <Link href="/assets" className="btn-secondary">
              Explore Assets
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="stat-card">
              <div className="stat-number text-tesla-blue">$2.4B</div>
              <div className="stat-label">Assets Analyzed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number text-tesla-blue">99.7%</div>
              <div className="stat-label">AI Accuracy</div>
            </div>
            <div className="stat-card">
              <div className="stat-number text-tesla-blue">50K+</div>
              <div className="stat-label">Risk Assessments</div>
            </div>
            <div className="stat-card">
              <div className="stat-number text-tesla-blue">24/7</div>
              <div className="stat-label">Real-Time Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-tesla-light-gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-tesla-dark-gray">
            Enterprise-Grade Risk Intelligence
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="risk-card">
              <div className="w-12 h-12 bg-tesla-blue rounded-sm flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Multi-Oracle Integration</h3>
              <p className="text-gray-600">
                Chainlink and Pyth Network integration for real-time, manipulation-resistant data feeds
              </p>
            </div>

            {/* Feature 2 */}
            <div className="risk-card">
              <div className="w-12 h-12 bg-tesla-red rounded-sm flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Verification Layer</h3>
              <p className="text-gray-600">
                Zero-knowledge proofs verify off-chain AI computations with cryptographic certainty
              </p>
            </div>

            {/* Feature 3 */}
            <div className="risk-card">
              <div className="w-12 h-12 bg-green-600 rounded-sm flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Analytics</h3>
              <p className="text-gray-600">
                Live risk monitoring with instant alerts for threshold breaches and market changes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-tesla-dark-gray">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Connect Asset', desc: 'Link your RWA to the platform via smart contracts' },
              { step: '2', title: 'AI Analysis', desc: 'Machine learning models assess risk across 50+ parameters' },
              { step: '3', title: 'Oracle Verification', desc: 'Multi-source data validation ensures accuracy' },
              { step: '4', title: 'Real-Time Score', desc: 'Get instant risk scores with confidence intervals' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-tesla-blue rounded-sm flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-gradient text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Assess Your Assets?
          </h2>
          <p className="text-lg mb-8 text-gray-300">
            Join institutional investors using AI-powered risk intelligence
          </p>
          <Link href="/dashboard" className="btn-tesla inline-block">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-tesla-dark-gray text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>© 2026 RWA Risk Assessment Platform. Built by King F50.</p>
        </div>
      </footer>
    </div>
  )
}
