'use client'

import { SignUp } from '@clerk/nextjs'
import StaticLogo from '@/components/StaticLogo'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex relative">
      {/* Center Divider Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-red-600/50 to-transparent hidden lg:block"></div>
      
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(185, 28, 28, 0.3) 0%, transparent 50%)
              `
            }}
          />
        </div>

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(220, 38, 38, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(220, 38, 38, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-8 xl:px-12">
          <div className="max-w-md">
            {/* Logo */}
            <div className="flex items-center mb-4">
              <div className="relative mr-4">
                <div className="absolute inset-0 bg-red-600/30 blur-2xl rounded-full scale-150"></div>
                <StaticLogo size={70} />
              </div>
              <div>
                <h1 className="text-3xl font-black mb-1">
                  <span className="text-white">Link</span><span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Vault</span>
                </h1>
                <p className="text-xs text-gray-400 tracking-widest uppercase font-semibold">PROFESSIONAL PLATFORM</p>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                Start Your Professional Journey
              </h2>
              <p className="text-base text-gray-300 leading-relaxed">
                Create your secure workspace and join the future of professional link management.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center border border-green-600/30">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Free Forever Plan</h3>
                  <p className="text-gray-400 text-sm">Start with generous free limits</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-600/30">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Instant Setup</h3>
                  <p className="text-gray-400 text-sm">Get started in under 2 minutes</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center border border-purple-600/30">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Team Collaboration</h3>
                  <p className="text-gray-400 text-sm">Share and collaborate with your team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo (visible only on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <StaticLogo size={60} />
            </div>
            <h1 className="text-3xl font-bold mb-1">
              <span className="text-white">Link</span><span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Vault</span>
            </h1>
            <p className="text-xs text-gray-400 tracking-wider uppercase">PROFESSIONAL PLATFORM</p>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-white mb-1">
              Create Your Account
            </h2>
            <p className="text-gray-400 text-xs">
              Join thousands of professionals using LinkVault
            </p>
          </div>

          {/* Sign Up Form */}
          <div className="bg-gray-900/30 backdrop-blur-xl rounded-2xl p-5 border border-red-900/40 shadow-2xl ring-1 ring-red-900/20 w-full">
            <style jsx>{`
              :global(.cl-socialButtonsBlockButton) {
                background-color: rgba(55, 65, 81, 0.9) !important;
                border: 2px solid rgba(107, 114, 128, 0.8) !important;
                color: white !important;
                border-radius: 8px !important;
                padding: 12px 16px !important;
                transition: all 0.3s ease !important;
              }
              :global(.cl-socialButtonsBlockButton:hover) {
                background-color: rgba(55, 65, 81, 0.9) !important;
                border-color: rgba(107, 114, 128, 0.8) !important;
              }
              :global(.cl-socialButtonsBlockButtonText) {
                color: white !important;
                font-weight: 600 !important;
              }
              :global(.cl-dividerRow) {
                display: flex !important;
                align-items: center !important;
                margin: 24px 0 !important;
              }
              :global(.cl-dividerLine) {
                flex: 1 !important;
                height: 1px !important;
                background: rgba(107, 114, 128, 0.4) !important;
              }
              :global(.cl-dividerText) {
                color: rgba(156, 163, 175, 1) !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                padding: 0 16px !important;
              }
              :global(.cl-formFieldInput) {
                background-color: rgba(55, 65, 81, 0.9) !important;
                border: 1px solid rgba(107, 114, 128, 0.6) !important;
                color: white !important;
                border-radius: 8px !important;
                padding: 12px 16px !important;
                transition: all 0.3s ease !important;
                font-size: 14px !important;
              }
              :global(.cl-formFieldInput:focus) {
                border-color: rgba(220, 38, 38, 1) !important;
                box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2) !important;
                outline: none !important;
              }
              :global(.cl-formFieldInput:hover) {
                border-color: rgba(107, 114, 128, 0.8) !important;
              }
            `}</style>
            <SignUp 
              appearance={{
                baseTheme: undefined,
                variables: {
                  colorPrimary: "#DC2626",
                  colorBackground: "transparent",
                  colorInputBackground: "rgba(0, 0, 0, 0.2)",
                  colorInputText: "#ffffff",
                  colorText: "#ffffff",
                  colorTextSecondary: "#9CA3AF",
                  borderRadius: "8px",
                  colorNeutral: "#374151"
                },
                elements: {
                  rootBox: "w-full max-w-full",
                  card: "shadow-none bg-transparent p-0 border-0 w-full max-w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  modalContent: "bg-transparent",
                  modalCloseButton: "text-white",
                  
                  // Main form container
                  formContainer: "bg-transparent w-full max-w-full",
                  formFieldRow: "space-y-1 mb-4 w-full max-w-full",
                  
                  // Social buttons
                  socialButtonsBlockButton: "w-full max-w-full justify-center py-3 px-4 border-2 border-gray-600/80 rounded-lg text-sm font-semibold text-white bg-gray-800/90 hover:bg-gray-700/90 hover:border-gray-500/80 transition-all duration-300 shadow-sm !important",
                  socialButtonsBlockButtonText: "text-sm font-semibold text-white ml-2",
                  socialButtonsBlockButtonArrow: "text-white",
                  socialButtonsBlock: "space-y-3 w-full max-w-full mb-4",
                  
                  // Additional social button selectors
                  socialButtonsProviderIcon: "w-5 h-5",
                  socialButtonsProviderIcon__google: "w-5 h-5",
                  
                  // Primary button
                  formButtonPrimary: "w-full max-w-full flex justify-center py-3 px-4 border-0 rounded-lg shadow-lg text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300",
                  
                  // Input fields
                  formFieldInput: "appearance-none block w-full max-w-full px-4 py-3 border-2 border-gray-600/80 rounded-lg placeholder-gray-400 bg-gray-800/90 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm transition-all duration-300 shadow-sm hover:border-gray-500/80 hover:bg-gray-700/90 box-border",
                  formFieldLabel: "block text-sm font-semibold text-gray-200 mb-2",
                  formFieldLabelRow: "mb-2 w-full max-w-full",
                  
                  // Links and text
                  footerActionLink: "text-red-400 hover:text-red-300 transition-colors duration-300 font-semibold text-sm",
                  footerActionText: "text-gray-400 text-sm",
                  
                  // Error messages
                  formFieldErrorText: "text-red-400 text-sm mt-1",
                  formFieldWarningText: "text-yellow-400 text-sm mt-1",
                  formFieldSuccessText: "text-green-400 text-sm mt-1",
                  
                  // Divider
                  dividerLine: "bg-red-900/40",
                  dividerText: "text-gray-400 text-sm font-medium px-4",
                  dividerRow: "my-6",
                  
                  // Form layout
                  form: "space-y-4",
                  footer: "mt-6 text-center",
                  footerAction: "text-center",
                  
                  // Loading states
                  formButtonLoadingIcon: "text-white",
                  spinner: "text-red-500",
                  
                  // Additional elements for sign-up
                  formFieldInputShowPasswordButton: "text-gray-400 hover:text-gray-300 transition-colors",
                  alternativeMethodsBlockButton: "text-red-400 hover:text-red-300 font-semibold",
                  
                  // Verification elements
                  verificationPageBlock: "bg-transparent",
                  verificationLinkBlockButton: "text-red-400 hover:text-red-300 font-semibold text-sm",
                  
                  // Internal form elements
                  internal: {
                    formButtonPrimary: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0"
                  }
                }
              }}
            />
          </div>

          {/* Terms and Privacy */}
          <div className="text-center mt-4">
            <p className="text-gray-500 text-xs">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
