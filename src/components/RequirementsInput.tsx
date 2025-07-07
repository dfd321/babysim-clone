import React from 'react';
import { RequirementsInputProps } from '../types/game';
import { useTranslation } from '../contexts/TranslationContext';
import { SecureTextInput } from './SecureTextInput';

export const RequirementsInput: React.FC<RequirementsInputProps> = ({
  requirements,
  onRequirementsChange,
  disabled = false,
  maxLength = 500
}) => {
  const { t } = useTranslation();
  
  const handleSecureChange = (value: string) => {
    onRequirementsChange(value);
  };

  return (
    <div className='card bg-white p-6 rounded-lg shadow-sm border'>
      <h3 className='text-xl font-semibold text-gray-800 mb-4'>{t('special_requirements')}</h3>
      <div className='space-y-3'>
        <SecureTextInput
          value={requirements}
          onChange={handleSecureChange}
          placeholder={t('requirements_placeholder')}
          disabled={disabled}
          maxLength={maxLength}
          type="textarea"
          rows={4}
          showValidation={true}
        />
        <div className='text-sm'>
          <p className='text-gray-600 leading-relaxed max-w-2xl'>
            {t('requirements_hint')}
            <br />
            <span className='text-gray-500 text-xs'>
              {t('requirements_tip')}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
