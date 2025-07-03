import React from 'react';
import { RoleSelectorProps } from '../types/game';

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleSelect,
  disabled = false
}) => {
  const roles = [
    { id: 'Random' as const, label: 'Random', emoji: '🎲', description: 'Let chance decide your role' },
    { id: 'Mom' as const, label: 'Mom', emoji: '👩', description: 'Play as a mother' },
    { id: 'Dad' as const, label: 'Dad', emoji: '👨', description: 'Play as a father' },
    { id: 'Non-binary' as const, label: 'Non-binary Parent', emoji: '👤', description: 'Play as a non-binary parent' }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Role</h2>
        <p className="text-gray-600">What kind of parent would you like to be?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => onRoleSelect(role.id)}
            disabled={disabled}
            className={`
              p-6 rounded-lg border-2 transition-all duration-200 text-left
              ${selectedRole === role.id
                ? 'border-blue-500 bg-blue-50 text-blue-800'
                : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-gray-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{role.emoji}</span>
              <div>
                <h3 className="font-semibold text-lg">{role.label}</h3>
                <p className="text-sm opacity-75">{role.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};