import React, { useState, useEffect } from 'react';
import { ValidationService, ValidationOptions } from '../services/validationService';

interface SecureTextInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  allowedCharacters?: RegExp;
  type?: 'text' | 'email' | 'textarea';
  rows?: number;
  showValidation?: boolean;
  validationOptions?: ValidationOptions;
}

export const SecureTextInput: React.FC<SecureTextInputProps> = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  disabled = false,
  maxLength,
  minLength,
  required = false,
  allowedCharacters,
  type = 'text',
  rows = 3,
  showValidation = true,
  validationOptions = {}
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [validationResult, setValidationResult] = useState({ isValid: true, errors: [] as string[] });
  const [touched, setTouched] = useState(false);

  // Merge validation options
  const options: ValidationOptions = {
    maxLength,
    minLength,
    required,
    allowedCharacters,
    trim: true,
    ...validationOptions
  };

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const validateInput = (inputValue: string) => {
    let result;
    
    if (type === 'email') {
      result = ValidationService.validateEmail(inputValue);
    } else {
      result = ValidationService.sanitizeText(inputValue, options);
    }
    
    setValidationResult(result);
    return result;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    // Allow typing up to maxLength + some buffer for better UX
    if (maxLength && newValue.length > maxLength + 10) {
      return;
    }
    
    setLocalValue(newValue);
    
    const validation = validateInput(newValue);
    onChange(validation.sanitizedValue || newValue, validation.isValid);
  };

  const handleBlur = () => {
    setTouched(true);
    const validation = validateInput(localValue);
    
    // Update with sanitized value on blur
    if (validation.sanitizedValue && validation.sanitizedValue !== localValue) {
      setLocalValue(validation.sanitizedValue);
      onChange(validation.sanitizedValue, validation.isValid);
    }
  };

  const baseClassName = `
    w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200
    ${validationResult.isValid || !touched
      ? 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
      : 'border-red-500 focus:ring-red-500 focus:border-red-500'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${className}
  `.trim();

  const commonProps = {
    value: localValue,
    onChange: handleChange,
    onBlur: handleBlur,
    placeholder,
    disabled,
    className: baseClassName,
    maxLength: maxLength ? maxLength + 10 : undefined // Allow some buffer for typing
  };

  return (
    <div className="space-y-2">
      {type === 'textarea' ? (
        <textarea
          {...commonProps}
          rows={rows}
          style={{ resize: 'vertical' }}
        />
      ) : (
        <input
          {...commonProps}
          type={type === 'email' ? 'email' : 'text'}
          autoComplete={type === 'email' ? 'email' : 'off'}
        />
      )}
      
      {/* Character count and validation */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {showValidation && touched && !validationResult.isValid && (
            <div className="text-red-600 text-sm space-y-1">
              {validationResult.errors.map((error, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  <span>{error}</span>
                </div>
              ))}
            </div>
          )}
          
          {showValidation && touched && validationResult.isValid && localValue.trim() && (
            <div className="text-green-600 text-sm flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span>Input is valid</span>
            </div>
          )}
        </div>
        
        {maxLength && (
          <div className={`text-sm ml-4 flex-shrink-0 ${
            localValue.length > maxLength ? 'text-red-600 font-medium' : 'text-gray-500'
          }`}>
            {localValue.length}/{maxLength}
          </div>
        )}
      </div>
      
      {/* Security indicator */}
      {showValidation && (
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <span className="text-green-500">🔒</span>
          <span>Input is automatically sanitized for security</span>
        </div>
      )}
    </div>
  );
};