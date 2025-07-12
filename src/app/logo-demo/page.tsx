'use client';

import { useState } from 'react';
import LinkVault3DLogo from '@/components/LinkVault3DLogo';

export default function LogoDemo() {
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="text-center space-y-8 w-full">
        <div className="flex justify-center mb-8">
          <LinkVault3DLogo 
            width={800} 
            height={400} 
            onAnimationComplete={() => setAnimationComplete(true)}
          />
        </div>
        
        {animationComplete && (
          <div className="animate-fade-in">
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
              Professional 3D text animation with advanced Three.js techniques:
              <br />
              • Dynamic letter falling animation
              <br />
              • Professional particle systems
              <br />
              • Advanced lighting and shadows
              <br />
              • Custom shaders and materials
            </p>
            
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Replay Animation
            </button>
          </div>
        )}
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Technical Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-orange-400 font-semibold mb-2">Advanced Animation</h3>
              <p className="text-gray-400 text-sm">Sequential letter falling with professional easing curves</p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-blue-400 font-semibold mb-2">Particle System</h3>
              <p className="text-gray-400 text-sm">2000+ particles with dynamic color and movement</p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-purple-400 font-semibold mb-2">Professional Lighting</h3>
              <p className="text-gray-400 text-sm">Multiple light sources with dynamic intensity</p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-green-400 font-semibold mb-2">Physical Materials</h3>
              <p className="text-gray-400 text-sm">Metallic surfaces with reflections and transmission</p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-red-400 font-semibold mb-2">Shadow System</h3>
              <p className="text-gray-400 text-sm">Professional shadow mapping with 4K resolution</p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-yellow-400 font-semibold mb-2">Performance</h3>
              <p className="text-gray-400 text-sm">Optimized rendering with professional cleanup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
