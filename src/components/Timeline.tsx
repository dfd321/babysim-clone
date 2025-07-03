import React from 'react';
import { TimelineProps } from '../types/game';

export const Timeline: React.FC<TimelineProps> = ({ entries, currentAge }) => {
  // Handle empty state
  if (!entries || entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">📖</span>
          Your Parenting Journey
        </h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">⏳</div>
          <p className="text-sm">Your story will unfold here as you make decisions</p>
        </div>
      </div>
    );
  }

  const getEffectColor = (value: number) => {
    if (value > 0) return 'bg-green-100 text-green-700';
    if (value < 0) return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getEffectIcon = (value: number) => {
    if (value > 0) return '+';
    return '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-h-[600px] overflow-y-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 sticky top-0 bg-white pb-2 border-b border-gray-100">
        <span className="text-xl">📖</span>
        Your Parenting Journey
      </h3>
      
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div key={index} className="relative">
            {/* Timeline connector line */}
            {index < entries.length - 1 && (
              <div className="absolute left-5 top-12 w-0.5 h-16 bg-gray-200"></div>
            )}
            
            {/* Timeline entry */}
            <div className="flex gap-3">
              {/* Age badge */}
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {entry.age}
              </div>
              
              {/* Content */}
              <div className="flex-grow">
                <div className="bg-gray-50 rounded-lg p-4">
                  {/* Header */}
                  <div className="mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {entry.scenario}
                    </h4>
                    <span className="text-xs text-gray-500">{entry.stage}</span>
                  </div>
                  
                  {/* Decision */}
                  <div className="mb-2">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Decision:</p>
                    <p className="text-xs text-gray-700">{entry.choice}</p>
                  </div>
                  
                  {/* Consequence */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Result:</p>
                    <p className="text-xs text-gray-700">{entry.consequence}</p>
                  </div>
                  
                  {/* Effects */}
                  <div className="flex flex-wrap gap-2">
                    {entry.effects.happiness !== 0 && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEffectColor(entry.effects.happiness)}`}>
                        ❤️ {getEffectIcon(entry.effects.happiness)}{entry.effects.happiness}
                      </span>
                    )}
                    {entry.effects.finances !== 0 && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEffectColor(entry.effects.finances)}`}>
                        💰 {getEffectIcon(entry.effects.finances)}${Math.abs(entry.effects.finances).toLocaleString()}
                      </span>
                    )}
                    {entry.effects.development && entry.effects.development.length > 0 && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        📈 {entry.effects.development.join(', ')}
                      </span>
                    )}
                  </div>
                  
                  {/* Current age indicator */}
                  {entry.age === currentAge && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                      <span>📍</span>
                      <span className="font-medium">Current stage</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary stats */}
      {entries.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Journey Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-50 p-2 rounded">
              <span className="text-blue-600 font-medium">Decisions Made: </span>
              <span className="text-blue-800">{entries.length}</span>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <span className="text-green-600 font-medium">Current Age: </span>
              <span className="text-green-800">{currentAge}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
