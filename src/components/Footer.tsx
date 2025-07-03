import React from 'react';
import { Heart, Mail, Github, Info } from 'lucide-react';

interface FooterProps {
  onShowInfo?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onShowInfo }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Left side - Credits */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>by BabySim Team</span>
            <span className="hidden sm:inline">© {currentYear}</span>
          </div>

          {/* Center - Quick Links */}
          <div className="flex items-center space-x-4">
            {onShowInfo && (
              <button
                onClick={onShowInfo}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors text-sm"
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </button>
            )}
            
            <a
              href="mailto:feedback@babysim.fun"
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors text-sm"
              title="Send feedback"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Feedback</span>
            </a>
            
            <a
              href="https://github.com/babysim/babysim"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors text-sm"
              title="View on GitHub"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>

          {/* Right side - Version/Status */}
          <div className="text-xs text-gray-500">
            <span className="hidden md:inline">BabySim v1.0 • </span>
            <span>Interactive Parenting Experience</span>
          </div>
        </div>

        {/* Bottom disclaimer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            BabySim is an educational simulation for entertainment purposes. 
            Real parenting involves many more factors and individual circumstances. 
            Always consult healthcare professionals for actual parenting guidance.
          </p>
        </div>
      </div>
    </footer>
  );
};