import React, { useState, useMemo } from 'react';
import { GameState } from '../types/game';
import { 
  AnalyticsService, 
  ChildOutcomeAnalysis
} from '../services/analyticsService';

interface StatisticsDashboardProps {
  gameState: GameState;
}

export const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({ gameState }) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'children' | 'decisions' | 'comparisons'>('overview');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  
  const analytics = useMemo(() => {
    const familyAnalysis = AnalyticsService.analyzeFamilyOutcome(gameState);
    const childAnalyses = Object.keys(gameState.children).map(childId => 
      AnalyticsService.analyzeChildOutcome(gameState, childId)
    ).filter(analysis => analysis !== null) as ChildOutcomeAnalysis[];
    const decisionPatterns = AnalyticsService.analyzeDecisionPatterns(gameState);
    const crossChildComparison = AnalyticsService.generateCrossChildComparison(gameState);
    
    return {
      familyAnalysis,
      childAnalyses,
      decisionPatterns,
      crossChildComparison
    };
  }, [gameState]);

  const OverviewPanel = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Family Performance Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Math.round(analytics.familyAnalysis.averageDevelopmentScore)}
            </div>
            <div className="text-sm text-gray-600">Average Development Score</div>
            <div className="text-xs text-gray-500 mt-1">
              {analytics.familyAnalysis.averageDevelopmentScore >= 70 ? 'Excellent' :
               analytics.familyAnalysis.averageDevelopmentScore >= 60 ? 'Good' :
               analytics.familyAnalysis.averageDevelopmentScore >= 50 ? 'Fair' : 'Needs Attention'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Math.round(analytics.familyAnalysis.familyHappiness)}
            </div>
            <div className="text-sm text-gray-600">Family Happiness</div>
            <div className="text-xs text-gray-500 mt-1">
              {analytics.familyAnalysis.familyHappiness >= 70 ? 'Very Happy' :
               analytics.familyAnalysis.familyHappiness >= 50 ? 'Content' : 'Struggling'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.round(analytics.familyAnalysis.familyStability)}
            </div>
            <div className="text-sm text-gray-600">Family Stability</div>
            <div className="text-xs text-gray-500 mt-1">
              {analytics.familyAnalysis.familyStability >= 70 ? 'Very Stable' :
               analytics.familyAnalysis.familyStability >= 50 ? 'Stable' : 'Unstable'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Top Performer</h4>
            {analytics.familyAnalysis.highestAchiever ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="font-medium text-green-800">
                  {analytics.familyAnalysis.highestAchiever.name}
                </div>
                <div className="text-sm text-green-600">
                  Score: {Math.round(analytics.familyAnalysis.highestAchiever.overallDevelopmentScore)}/100
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {analytics.familyAnalysis.highestAchiever.strongestTraits.slice(0, 2).map(trait => trait.name).join(', ')}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No children to analyze yet</div>
            )}
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Needs Attention</h4>
            {analytics.familyAnalysis.mostChallenged ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="font-medium text-yellow-800">
                  {analytics.familyAnalysis.mostChallenged.name}
                </div>
                <div className="text-sm text-yellow-600">
                  Score: {Math.round(analytics.familyAnalysis.mostChallenged.overallDevelopmentScore)}/100
                </div>
                <div className="text-xs text-yellow-600 mt-1">
                  Focus areas: {analytics.crossChildComparison.developmentComparison
                    .find(child => child.childId === analytics.familyAnalysis.mostChallenged?.childId)
                    ?.recommendedFocus.slice(0, 2).join(', ') || 'General development'}
                </div>
              </div>
            ) : (
              <div className="text-gray-500">All children performing well</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Parenting Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700">
              {analytics.familyAnalysis.parentingStyle}
            </div>
            <div className="text-sm text-gray-600">Parenting Style</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700">
              {analytics.familyAnalysis.consistencyScore}/100
            </div>
            <div className="text-sm text-gray-600">Consistency Score</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700">
              {analytics.familyAnalysis.riskTolerance}
            </div>
            <div className="text-sm text-gray-600">Risk Tolerance</div>
          </div>
        </div>
      </div>
    </div>
  );

  const ChildrenPanel = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Individual Child Analysis</h3>
        
        <div className="grid gap-6">
          {analytics.childAnalyses.map(analysis => (
            <div 
              key={analysis.childId}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedChildId === analysis.childId 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedChildId(selectedChildId === analysis.childId ? null : analysis.childId)}
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="font-bold text-gray-800">{analysis.name}</h4>
                  <p className="text-sm text-gray-600">Age {analysis.age}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(analysis.overallDevelopmentScore)}
                  </div>
                  <div className="text-xs text-gray-500">Overall Score</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">Personality</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${analysis.personalityScore}%` }}
                    />
                  </div>
                  <div className="text-xs font-medium mt-1">{Math.round(analysis.personalityScore)}/100</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Skills</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${analysis.skillsScore}%` }}
                    />
                  </div>
                  <div className="text-xs font-medium mt-1">{Math.round(analysis.skillsScore)}/100</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Relationships</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${analysis.relationshipsScore}%` }}
                    />
                  </div>
                  <div className="text-xs font-medium mt-1">{Math.round(analysis.relationshipsScore)}/100</div>
                </div>
              </div>
              
              {selectedChildId === analysis.childId && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">Strengths</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {analysis.strongestTraits.map(trait => (
                          <li key={trait.id}>• {trait.name} ({trait.value}/100)</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">Top Skills</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {analysis.topSkills.map(skill => (
                          <li key={skill.id}>• {skill.name} (Level {skill.level})</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-semibold text-gray-700 mb-2">Development Progress</h5>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{analysis.milestonesAchieved}</span> of{' '}
                      <span className="font-medium">{analysis.totalMilestones}</span> milestones achieved
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(analysis.milestonesAchieved / analysis.totalMilestones) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DecisionPanel = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Decision Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {analytics.decisionPatterns.totalDecisions}
            </div>
            <div className="text-sm text-gray-600">Total Decisions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {analytics.decisionPatterns.happinessImpact.positive}
            </div>
            <div className="text-sm text-gray-600">Positive Outcomes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {analytics.decisionPatterns.happinessImpact.negative}
            </div>
            <div className="text-sm text-gray-600">Negative Outcomes</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Financial Impact</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Money Gained:</span>
                <span className="text-sm font-medium text-green-600">
                  ${analytics.decisionPatterns.financialImpact.gained.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Money Spent:</span>
                <span className="text-sm font-medium text-red-600">
                  ${analytics.decisionPatterns.financialImpact.spent.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm font-semibold text-gray-700">Net Change:</span>
                <span className={`text-sm font-bold ${
                  analytics.decisionPatterns.financialImpact.netChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${analytics.decisionPatterns.financialImpact.netChange.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Development Impact</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Traits Improved:</span>
                <span className="text-sm font-medium text-blue-600">
                  {analytics.decisionPatterns.developmentImpact.traitsImproved}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Skills Gained:</span>
                <span className="text-sm font-medium text-purple-600">
                  {analytics.decisionPatterns.developmentImpact.skillsGained}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Relationships Improved:</span>
                <span className="text-sm font-medium text-green-600">
                  {analytics.decisionPatterns.developmentImpact.relationshipsStrengthened}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Decision Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Most Frequent Decision Types</h4>
            <ul className="space-y-2">
              {analytics.decisionPatterns.mostFrequentDecisionTypes.map((type, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">{type}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Best Decisions</h4>
            <div className="space-y-2">
              {analytics.decisionPatterns.bestDecisions.slice(0, 3).map((decision, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded p-2">
                  <div className="text-sm font-medium text-green-800">{decision.choice}</div>
                  <div className="text-xs text-green-600">
                    +{decision.effects.happiness} happiness, ${decision.effects.finances.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ComparisonsPanel = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Child Development Comparison</h3>
        
        <div className="space-y-4">
          {analytics.crossChildComparison.developmentComparison.map(child => (
            <div key={child.childId} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">{child.name}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-green-700 mb-2">Strengths</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {child.strengths.map((strength, index) => (
                      <li key={index}>• {strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-red-700 mb-2">Areas for Improvement</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {child.weaknesses.map((weakness, index) => (
                      <li key={index}>• {weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {child.recommendedFocus.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h5 className="font-medium text-blue-700 mb-2">Recommended Focus Areas</h5>
                  <div className="flex flex-wrap gap-2">
                    {child.recommendedFocus.map((focus, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Family Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Sibling Dynamics</h4>
            <div className="space-y-2">
              {analytics.crossChildComparison.siblingDynamicsInsights.map((insight, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-blue-800">{insight}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Recommendations</h4>
            <div className="space-y-2">
              {analytics.crossChildComparison.familyBalanceRecommendations.map((recommendation, index) => (
                <div key={index} className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-sm text-yellow-800">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedView('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === 'overview' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedView('children')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === 'children' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Children Analysis
          </button>
          <button
            onClick={() => setSelectedView('decisions')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === 'decisions' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Decision Patterns
          </button>
          <button
            onClick={() => setSelectedView('comparisons')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === 'comparisons' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Comparisons
          </button>
        </div>
      </div>

      {/* Content */}
      {selectedView === 'overview' && <OverviewPanel />}
      {selectedView === 'children' && <ChildrenPanel />}
      {selectedView === 'decisions' && <DecisionPanel />}
      {selectedView === 'comparisons' && <ComparisonsPanel />}
    </div>
  );
};