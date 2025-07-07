import React from 'react';
import { RoleSelectorProps } from '../types/game';
import { useTranslation } from '../contexts/TranslationContext';

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleSelect,
  disabled = false
}) => {
  const { t } = useTranslation();
  
  const roles = [
    { id: 'Random' as const, label: t('random'), emoji: '🎲', description: t('random_desc') },
    { id: 'Mom' as const, label: t('mom'), emoji: '👩', description: t('mom_desc') },
    { id: 'Dad' as const, label: t('dad'), emoji: '👨', description: t('dad_desc') },
    { id: 'Non-binary' as const, label: t('non_binary_parent'), emoji: '👤', description: t('non_binary_desc') }
  ];

  const handleKeyDown = (event: React.KeyboardEvent, roleId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!disabled) {
        onRoleSelect(roleId as any);
      }
    }
  };

  return (
    <fieldset className="space-y-4" disabled={disabled}>
      <legend className="sr-only">{t('choose_role')}</legend>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2" id="role-selector-heading">{t('choose_role')}</h2>
        <p className="text-gray-600" id="role-selector-description">{t('role_question')}</p>
      </div>
      
      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        role="radiogroup"
        aria-labelledby="role-selector-heading"
        aria-describedby="role-selector-description"
      >
        {roles.map((role, index) => (
          <button
            key={role.id}
            type="button"
            role="radio"
            aria-checked={selectedRole === role.id}
            aria-describedby={`role-${role.id}-description`}
            onClick={() => !disabled && onRoleSelect(role.id)}
            onKeyDown={(e) => handleKeyDown(e, role.id)}
            disabled={disabled}
            tabIndex={0}
            className={`
              p-6 rounded-lg border-2 transition-all duration-200 text-left
              focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500
              ${selectedRole === role.id
                ? 'border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-200'
                : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-gray-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center space-x-3">
              <span 
                className="text-3xl" 
                role="img" 
                aria-label={`${role.label} icon`}
              >
                {role.emoji}
              </span>
              <div>
                <h3 className="font-semibold text-lg">{role.label}</h3>
                <p className="text-sm opacity-75" id={`role-${role.id}-description`}>
                  {role.description}
                </p>
              </div>
            </div>
            {selectedRole === role.id && (
              <div className="absolute top-2 right-2" aria-hidden="true">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Screen reader announcement area */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {selectedRole && `Selected role: ${roles.find(r => r.id === selectedRole)?.label}`}
      </div>
    </fieldset>
  );
};