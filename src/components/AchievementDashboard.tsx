import React, { useState, useEffect } from 'react';
import { 
  Achievement, 
  AchievementCategory, 
  AchievementStats, 
  AchievementProgress,
  GameState 
} from '../types/game';
import { achievementService } from '../services/achievementService';

interface AchievementDashboardProps {
  gameState: GameState;
  onClose: () => void;
}

const AchievementDashboard: React.FC<AchievementDashboardProps> = ({ gameState, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'badges'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementProgress, setAchievementProgress] = useState<AchievementProgress[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);

  useEffect(() => {
    setAchievements(achievementService.getAllAchievements());
    setAchievementProgress(gameState.achievements.progress);
    setStats(gameState.achievements.stats);
  }, [gameState]);

  const getFilteredAchievements = () => {
    if (selectedCategory === 'all') return achievements;
    return achievements.filter(a => a.category === selectedCategory);
  };

  const getProgressForAchievement = (achievementId: string) => {
    return achievementProgress.find(p => p.achievementId === achievementId);
  };

  const isAchievementUnlocked = (achievementId: string) => {
    return gameState.achievements.unlocked.some(ua => ua.achievementId === achievementId);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'uncommon': return 'text-green-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bronze': return 'bg-amber-100 text-amber-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      case 'special': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Total Points</h3>
          <p className="text-2xl font-bold text-blue-600">{stats?.totalPoints || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Achievements</h3>
          <p className="text-2xl font-bold text-green-600">
            {stats?.achievementsUnlocked || 0} / {stats?.achievementsAvailable || 0}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800">Badges</h3>
          <p className="text-2xl font-bold text-purple-600">{gameState.badges.length}</p>
        </div>
      </div>

      {stats && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold mb-4">Achievement Progress by Category</h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryProgress).map(([category, progress]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="capitalize font-medium">{category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${progress.total > 0 ? (progress.unlocked / progress.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {progress.unlocked}/{progress.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats && stats.recentUnlocks.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold mb-4">Recent Achievements</h3>
          <div className="space-y-2">
            {stats.recentUnlocks.map((unlock, index) => {
              const achievement = achievements.find(a => a.id === unlock.achievementId);
              return (
                <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                  <span className="text-2xl">{achievement?.icon}</span>
                  <div>
                    <p className="font-medium">{achievement?.name}</p>
                    <p className="text-sm text-gray-600">
                      Unlocked at age {unlock.gameAge}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded text-sm ${
            selectedCategory === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {(['family', 'individual', 'sibling', 'parenting', 'milestone', 'financial', 'social'] as AchievementCategory[]).map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded text-sm capitalize ${
              selectedCategory === category 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {getFilteredAchievements().map(achievement => {
          const progress = getProgressForAchievement(achievement.id);
          const isUnlocked = isAchievementUnlocked(achievement.id);
          const isHidden = achievement.hidden && !isUnlocked;
          
          if (isHidden) return null;

          return (
            <div 
              key={achievement.id} 
              className={`p-4 rounded-lg border ${
                isUnlocked 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className={`text-2xl ${isUnlocked ? '' : 'opacity-50'}`}>
                    {achievement.icon}
                  </span>
                  <div>
                    <h4 className={`font-semibold ${isUnlocked ? 'text-green-800' : 'text-gray-800'}`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${isUnlocked ? 'text-green-600' : 'text-gray-600'}`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`px-2 py-1 rounded text-xs ${getTypeColor(achievement.type)}`}>
                    {achievement.type}
                  </span>
                  <span className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity}
                  </span>
                </div>
              </div>
              
              {progress && !isUnlocked && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${progress.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {achievement.points} points
                </span>
                {isUnlocked && (
                  <span className="text-sm text-green-600 font-medium">
                    ✓ Unlocked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderBadges = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gameState.badges.map(badge => (
          <div key={badge.id} className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <h4 className="font-semibold">{badge.name}</h4>
                <p className="text-sm text-gray-600">{badge.description}</p>
              </div>
            </div>
            {badge.unlockedAt && (
              <p className="text-xs text-gray-500 mt-2">
                Unlocked: {badge.unlockedAt.toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
      
      {gameState.badges.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No badges earned yet. Keep playing to unlock your first badge!</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Achievements & Badges</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded ${
                activeTab === 'overview' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-4 py-2 rounded ${
                activeTab === 'achievements' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Achievements
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-4 py-2 rounded ${
                activeTab === 'badges' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Badges
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'achievements' && renderAchievements()}
          {activeTab === 'badges' && renderBadges()}
        </div>
      </div>
    </div>
  );
};

export default AchievementDashboard;