import React, { useState } from 'react';
import { DecisionInterfaceProps } from '../types/game';
import { Send, Lightbulb, AlertTriangle } from 'lucide-react';
import { ValidationService } from '../services/validationService';

export const DecisionInterface: React.FC<DecisionInterfaceProps> = ({
  scenario,
  onDecision,
  onCustomDecision,
  disabled = false
}) => {
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      // Validate and sanitize the custom input
      const validation = ValidationService.validateCustomDecision(customInput);
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        return;
      }
      
      // Clear any previous validation errors
      setValidationErrors([]);
      
      // Use sanitized value for the decision
      onCustomDecision(validation.sanitizedValue || customInput.trim());
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
            onChange={(e) => {
              setCustomInput(e.target.value);
              // Clear validation errors when user starts typing
              if (validationErrors.length > 0) {
                setValidationErrors([]);
              }
            }}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            placeholder="Explain how you would handle this situation..."
            className={`
              w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${disabled 
                ? 'bg-gray-50 text-gray-400 border-gray-300' 
                : validationErrors.length > 0
                ? 'bg-red-50 text-gray-700 border-red-300'
                : 'bg-white text-gray-700 border-gray-300'
              }
            `}
            rows={3}
            maxLength={200}
          />
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {customInput.length}/200 characters
            </span>
            
            <button
              onClick={handleCustomSubmit}
              disabled={disabled || !customInput.trim()}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
                ${disabled || !customInput.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : validationErrors.length > 0
                  ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
                  : 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                }
              `}
            >
              <Send className="w-4 h-4" />
              <span>Submit</span>
            </button>
          </div>
          
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Input validation failed:</p>
                  <ul className="mt-1 text-sm text-red-700 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="list-disc list-inside">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};