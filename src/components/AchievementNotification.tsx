import React, { useState, useEffect } from 'react';
import { Achievement, UnlockedAchievement } from '../types/game';
import { achievementService } from '../services/achievementService';

interface AchievementNotificationProps {
  unlockedAchievement: UnlockedAchievement;
  onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ 
  unlockedAchievement, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [achievement, setAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const achievementData = achievementService.getAchievementById(unlockedAchievement.achievementId);
    setAchievement(achievementData || null);
    
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [unlockedAchievement.achievementId, onClose]);

  if (!achievement) return null;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50';
      case 'uncommon': return 'border-green-400 bg-green-50';
      case 'rare': return 'border-blue-400 bg-blue-50';
      case 'epic': return 'border-purple-400 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-400 bg-gray-50';
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

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className={`p-4 rounded-lg border-2 shadow-lg max-w-sm ${getRarityColor(achievement.rarity)}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-3">
            <span className="text-3xl animate-bounce">{achievement.icon}</span>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
                <span className={`px-2 py-1 rounded text-xs ${getTypeColor(achievement.type)}`}>
                  {achievement.type}
                </span>
              </div>
              <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
              <p className="text-sm text-gray-600">{achievement.description}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          >
            ×
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">
            +{achievement.points} points
          </span>
          <span className="text-xs text-gray-500 capitalize">
            {achievement.rarity}
          </span>
        </div>
      </div>
    </div>
  );
};

interface AchievementNotificationManagerProps {
  newUnlocks: UnlockedAchievement[];
  onClearNotifications: () => void;
}

export const AchievementNotificationManager: React.FC<AchievementNotificationManagerProps> = ({
  newUnlocks,
  onClearNotifications
}) => {
  const [activeNotifications, setActiveNotifications] = useState<UnlockedAchievement[]>([]);

  useEffect(() => {
    if (newUnlocks.length > 0) {
      setActiveNotifications(prev => [...prev, ...newUnlocks]);
    }
  }, [newUnlocks]);

  const handleCloseNotification = (achievementId: string) => {
    setActiveNotifications(prev => 
      prev.filter(unlock => unlock.achievementId !== achievementId)
    );
    
    // If no more notifications, clear the parent state
    if (activeNotifications.length === 1) {
      onClearNotifications();
    }
  };

  return (
    <>
      {activeNotifications.map((unlock, index) => (
        <div 
          key={unlock.achievementId} 
          style={{ top: `${1 + index * 1.5}rem` }}
          className="fixed right-4 z-50"
        >
          <AchievementNotification
            unlockedAchievement={unlock}
            onClose={() => handleCloseNotification(unlock.achievementId)}
          />
        </div>
      ))}
    </>
  );
};

export default AchievementNotification;