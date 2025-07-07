import React, { useState } from 'react';

interface ScenarioOptionButtonProps {
  option: { label: string; consequence: string };
  index: number;
  isSelected: boolean;
  isProcessing: boolean;
  onClick: (option: { label: string; consequence: string }) => void;
}

const ScenarioOptionButton: React.FC<ScenarioOptionButtonProps> = ({
  option,
  index,
  isSelected,
  isProcessing,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!isProcessing) {
      onClick(option);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  // Dynamic styling based on state
  const getButtonClasses = () => {
    const baseClasses = "w-full text-left p-4 border-2 rounded-lg transition-all duration-200 group relative focus:outline-none focus:ring-4 focus:ring-offset-2";
    
    if (isProcessing) {
      return `${baseClasses} border-gray-300 bg-gray-100 cursor-not-allowed opacity-60 focus:ring-gray-300`;
    }
    
    if (isSelected) {
      return `${baseClasses} border-purple-500 bg-purple-100 ring-purple-500 ring-4 shadow-lg focus:ring-purple-500`;
    }
    
    if (isHovered) {
      return `${baseClasses} border-purple-300 bg-purple-50 shadow-md focus:ring-purple-500 focus:border-purple-500`;
    }
    
    return `${baseClasses} border-gray-200 hover:border-purple-300 hover:bg-purple-50 focus:ring-purple-500 focus:border-purple-500`;
  };

  const getTextClasses = () => {
    if (isProcessing) {
      return "font-semibold text-gray-500 mb-2";
    }
    
    if (isSelected) {
      return "font-semibold text-purple-800 mb-2";
    }
    
    return "font-semibold text-gray-800 group-hover:text-purple-700 group-focus:text-purple-700 mb-2";
  };

  // Truncate text with warning if needed
  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) {
      return { text, isTruncated: false };
    }
    
    return {
      text: text.slice(0, maxLength) + '...',
      isTruncated: true,
      originalLength: text.length
    };
  };

  const labelInfo = truncateText(option.label);

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={getButtonClasses()}
        disabled={isProcessing}
        aria-pressed={isSelected}
        aria-describedby={`option-${index}-description`}
        role="button"
        tabIndex={0}
      >
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}

        {/* Processing indicator */}
        {isProcessing && isSelected && (
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
            </div>
          </div>
        )}

        <div className={getTextClasses()}>
          {labelInfo.text}
        </div>

        {/* Keyboard hint */}
        <div className="sr-only" id={`option-${index}-description`}>
          Option {index + 1} of {option.label.length > 200 ? `${option.label.length} characters (truncated)` : 'available'}. Press Enter or Space to select.
        </div>
      </button>

      {/* Truncation warning */}
      {labelInfo.isTruncated && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Text truncated ({labelInfo.originalLength} chars total). Full text available on selection.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ScenarioOptionButton);