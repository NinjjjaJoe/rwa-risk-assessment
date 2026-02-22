'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '../components/Navigation'

export default function DashboardPage() {
  const [assets] = useState([
    {
      id: 1,
      name: 'Manhattan Real Estate Fund',
      type: 'Real Estate',
      riskScore: 2850,
      trend: 'down',
      value: '$45.2M',
      lastUpdate: '2 mins ago'
    },
    {
      id: 2,
      name: 'Treasury Bond Portfolio',
      type: 'Fixed Income',
      riskScore: 1200,
      trend: 'stable',
      value: '$120M',
      lastUpdate: '5 mins ago'
    },
    {
      id: 3,
      name: 'Commodity Futures Basket',
      type: 'Commodities',
      riskScore: 7450,
      trend: 'up',
      value: '$28.5M',
      lastUpdate: '1 min ago'
    },
  ])

  const getRiskLevel = (score) => {
    if (score < 3000) return { label: 'LOW', color: 'risk-low' }
    if (score < 6000) return { label: 'MEDIUM', color: 'risk-medium' }
    return { label: 'HIGH', color: 'risk-high' }
  }

  const formatScore = (score) => {
    return (score / 100).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-tesla-light-gray">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-tesla-dark-gray">Risk Dashboard</h1>
            <Link href="/" className="text-tesla-blue hover:text-[#3358c9] font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
          <p className="text-gray-600 text-lg">
            Real-time risk monitoring across your portfolio
          </p>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="risk-card">
            <p className="text-gray-600 text-sm mb-1">Total Portfolio Value</p>
            <p className="text-3xl font-bold text-tesla-dark-gray">$193.7M</p>
          </div>
          <div className="risk-card">
            <p className="text-gray-600 text-sm mb-1">Average Risk Score</p>
            <p className="text-3xl font-bold risk-medium">38.3</p>
          </div>
          <div className="risk-card">
            <p className="text-gray-600 text-sm mb-1">Assets Monitored</p>
            <p className="text-3xl font-bold text-tesla-dark-gray">3</p>
          </div>
          <div className="risk-card">
            <p className="text-gray-600 text-sm mb-1">Alerts Today</p>
            <p className="text-3xl font-bold text-tesla-red">2</p>
          </div>
        </div>

        {/* Assets Table */}
        <div className="risk-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-tesla-dark-gray">Monitored Assets</h2>
            <Link href="/assets" className="btn-primary text-sm">
              Add New Asset
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Asset Name</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Type</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium text-sm">Value</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium text-sm">Risk Score</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-medium text-sm">Status</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium text-sm">Updated</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => {
                  const risk = getRiskLevel(asset.riskScore)
                  return (
                    <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-bold text-tesla-dark-gray">{asset.name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600">{asset.type}</span>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold">
                        {asset.value}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`font-bold text-xl ${risk.color}`}>
                          {formatScore(asset.riskScore)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${risk.color}`}>
                          {risk.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-500 text-sm">
                        {asset.lastUpdate}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="risk-card mt-8">
          <h2 className="text-2xl font-bold text-tesla-dark-gray mb-6">Recent Alerts</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg">
              <div className="w-10 h-10 bg-tesla-red rounded-sm flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-tesla-dark-gray">Risk Threshold Breached</p>
                <p className="text-gray-600 text-sm">Commodity Futures Basket exceeded 70.0 risk score</p>
                <p className="text-gray-500 text-xs mt-1">5 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
              <div className="w-10 h-10 bg-yellow-500 rounded-sm flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-tesla-dark-gray">Volatility Spike Detected</p>
                <p className="text-gray-600 text-sm">Manhattan Real Estate Fund showing increased volatility</p>
                <p className="text-gray-500 text-xs mt-1">15 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
