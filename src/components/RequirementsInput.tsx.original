import React from 'react';
import { RequirementsInputProps } from '../types/game';
import { GAME_CONFIG, PLACEHOLDERS, UI_TEXT } from '../utils/constants';

export const RequirementsInput: React.FC<RequirementsInputProps> = ({
  requirements,
  onRequirementsChange,
  disabled = false,
  maxLength = GAME_CONFIG.MAX_REQUIREMENTS_LENGTH
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      onRequirementsChange(value);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{UI_TEXT.SPECIAL_REQUIREMENTS}</h3>
      <div className="space-y-3">
        <input
          type="text"
          value={requirements}
          onChange={handleChange}
          placeholder={PLACEHOLDERS.REQUIREMENTS}
          className="input-field"
          disabled={disabled}
          maxLength={maxLength}
        />
        <div className="flex justify-between items-start text-sm">
          <p className="text-gray-600 leading-relaxed max-w-2xl">
            {UI_TEXT.REQUIREMENTS_HINT}
          </p>
          <span className="text-gray-500 ml-4 flex-shrink-0">
            {requirements.length}/{maxLength}
          </span>
        </div>
      </div>
    </div>
  );
};