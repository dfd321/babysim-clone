import React from 'react';
import { X, Heart, Code, Users, Target } from 'lucide-react';

interface InformationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InformationCenter: React.FC<InformationCenterProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">👶</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">About BabySim</h2>
                <p className="text-gray-600">Interactive Parenting Simulator</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Mission */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  BabySim provides an interactive way to explore parenting decisions and their potential outcomes. 
                  Our goal is to offer insights into child development through engaging scenarios while 
                  acknowledging that real parenting is far more complex and individualized.
                </p>
              </div>
            </div>

            {/* How it Works */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">How It Works</h3>
                <p className="text-gray-600 leading-relaxed">
                  Choose your parenting role and style, then navigate through key developmental stages 
                  from toddler to teenager. Each decision impacts your child's happiness, your family's 
                  finances, and their developmental trajectory. Experience different outcomes and 
                  learn about various parenting approaches.
                </p>
              </div>
            </div>

            {/* Technology */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Built With</h3>
                <p className="text-gray-600 leading-relaxed">
                  React, TypeScript, and Tailwind CSS power this modern web application. 
                  The simulation engine uses carefully researched developmental psychology 
                  principles to create realistic scenarios and outcomes.
                </p>
              </div>
            </div>

            {/* Team */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">The Team</h3>
                <p className="text-gray-600 leading-relaxed">
                  Created by parents, educators, and developers who understand both the joys 
                  and challenges of raising children. Our diverse backgrounds help ensure 
                  scenarios reflect various family structures and parenting philosophies.
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Note</h4>
              <p className="text-yellow-700 text-sm leading-relaxed">
                This is a simplified simulation for educational and entertainment purposes. 
                Real parenting involves countless variables, cultural factors, and individual 
                circumstances that cannot be fully captured in any simulation. Always consult 
                qualified professionals for actual parenting guidance and child development concerns.
              </p>
            </div>

            {/* Contact */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 mb-3">
                Have feedback or suggestions? We'd love to hear from you!
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="mailto:feedback@babysim.fun"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Feedback
                </a>
                <a
                  href="https://github.com/babysim/babysim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};