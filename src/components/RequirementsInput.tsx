import React, { useState, useEffect } from 'react';
import { RequirementsInputProps } from '../types/game';

export const RequirementsInput: React.FC<RequirementsInputProps> = ({
  requirements,
  onRequirementsChange,
  disabled = false,
  maxLength = 200
}) => {
  // Local state to prevent re-renders on every keystroke
  const [localRequirements, setLocalRequirements] = useState(requirements);

  // Update local state when parent state changes (for external updates)
  useEffect(() => {
    setLocalRequirements(requirements);
  }, [requirements]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setLocalRequirements(value);
    }
  };

  const handleBlur = () => {
    // Only update parent state on blur to prevent excessive re-renders
    if (localRequirements !== requirements) {
      onRequirementsChange(localRequirements);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Update parent state when user presses Enter (for better UX)
    if (e.key === 'Enter' && e.ctrlKey) {
      onRequirementsChange(localRequirements);
    }
  };

  return (
    <div className='card bg-white p-6 rounded-lg shadow-sm border'>
      <h3 className='text-xl font-semibold text-gray-800 mb-4'>Special Requirements</h3>
      <div className='space-y-3'>
        <textarea
          value={localRequirements}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder='Any special requirements or considerations for your child...'
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
          disabled={disabled}
          maxLength={maxLength}
          rows={3}
        />
        <div className='flex justify-between items-start text-sm'>
          <p className='text-gray-600 leading-relaxed max-w-2xl'>
            Optional: Specify any special considerations, challenges, or requirements for your parenting scenario.
            <br />
            <span className='text-gray-500 text-xs'>
              Tip: Press Ctrl+Enter to save changes immediately
            </span>
          </p>
          <span className='text-gray-500 ml-4 flex-shrink-0'>
            {localRequirements.length}/{maxLength}
          </span>
        </div>
      </div>
    </div>
  );
};
