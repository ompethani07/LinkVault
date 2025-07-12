'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StaticLogo from '@/components/StaticLogo'

export default function WelcomePage() {
  const { user } = useUser()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const totalSteps = 3

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsTransitioning(false)
      }, 800)
    } else {
      setIsTransitioning(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    }
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

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
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-red-600/20 blur-2xl rounded-full scale-150"></div>
                <StaticLogo size={60} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  <span className="text-white">Link</span><span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Vault</span>
                </h1>
                <p className="text-xs text-gray-400 tracking-wide">PROFESSIONAL PLATFORM</p>
              </div>
            </div>
            <p className="text-gray-300 text-lg">Welcome to Enterprise Link Management</p>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-gray-300">Step {currentStep} of {totalSteps}</span>
              <button 
                onClick={handleSkip}
                className="text-sm text-gray-400 hover:text-red-400 transition-colors font-medium"
              >
                Skip introduction →
              </button>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-600 to-red-700 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-800/50 p-6 md:p-8">
            {currentStep === 1 && (
              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Welcome, {user?.firstName || 'Professional'}!
                  </h2>
                  <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                    You've joined thousands of professionals who trust LinkVault for organizing their digital workspace. 
                    Let's get you set up for enterprise-grade productivity.
                  </p>
                </div>
                <div className="bg-red-950/30 border border-red-900/30 rounded-2xl p-6">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-white font-semibold text-base">
                    Ready to transform how you manage your professional workspace?
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center border border-gray-600">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Enterprise Features
                  </h2>
                  <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-6">
                    Experience professional-grade security and organization with our enterprise features.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-red-950/20 border border-red-900/30 rounded-2xl p-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-white mb-2 text-base">Bank-Grade Security</h3>
                      <p className="text-gray-300 text-sm">Enterprise encryption and security protocols for your sensitive data</p>
                    </div>
                    <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-white mb-2 text-base">Advanced Analytics</h3>
                      <p className="text-gray-300 text-sm">Comprehensive insights and reporting for data-driven decisions</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    You're All Set!
                  </h2>
                  <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-6">
                    Your enterprise LinkVault workspace is ready. Time to build your secure digital future.
                  </p>
                  <div className="bg-gradient-to-r from-red-950/30 via-gray-900/30 to-red-950/30 border border-red-900/30 rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 text-lg">What's next?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-center p-4 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50">
                        <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 font-medium text-sm">Create your first link</span>
                      </div>
                      <div className="flex items-center justify-center p-4 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50">
                        <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 font-medium text-sm">Upload secure files</span>
                      </div>
                      <div className="flex items-center justify-center p-4 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50">
                        <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 font-medium text-sm">Set up organization</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <button 
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1 || isTransitioning}
                className={`px-8 py-4 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  currentStep === 1 || isTransitioning
                    ? 'text-gray-500 bg-gray-800/50 cursor-not-allowed border border-gray-700/50' 
                    : 'text-gray-300 bg-gray-800/60 border border-gray-700/50 hover:bg-gray-700/60 hover:border-gray-600/50'
                }`}
              >
                Previous
              </button>
              
              <div className="flex space-x-3">
                {isTransitioning ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }}></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.4s' }}></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1.4s' }}></div>
                  </div>
                ) : (
                  [...Array(totalSteps)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        i + 1 <= currentStep 
                          ? 'bg-gradient-to-r from-red-600 to-red-700' 
                          : 'bg-gray-700'
                      }`}
                    />
                  ))
                )}
              </div>

              <button 
                onClick={handleNext}
                disabled={isTransitioning}
                className={`group relative inline-flex items-center px-8 py-4 text-sm font-bold text-white rounded-xl transition-all duration-300 shadow-lg border transform ${
                  isTransitioning
                    ? 'bg-gray-800/50 border-gray-700/50 cursor-not-allowed opacity-50'
                    : 'bg-black hover:bg-gray-900 hover:shadow-xl border-gray-700 hover:border-red-500/50 hover:scale-105'
                }`}
              >
                <span className="relative flex items-center">
                  {isTransitioning ? (
                    <div className="w-5 h-5 mr-3 animate-spin border-2 border-gray-400 border-t-transparent rounded-full"></div>
                  ) : (
                    <svg className="w-5 h-5 mr-3 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] group-hover:stroke-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {isTransitioning 
                    ? 'Loading...' 
                    : (currentStep === totalSteps ? 'Launch Dashboard' : 'Continue')
                  }
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
