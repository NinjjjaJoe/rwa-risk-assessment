'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Assets', path: '/assets' },
    { name: 'Analytics', path: '/analytics' },
  ]

  return (
    <nav className="nav-tesla">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-tesla-blue rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-xl font-bold text-tesla-dark-gray hidden sm:block">RWA Risk</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`${
                  pathname === item.path 
                    ? 'text-tesla-dark-gray font-medium' 
                    : 'text-gray-600 hover:text-tesla-dark-gray'
                } transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}
            <button className="btn-primary text-sm">
              Connect Wallet
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-tesla-dark-gray"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block ${
                  pathname === item.path 
                    ? 'text-tesla-dark-gray font-medium' 
                    : 'text-gray-600'
                } py-2`}
              >
                {item.name}
              </Link>
            ))}
            <button className="btn-primary w-full mt-3 text-sm">
              Connect Wallet
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
