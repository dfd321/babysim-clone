import React from 'react';
import { StyleSelectorProps } from '../types/game';
import { GAME_STYLES, UI_TEXT } from '../utils/constants';

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
  disabled = false
}) => {
  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{UI_TEXT.CHOOSE_STYLE}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GAME_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleSelect(style.id)}
            disabled={disabled}
            className={`
              ${selectedStyle === style.id ? 'btn-selected' : 'btn-secondary'}
              flex flex-col items-center gap-3 py-6 text-center
            `}
          >
            <span className="text-3xl">{style.emoji}</span>
            <div>
              <div className="font-semibold text-lg">{style.label}</div>
              <div className="text-sm text-gray-600 mt-1">{style.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};