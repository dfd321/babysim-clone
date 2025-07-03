import React, { useState } from 'react';
import { DecisionInterfaceProps } from '../types/game';
import { Send, Lightbulb } from 'lucide-react';

export const DecisionInterface: React.FC<DecisionInterfaceProps> = ({
  scenario,
  onDecision,
  onCustomDecision,
  disabled = false
}) => {
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      onCustomDecision(customInput.trim());
      setCustomInput('');
      setShowCustomInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCustomSubmit();
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Scenario */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-800">
          {scenario.title}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {scenario.description}
        </p>
      </div>

      {/* Decision Options */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
          <span>How do you respond?</span>
        </h3>
        
        <div className="space-y-3">
          {scenario.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onDecision(option.label, option.consequence)}
              disabled={disabled}
              className={`
                w-full p-4 text-left rounded-lg border-2 transition-all duration-200
                ${disabled 
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                  ${disabled 
                    ? 'bg-gray-200 text-gray-400' 
                    : 'bg-blue-100 text-blue-600'
                  }
                `}>
                  {optionLabels[index]}
                </div>
                <span className="flex-1">
                  {option.label}
                </span>
              </div>
            </button>
          ))}
          
          {/* Custom Option Toggle */}
          {scenario.customAllowed && (
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              disabled={disabled}
              className={`
                w-full p-4 text-left rounded-lg border-2 border-dashed transition-all duration-200
                ${disabled 
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                  : showCustomInput
                  ? 'border-green-300 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50 cursor-pointer'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                  ${disabled 
                    ? 'bg-gray-200 text-gray-400' 
                    : showCustomInput
                    ? 'bg-green-100 text-green-600'
                    : 'bg-green-100 text-green-600'
                  }
                `}>
                  E
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4" />
                    <span>Your own approach...</span>
                  </div>
                  <p className="text-sm mt-1 opacity-75">
                    {showCustomInput ? 'Click to hide custom input' : 'Describe what you would do'}
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Custom Input */}
      {showCustomInput && scenario.customAllowed && (
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700">
            Describe your approach:
          </label>
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            placeholder="Explain how you would handle this situation..."
            className={`
              w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${disabled ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-700'}
            `}
            rows={3}
            maxLength={500}
          />
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {customInput.length}/500 characters
            </span>
            
            <button
              onClick={handleCustomSubmit}
              disabled={disabled || !customInput.trim()}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
                ${disabled || !customInput.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                }
              `}
            >
              <Send className="w-4 h-4" />
              <span>Submit</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};