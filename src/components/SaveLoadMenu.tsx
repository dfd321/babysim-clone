import React, { useState } from 'react';
import { SaveGameMetadata } from '../types/game';

interface SaveLoadMenuProps {
  saves: SaveGameMetadata[];
  onSave: (customName?: string) => void;
  onLoad: (saveId: string) => void;
  onDelete: (saveId: string) => void;
  onExport: (saveId: string) => void;
  onImport: (file: File) => void;
  onClose: () => void;
  mode: 'save' | 'load';
  saveError?: string | null;
  loadError?: string | null;
}

export const SaveLoadMenu: React.FC<SaveLoadMenuProps> = ({
  saves,
  onSave,
  onLoad,
  onDelete,
  onExport,
  onImport,
  onClose,
  mode,
  saveError,
  loadError
}) => {
  const [customSaveName, setCustomSaveName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const handleQuickSave = () => {
    onSave();
  };

  const handleCustomSave = () => {
    if (customSaveName.trim()) {
      onSave(customSaveName.trim());
      setCustomSaveName('');
      setShowNameInput(false);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      event.target.value = ''; // Reset input
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 60) return 'bg-yellow-500';
    if (progress < 90) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {mode === 'save' ? '💾 Save Game' : '📂 Load Game'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {/* Save Mode Actions */}
          {mode === 'save' && (
            <div className="mb-6 space-y-3">
              <button
                onClick={handleQuickSave}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                💾 Quick Save
              </button>
              
              <div className="flex gap-2">
                {!showNameInput ? (
                  <button
                    onClick={() => setShowNameInput(true)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    ✏️ Save with Custom Name
                  </button>
                ) : (
                  <>
                    <input
                      type="text"
                      value={customSaveName}
                      onChange={(e) => setCustomSaveName(e.target.value)}
                      placeholder="Enter save name..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleCustomSave()}
                      autoFocus
                    />
                    <button
                      onClick={handleCustomSave}
                      disabled={!customSaveName.trim()}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowNameInput(false);
                        setCustomSaveName('');
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Import Section */}
          <div className="mb-6">
            <label className="block mb-2">
              <span className="text-sm font-medium text-gray-700">📥 Import Save File:</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </label>
          </div>

          {/* Error Messages */}
          {saveError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <strong>Save Error:</strong> {saveError}
            </div>
          )}
          {loadError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <strong>Load Error:</strong> {loadError}
            </div>
          )}

          {/* Save Slots */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 border-b pb-2">
              {saves.length === 0 ? 'No Saved Games' : `Saved Games (${saves.length})`}
            </h3>
            
            {saves.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🎮</div>
                <p>No saved games yet. Start a new game and save your progress!</p>
              </div>
            ) : (
              saves.map((save) => (
                <div
                  key={save.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 truncate">{save.name}</h4>
                      <div className="text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-4">
                          <span>👶 {save.childName}</span>
                          <span>👨‍👩‍👧‍👦 {save.parentName}</span>
                          <span>🎭 {save.gameStyle}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span>📅 Age {save.currentAge}</span>
                          <span>🕒 {formatDate(save.lastModified)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="ml-4 text-right">
                      <div className="text-xs text-gray-500 mb-1">{save.progress}% Complete</div>
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(save.progress)} transition-all duration-300`}
                          style={{ width: `${save.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">
                    {mode === 'load' && (
                      <button
                        onClick={() => onLoad(save.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        📂 Load
                      </button>
                    )}
                    
                    <button
                      onClick={() => onExport(save.id)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                      📤 Export
                    </button>
                    
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${save.name}"?`)) {
                          onDelete(save.id);
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>💡 Tip: Games auto-save every few minutes</span>
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};