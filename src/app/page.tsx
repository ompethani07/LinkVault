'use client'

import { SignInButton, SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import StaticLogo from '@/components/StaticLogo'

export default function Home() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/welcome')
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(185, 28, 28, 0.2) 0%, transparent 50%),
              linear-gradient(45deg, transparent 40%, rgba(220, 38, 38, 0.05) 50%, transparent 60%)
            `
          }}
        />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(220, 38, 38, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220, 38, 38, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <StaticLogo size={60} />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  LinkVault
                </h1>
                <p className="text-xs text-gray-400 tracking-wide">PROFESSIONAL PLATFORM</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-8">
                <a href="#features" className="text-gray-300 hover:text-red-400 transition-colors font-medium">Features</a>
                <a href="#about" className="text-gray-300 hover:text-red-400 transition-colors font-medium">About</a>
                <a href="#contact" className="text-gray-300 hover:text-red-400 transition-colors font-medium">Contact</a>
              </nav>
              
              <SignedOut>
                <SignInButton>
                  <button className="group relative inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-700 hover:border-red-500/50 transform hover:scale-105">
                    <span className="relative flex items-center">
                      <svg className="w-4 h-4 mr-2 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] group-hover:stroke-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Sign In
                    </span>
                  </button>
                </SignInButton>
              </SignedOut>
              
              <SignedIn>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent"></div>
                  <span className="font-medium">Redirecting...</span>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] pt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Hero Logo */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-12">
              <div className="relative">
                <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full scale-150"></div>
                <StaticLogo size={180} />
              </div>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight">
                Link<span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">Vault</span>
              </h1>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="h-0.5 w-20 bg-gradient-to-r from-transparent to-red-600"></div>
                <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wider uppercase">
                  Enterprise Link Management
                </p>
                <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-red-600"></div>
              </div>
            </div>
          </div>
          
          {/* Main Heading */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Secure Your Digital
              <span className="block">
                <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                  Workspace
                </span>
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed font-light">
              Professional-grade link and file management platform designed for 
              enterprises who demand security, performance, and reliability.
            </p>
          </div>

          {/* CTA Section */}
          <div className="mb-20">
            <SignedOut>
              <SignInButton>
                <button className="group relative inline-flex items-center px-12 py-6 text-xl font-bold text-white bg-black rounded-xl hover:bg-gray-900 transition-all duration-300 shadow-2xl hover:shadow-xl border border-gray-700 hover:border-red-500/50 transform hover:scale-105">
                  <span className="relative flex items-center">
                    <svg className="w-6 h-6 mr-3 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] group-hover:stroke-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Access Platform
                  </span>
                </button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <div className="inline-flex items-center px-12 py-6 text-xl text-gray-300 bg-gray-900/50 rounded-xl shadow-xl border border-gray-700/50">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-red-600 border-t-transparent mr-4"></div>
                Initializing secure workspace...
              </div>
            </SignedIn>
          </div>

          {/* Features Grid */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50 hover:border-red-900/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-900/20">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Enterprise Security</h3>
              <p className="text-gray-400 leading-relaxed">Bank-grade encryption and security protocols to protect your sensitive data and links</p>
            </div>

            <div className="group bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50 hover:border-red-900/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-900/20">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Smart Organization</h3>
              <p className="text-gray-400 leading-relaxed">Advanced categorization and AI-powered tagging for instant content discovery</p>
            </div>

            <div className="group bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50 hover:border-red-900/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-900/20">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Advanced Analytics</h3>
              <p className="text-gray-400 leading-relaxed">Comprehensive insights and reporting for data-driven decision making</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/90 backdrop-blur-sm border-t border-red-900/30 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <StaticLogo size={48} />
              <div>
                <p className="text-gray-400 font-medium">LinkVault Professional</p>
                <p className="text-gray-500 text-sm">Enterprise Link Management Platform</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">&copy; 2024 LinkVault. All rights reserved.</p>
              <p className="text-gray-500 text-xs mt-1">Secure • Professional • Reliable</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
