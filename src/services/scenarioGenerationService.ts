import { 
  Scenario, 
  ScenarioOption, 
  ChildCharacter, 
  GameStyle, 
  GameState,
  PersonalityTrait,
  Skill,
  FamilyDynamics
} from '../types/game';
import { getFamilyScenario, getChildBirthScenario } from '../data/familyScenarios';
import { PeerInteractionService, PeerCharacter } from './peerInteractionService';
import { TranslationService } from './translationService';

export class ScenarioGenerationService {
  
  // Trait thresholds for triggering specific scenarios
  private static readonly TRAIT_THRESHOLDS = {
    HIGH: 75,
    MEDIUM: 50,
    LOW: 25
  };

  // Age-appropriate trait scenario mapping - now using translation keys
  private static readonly TRAIT_SCENARIO_MAPPING = {
    'curiosity': {
      minAge: 3,
      scenarios: {
        'Realistic': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_endless_questions_title',
            templateKey: 'scenario_endless_questions_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_lack_of_interest_title',
            templateKey: 'scenario_lack_of_interest_desc'
          }
        ],
        'Fantasy': [
          {
            trigger: 'HIGH', 
            titleKey: 'scenario_magical_discovery_title',
            templateKey: 'scenario_magical_discovery_desc'
          }
        ],
        'Thrilling': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_dangerous_investigation_title',
            templateKey: 'scenario_dangerous_investigation_desc'
          }
        ]
      }
    },
    'creativity': {
      minAge: 2,
      scenarios: {
        'Realistic': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_artistic_expression_title',
            templateKey: 'scenario_artistic_expression_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_creative_block_title',
            templateKey: 'scenario_creative_block_desc'
          }
        ],
        'Fantasy': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_reality_bending_title',
            templateKey: 'scenario_reality_bending_desc'
          }
        ]
      }
    },
    'empathy': {
      minAge: 3,
      scenarios: {
        'Realistic': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_compassionate_helper_title',
            templateKey: 'scenario_compassionate_helper_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_emotional_distance_title',
            templateKey: 'scenario_emotional_distance_desc'
          }
        ]
      }
    },
    'independence': {
      minAge: 4,
      scenarios: {
        'Realistic': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_self_reliant_child_title',
            templateKey: 'scenario_self_reliant_child_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_dependent_behavior_title',
            templateKey: 'scenario_dependent_behavior_desc'
          }
        ]
      }
    },
    'confidence': {
      minAge: 3,
      scenarios: {
        'Realistic': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_natural_leader_title',
            templateKey: 'scenario_natural_leader_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_shy_withdrawn_title',
            templateKey: 'scenario_shy_withdrawn_desc'
          }
        ]
      }
    },
    'resilience': {
      minAge: 4,
      scenarios: {
        'Realistic': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_bouncing_back_title',
            templateKey: 'scenario_bouncing_back_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_sensitive_setbacks_title',
            templateKey: 'scenario_sensitive_setbacks_desc'
          }
        ],
        'Fantasy': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_magical_resilience_title',
            templateKey: 'scenario_magical_resilience_desc'
          }
        ],
        'Thrilling': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_crisis_survivor_title',
            templateKey: 'scenario_crisis_survivor_desc'
          }
        ]
      }
    },
    'cooperation': {
      minAge: 3,
      scenarios: {
        'Realistic': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_team_player_title',
            templateKey: 'scenario_team_player_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_difficulty_sharing_title',
            templateKey: 'scenario_difficulty_sharing_desc'
          }
        ],
        'Fantasy': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_magical_alliance_title',
            templateKey: 'scenario_magical_alliance_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_lone_wizard_title',
            templateKey: 'scenario_lone_wizard_desc'
          }
        ],
        'Thrilling': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_survival_team_title',
            templateKey: 'scenario_survival_team_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_trust_issues_title',
            templateKey: 'scenario_trust_issues_desc'
          }
        ]
      }
    },
    'focus': {
      minAge: 4,
      scenarios: {
        'Realistic': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_laser_focused_title',
            templateKey: 'scenario_laser_focused_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_easily_distracted_title',
            templateKey: 'scenario_easily_distracted_desc'
          }
        ],
        'Fantasy': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_mind_mastery_title',
            templateKey: 'scenario_mind_mastery_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_scattered_magic_title',
            templateKey: 'scenario_scattered_magic_desc'
          }
        ],
        'Thrilling': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_mission_focus_title',
            templateKey: 'scenario_mission_focus_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_dangerous_distractions_title',
            templateKey: 'scenario_dangerous_distractions_desc'
          }
        ]
      }
    },
    'compassion': {
      minAge: 3,
      scenarios: {
        'Realistic': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_little_caregiver_title',
            templateKey: 'scenario_little_caregiver_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_self_centered_title',
            templateKey: 'scenario_self_centered_desc'
          }
        ],
        'Fantasy': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_healing_heart_title',
            templateKey: 'scenario_healing_heart_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_cold_heart_title',
            templateKey: 'scenario_cold_heart_desc'
          }
        ],
        'Thrilling': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_mercy_mission_title',
            templateKey: 'scenario_mercy_mission_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_ruthless_survivor_title',
            templateKey: 'scenario_ruthless_survivor_desc'
          }
        ]
      }
    },
    'determination': {
      minAge: 4,
      scenarios: {
        'Realistic': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_never_gives_up_title',
            templateKey: 'scenario_never_gives_up_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_gives_up_easily_title',
            templateKey: 'scenario_gives_up_easily_desc'
          }
        ],
        'Fantasy': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_unbreakable_will_title',
            templateKey: 'scenario_unbreakable_will_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_wavering_spirit_title',
            templateKey: 'scenario_wavering_spirit_desc'
          }
        ],
        'Thrilling': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_against_all_odds_title',
            templateKey: 'scenario_against_all_odds_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_quick_surrender_title',
            templateKey: 'scenario_quick_surrender_desc'
          }
        ]
      }
    },
    'adaptability': {
      minAge: 5,
      scenarios: {
        'Realistic': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_flexible_thinker_title',
            templateKey: 'scenario_flexible_thinker_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_rigid_routine_title',
            templateKey: 'scenario_rigid_routine_desc'
          }
        ],
        'Fantasy': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_shape_shifter_title',
            templateKey: 'scenario_shape_shifter_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_magic_resistance_title',
            templateKey: 'scenario_magic_resistance_desc'
          }
        ],
        'Thrilling': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_survival_adaptability_title',
            templateKey: 'scenario_survival_adaptability_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_change_anxiety_title',
            templateKey: 'scenario_change_anxiety_desc'
          }
        ]
      }
    },
    'humor': {
      minAge: 3,
      scenarios: {
        'Realistic': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_class_clown_title',
            templateKey: 'scenario_class_clown_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_serious_child_title',
            templateKey: 'scenario_serious_child_desc'
          }
        ],
        'Fantasy': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_magical_jester_title',
            templateKey: 'scenario_magical_jester_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_grim_prophecy_title',
            templateKey: 'scenario_grim_prophecy_desc'
          }
        ],
        'Thrilling': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_survival_comedian_title',
            templateKey: 'scenario_survival_comedian_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_humorless_survivor_title',
            templateKey: 'scenario_humorless_survivor_desc'
          }
        ]
      }
    },
    'patience': {
      minAge: 2,
      scenarios: {
        'Realistic': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_calm_observer_title',
            templateKey: 'scenario_calm_observer_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_instant_gratification_title',
            templateKey: 'scenario_instant_gratification_desc'
          }
        ],
        'Fantasy': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_time_master_title',
            templateKey: 'scenario_time_master_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_chaos_magic_title',
            templateKey: 'scenario_chaos_magic_desc'
          }
        ],
        'Thrilling': [
          {
            trigger: 'HIGH',
            titleKey: 'scenario_strategic_survivor_title',
            templateKey: 'scenario_strategic_survivor_desc'
          },
          {
            trigger: 'LOW',
            titleKey: 'scenario_reckless_impulse_title',
            templateKey: 'scenario_reckless_impulse_desc'
          }
        ]
      }
    }
  };

  // Skill-based scenario triggers - now using translation keys
  private static readonly SKILL_SCENARIO_MAPPING = {
    'reading': {
      scenarios: {
        'Realistic': [
          {
            trigger: 'ADVANCED', // level 7+ for age
            titleKey: 'scenario_gifted_reader_title',
            templateKey: 'scenario_gifted_reader_desc'
          },
          {
            trigger: 'STRUGGLING', // level 3- for age
            titleKey: 'scenario_reading_difficulties_title',
            templateKey: 'scenario_reading_difficulties_desc'
          }
        ]
      }
    },
    'math': {
      scenarios: {
        'Realistic': [
          {
            trigger: 'ADVANCED',
            titleKey: 'scenario_mathematical_prodigy_title',
            templateKey: 'scenario_mathematical_prodigy_desc'
          }
        ]
      }
    }
  };

  // Complex moral dilemma scenarios for ages 8-12 with nuanced psychological consequences
  private static readonly COMPLEX_MORAL_SCENARIOS = {
    'friendship_betrayal': {
      minAge: 8,
      maxAge: 12,
      scenarios: {
        'Realistic': {
          titleKey: 'scenario_friendship_betrayal_title',
          templateKey: 'scenario_friendship_betrayal_desc',
          options: [
            {
              labelKey: 'option_confront_friend',
              consequenceKey: 'consequence_direct_confrontation',
              effects: {
                happiness: 5,
                finances: 0,
                traits: { 'courage': 8, 'empathy': -3, 'confidence': 5 },
                relationships: { 'friendship': { trust: -10, communication: 12 } },
                psychology: { 'assertiveness': 10, 'emotional_regulation': 5 }
              }
            },
            {
              labelKey: 'option_forgive_silently',
              consequenceKey: 'consequence_silent_forgiveness',
              effects: {
                happiness: -5,
                finances: 0,
                traits: { 'empathy': 10, 'resilience': 5, 'confidence': -5 },
                relationships: { 'friendship': { trust: 3, quality: 8 } },
                psychology: { 'people_pleasing': 8, 'self_advocacy': -5 }
              }
            },
            {
              labelKey: 'option_seek_adult_guidance',
              consequenceKey: 'consequence_adult_mediation',
              effects: {
                happiness: 10,
                finances: 0,
                traits: { 'wisdom': 8, 'independence': -3, 'cooperation': 6 },
                relationships: { 'parent-child': { trust: 8, communication: 10 } },
                psychology: { 'problem_solving': 12, 'authority_trust': 6 }
              }
            },
            {
              labelKey: 'option_gradual_distance',
              consequenceKey: 'consequence_relationship_boundaries',
              effects: {
                happiness: 0,
                finances: 0,
                traits: { 'independence': 8, 'empathy': 3, 'wisdom': 5 },
                relationships: { 'friendship': { quality: -5, trust: 0 } },
                psychology: { 'boundary_setting': 10, 'social_navigation': 8 }
              }
            },
            {
              labelKey: 'option_group_intervention',
              consequenceKey: 'consequence_peer_mediation',
              effects: {
                happiness: 8,
                finances: 0,
                traits: { 'cooperation': 10, 'leadership': 6, 'empathy': 5 },
                relationships: { 'peer_group': { trust: 5, communication: 8 } },
                psychology: { 'social_leadership': 10, 'conflict_resolution': 12 }
              }
            }
          ]
        },
        'Fantasy': {
          titleKey: 'scenario_magical_oath_dilemma_title',
          templateKey: 'scenario_magical_oath_dilemma_desc',
          options: [
            {
              labelKey: 'option_honor_magical_oath',
              consequenceKey: 'consequence_magical_loyalty',
              effects: {
                happiness: 15,
                finances: 0,
                traits: { 'loyalty': 12, 'wisdom': 8, 'independence': -5 },
                relationships: { 'magical_friend': { trust: 20, bond: 15 } },
                psychology: { 'moral_integrity': 15, 'magical_empathy': 10 }
              }
            },
            {
              labelKey: 'option_break_oath_for_greater_good',
              consequenceKey: 'consequence_utilitarian_choice',
              effects: {
                happiness: -10,
                finances: 0,
                traits: { 'wisdom': 15, 'compassion': 10, 'guilt': 8 },
                relationships: { 'magical_friend': { trust: -15, understanding: 5 } },
                psychology: { 'moral_complexity': 12, 'ethical_reasoning': 15 }
              }
            }
          ]
        }
      }
    },
    'academic_pressure': {
      minAge: 9,
      maxAge: 12,
      scenarios: {
        'Realistic': {
          titleKey: 'scenario_academic_pressure_title',
          templateKey: 'scenario_academic_pressure_desc',
          options: [
            {
              labelKey: 'option_maintain_high_standards',
              consequenceKey: 'consequence_perfectionist_path',
              effects: {
                happiness: -8,
                finances: -3000,
                traits: { 'determination': 10, 'perfectionism': 12, 'anxiety': 8 },
                relationships: { 'parent-child': { pressure: 10, achievement_bond: 8 } },
                psychology: { 'performance_pressure': 15, 'self_worth_achievement': 10 }
              }
            },
            {
              labelKey: 'option_balanced_approach',
              consequenceKey: 'consequence_holistic_development',
              effects: {
                happiness: 12,
                finances: -1500,
                traits: { 'balance': 10, 'resilience': 8, 'social_skills': 6 },
                relationships: { 'parent-child': { understanding: 12, communication: 10 } },
                psychology: { 'emotional_intelligence': 12, 'stress_management': 10 }
              }
            },
            {
              labelKey: 'option_prioritize_wellbeing',
              consequenceKey: 'consequence_mental_health_focus',
              effects: {
                happiness: 15,
                finances: -2000,
                traits: { 'self_care': 15, 'confidence': 8, 'academic_drive': -5 },
                relationships: { 'parent-child': { trust: 15, emotional_support: 12 } },
                psychology: { 'self_advocacy': 12, 'mental_health_awareness': 15 }
              }
            },
            {
              labelKey: 'option_peer_comparison',
              consequenceKey: 'consequence_competitive_mindset',
              effects: {
                happiness: 5,
                finances: -2500,
                traits: { 'competitiveness': 12, 'comparison_habit': 10, 'confidence': 3 },
                relationships: { 'peer_group': { rivalry: 8, motivation: 5 } },
                psychology: { 'external_validation': 10, 'social_comparison': 12 }
              }
            }
          ]
        }
      }
    },
    'family_secret': {
      minAge: 10,
      maxAge: 12,
      scenarios: {
        'Realistic': {
          titleKey: 'scenario_family_secret_title',
          templateKey: 'scenario_family_secret_desc',
          options: [
            {
              labelKey: 'option_keep_family_secret',
              consequenceKey: 'consequence_loyalty_burden',
              effects: {
                happiness: -10,
                finances: 0,
                traits: { 'loyalty': 10, 'burden_carrying': 12, 'independence': -5 },
                relationships: { 'family': { trust: 15, emotional_distance: 8 } },
                psychology: { 'secret_keeping': 15, 'family_loyalty': 12, 'emotional_burden': 10 }
              }
            },
            {
              labelKey: 'option_confide_in_trusted_friend',
              consequenceKey: 'consequence_selective_sharing',
              effects: {
                happiness: 8,
                finances: 0,
                traits: { 'trust_building': 10, 'vulnerability': 8, 'discretion': 5 },
                relationships: { 'friendship': { trust: 12, intimacy: 10 } },
                psychology: { 'emotional_sharing': 12, 'support_seeking': 10 }
              }
            },
            {
              labelKey: 'option_family_discussion',
              consequenceKey: 'consequence_family_dialogue',
              effects: {
                happiness: 15,
                finances: 0,
                traits: { 'courage': 12, 'communication': 10, 'family_cohesion': 8 },
                relationships: { 'family': { communication: 15, trust: 8, understanding: 12 } },
                psychology: { 'family_systems': 15, 'emotional_maturity': 12 }
              }
            },
            {
              labelKey: 'option_seek_counseling',
              consequenceKey: 'consequence_professional_support',
              effects: {
                happiness: 12,
                finances: -4000,
                traits: { 'help_seeking': 15, 'emotional_intelligence': 10, 'resilience': 8 },
                relationships: { 'family': { healing: 12, professional_mediation: 10 } },
                psychology: { 'therapy_skills': 15, 'emotional_processing': 12 }
              }
            }
          ]
        }
      }
    },
    'identity_crisis': {
      minAge: 13,
      maxAge: 16,
      scenarios: {
        'Realistic': {
          titleKey: 'scenario_identity_crisis_title',
          templateKey: 'scenario_identity_crisis_desc',
          options: [
            {
              labelKey: 'option_explore_different_identities',
              consequenceKey: 'consequence_identity_exploration',
              effects: {
                happiness: 8,
                finances: -2000,
                traits: { 'self_discovery': 12, 'confidence': -3, 'authenticity': 8 },
                relationships: { 'peer_group': { acceptance: 5, diversity: 10 } },
                psychology: { 'identity_formation': 15, 'self_acceptance': 8, 'social_experimentation': 12 }
              }
            },
            {
              labelKey: 'option_maintain_stable_identity',
              consequenceKey: 'consequence_identity_stability',
              effects: {
                happiness: 5,
                finances: -500,
                traits: { 'consistency': 10, 'confidence': 8, 'authenticity': -3 },
                relationships: { 'family': { stability: 12, expectations: 8 } },
                psychology: { 'identity_rigidity': 8, 'family_approval': 10, 'self_suppression': 5 }
              }
            },
            {
              labelKey: 'option_seek_professional_identity_guidance',
              consequenceKey: 'consequence_identity_counseling',
              effects: {
                happiness: 12,
                finances: -4000,
                traits: { 'self_awareness': 15, 'emotional_intelligence': 10, 'confidence': 8 },
                relationships: { 'family': { understanding: 12, communication: 10 } },
                psychology: { 'therapeutic_insight': 15, 'identity_clarity': 12, 'emotional_processing': 10 }
              }
            },
            {
              labelKey: 'option_family_identity_discussions',
              consequenceKey: 'consequence_family_identity_support',
              effects: {
                happiness: 15,
                finances: -1000,
                traits: { 'family_connection': 12, 'authenticity': 10, 'confidence': 8 },
                relationships: { 'family': { trust: 15, understanding: 12, acceptance: 10 } },
                psychology: { 'family_support': 15, 'identity_validation': 12, 'intergenerational_understanding': 10 }
              }
            },
            {
              labelKey: 'option_peer_identity_validation',
              consequenceKey: 'consequence_peer_identity_influence',
              effects: {
                happiness: 10,
                finances: -1500,
                traits: { 'peer_conformity': 10, 'social_acceptance': 12, 'authenticity': -5 },
                relationships: { 'peer_group': { 'belonging': 15, 'influence': 12 } },
                psychology: { 'external_validation': 12, 'peer_pressure': 8, 'social_identity': 10 }
              }
            }
          ]
        }
      }
    },
    'peer_pressure_dilemma': {
      minAge: 14,
      maxAge: 17,
      scenarios: {
        'Realistic': {
          titleKey: 'scenario_peer_pressure_title',
          templateKey: 'scenario_peer_pressure_desc',
          options: [
            {
              labelKey: 'option_resist_peer_pressure',
              consequenceKey: 'consequence_moral_independence',
              effects: {
                happiness: 5,
                finances: 0,
                traits: { 'moral_courage': 15, 'independence': 12, 'social_confidence': -5 },
                relationships: { 'peer_group': { respect: 8, distance: 5 }, 'family': { trust: 12, pride: 10 } },
                psychology: { 'moral_integrity': 15, 'self_advocacy': 12, 'social_isolation_risk': 8 }
              }
            },
            {
              labelKey: 'option_compromise_values',
              consequenceKey: 'consequence_social_acceptance',
              effects: {
                happiness: 8,
                finances: -1000,
                traits: { 'social_acceptance': 12, 'moral_flexibility': 8, 'authenticity': -8 },
                relationships: { 'peer_group': { belonging: 12, influence: 10 } },
                psychology: { 'moral_compromise': 10, 'peer_approval': 12, 'internal_conflict': 8 }
              }
            },
            {
              labelKey: 'option_find_alternative_peer_group',
              consequenceKey: 'consequence_new_social_circles',
              effects: {
                happiness: 12,
                finances: -2000,
                traits: { 'social_courage': 12, 'authenticity': 10, 'adaptability': 8 },
                relationships: { 'new_peers': { alignment: 15, support: 12 } },
                psychology: { 'social_reinvention': 12, 'value_alignment': 15, 'relationship_building': 10 }
              }
            },
            {
              labelKey: 'option_educate_peers',
              consequenceKey: 'consequence_peer_leadership',
              effects: {
                happiness: 10,
                finances: -500,
                traits: { 'leadership': 15, 'communication': 12, 'moral_courage': 10 },
                relationships: { 'peer_group': { influence: 12, respect: 10, transformation: 8 } },
                psychology: { 'moral_leadership': 15, 'social_influence': 12, 'advocacy_skills': 10 }
              }
            }
          ]
        }
      }
    },
    'first_romantic_relationship': {
      minAge: 15,
      maxAge: 18,
      scenarios: {
        'Realistic': {
          titleKey: 'scenario_first_romance_title',
          templateKey: 'scenario_first_romance_desc',
          options: [
            {
              labelKey: 'option_take_relationship_slow',
              consequenceKey: 'consequence_healthy_pacing',
              effects: {
                happiness: 12,
                finances: -1000,
                traits: { 'emotional_maturity': 12, 'self_respect': 10, 'patience': 8 },
                relationships: { 'romantic': { depth: 12, respect: 15, communication: 10 } },
                psychology: { 'healthy_boundaries': 15, 'emotional_intelligence': 12, 'relationship_skills': 10 }
              }
            },
            {
              labelKey: 'option_intense_relationship_commitment',
              consequenceKey: 'consequence_relationship_intensity',
              effects: {
                happiness: 15,
                finances: -2500,
                traits: { 'passion': 15, 'commitment': 12, 'independence': -8 },
                relationships: { 'romantic': { intensity: 15, codependency_risk: 10 }, 'family': { concern: 8 } },
                psychology: { 'romantic_idealization': 12, 'identity_fusion': 10, 'emotional_dependency': 8 }
              }
            },
            {
              labelKey: 'option_maintain_independence',
              consequenceKey: 'consequence_balanced_relationship',
              effects: {
                happiness: 10,
                finances: -1500,
                traits: { 'independence': 12, 'balance': 10, 'self_confidence': 8 },
                relationships: { 'romantic': { respect: 12, space: 10 }, 'friendships': { maintenance: 12 } },
                psychology: { 'healthy_autonomy': 15, 'relationship_balance': 12, 'self_preservation': 10 }
              }
            },
            {
              labelKey: 'option_family_guidance_romance',
              consequenceKey: 'consequence_guided_romance',
              effects: {
                happiness: 8,
                finances: -500,
                traits: { 'family_wisdom': 10, 'caution': 8, 'trust_in_family': 12 },
                relationships: { 'family': { 'involvement': 12, 'guidance': 10 }, 'romantic': { 'family_approval': 8 } },
                psychology: { 'intergenerational_wisdom': 12, 'cautious_love': 10, 'family_values': 8 }
              }
            }
          ]
        }
      }
    },
    'college_career_pressure': {
      minAge: 16,
      maxAge: 18,
      scenarios: {
        'Realistic': {
          titleKey: 'scenario_future_planning_title',
          templateKey: 'scenario_future_planning_desc',
          options: [
            {
              labelKey: 'option_follow_passion',
              consequenceKey: 'consequence_passion_pursuit',
              effects: {
                happiness: 15,
                finances: -3000,
                traits: { 'authenticity': 15, 'passion': 12, 'risk_taking': 10 },
                relationships: { 'family': { concern: 8, pride: 5 } },
                psychology: { 'self_actualization': 15, 'intrinsic_motivation': 12, 'life_satisfaction': 10 }
              }
            },
            {
              labelKey: 'option_practical_safe_choice',
              consequenceKey: 'consequence_security_focus',
              effects: {
                happiness: 8,
                finances: 2000,
                traits: { 'practicality': 12, 'security_seeking': 10, 'conformity': 8 },
                relationships: { 'family': { approval: 12, relief: 10 } },
                psychology: { 'external_validation': 10, 'security_orientation': 12, 'passion_suppression': 8 }
              }
            },
            {
              labelKey: 'option_gap_year_exploration',
              consequenceKey: 'consequence_life_exploration',
              effects: {
                happiness: 12,
                finances: -5000,
                traits: { 'self_discovery': 15, 'independence': 12, 'worldliness': 10 },
                relationships: { 'family': { 'initial_resistance': 8, 'eventual_understanding': 10 } },
                psychology: { 'identity_exploration': 15, 'life_experience': 12, 'delayed_gratification': 8 }
              }
            },
            {
              labelKey: 'option_balanced_approach_future',
              consequenceKey: 'consequence_integrated_planning',
              effects: {
                happiness: 10,
                finances: -1000,
                traits: { 'strategic_thinking': 12, 'balance': 10, 'adaptability': 8 },
                relationships: { 'family': { collaboration: 12, mutual_respect: 10 } },
                psychology: { 'integrative_thinking': 15, 'life_planning': 12, 'value_synthesis': 10 }
              }
            }
          ]
        }
      }
    },
    'family_independence_conflict': {
      minAge: 17,
      maxAge: 18,
      scenarios: {
        'Realistic': {
          titleKey: 'scenario_independence_conflict_title',
          templateKey: 'scenario_independence_conflict_desc',
          options: [
            {
              labelKey: 'option_assert_full_independence',
              consequenceKey: 'consequence_independence_assertion',
              effects: {
                happiness: 10,
                finances: -8000,
                traits: { 'independence': 15, 'self_reliance': 12, 'family_tension': 8 },
                relationships: { 'family': { distance: 10, respect: 5, conflict: 8 } },
                psychology: { 'autonomy_development': 15, 'separation_individuation': 12, 'family_guilt': 8 }
              }
            },
            {
              labelKey: 'option_gradual_independence',
              consequenceKey: 'consequence_negotiated_freedom',
              effects: {
                happiness: 12,
                finances: -3000,
                traits: { 'negotiation_skills': 12, 'patience': 10, 'diplomatic': 8 },
                relationships: { 'family': { cooperation: 12, mutual_respect: 10, gradual_trust: 8 } },
                psychology: { 'healthy_separation': 15, 'relationship_preservation': 12, 'conflict_resolution': 10 }
              }
            },
            {
              labelKey: 'option_family_therapy_independence',
              consequenceKey: 'consequence_therapeutic_transition',
              effects: {
                happiness: 15,
                finances: -5000,
                traits: { 'emotional_intelligence': 15, 'communication': 12, 'self_awareness': 10 },
                relationships: { 'family': { understanding: 15, communication: 12, healing: 10 } },
                psychology: { 'family_systems_understanding': 15, 'healthy_boundaries': 12, 'intergenerational_healing': 10 }
              }
            },
            {
              labelKey: 'option_delayed_independence',
              consequenceKey: 'consequence_extended_dependence',
              effects: {
                happiness: 8,
                finances: 2000,
                traits: { 'family_harmony': 10, 'dependence': 8, 'conflict_avoidance': 10 },
                relationships: { 'family': { closeness: 12, enmeshment_risk: 8 } },
                psychology: { 'development_delay': 8, 'family_loyalty': 12, 'autonomy_suppression': 10 }
              }
            }
          ]
        }
      }
    }
  };

  // Generate a scenario based on character traits and context
  static generateScenario(
    age: number,
    gameStyle: GameStyle,
    character: ChildCharacter,
    gameState: GameState,
    availablePeers?: PeerCharacter[]
  ): Scenario {
    
    // First check for family scenarios if multiple children
    const familyScenario = this.checkFamilyScenarios(age, gameStyle, gameState);
    if (familyScenario) {
      return familyScenario;
    }

    // Check for complex moral dilemma scenarios (30% chance for ages 8-12)
    if (age >= 8 && age <= 12 && Math.random() < 0.30) {
      const complexScenario = this.generateComplexMoralScenario(age, gameStyle, character);
      if (complexScenario) {
        return complexScenario;
      }
    }

    // Check for peer-based scenarios (25% chance if peers are available)
    if (availablePeers && availablePeers.length > 0 && Math.random() < 0.25) {
      const peerScenario = PeerInteractionService.generatePeerScenario(character, gameStyle, availablePeers);
      if (peerScenario) {
        return peerScenario;
      }
    }

    // Check for trait-based scenarios
    const traitScenario = this.generateTraitBasedScenario(age, gameStyle, character);
    if (traitScenario) {
      return traitScenario;
    }

    // Check for skill-based scenarios
    const skillScenario = this.generateSkillBasedScenario(age, gameStyle, character);
    if (skillScenario) {
      return skillScenario;
    }

    // Fallback to age-appropriate default scenario
    return this.getDefaultScenario(age, gameStyle);
  }

  // Check if family scenarios should trigger
  private static checkFamilyScenarios(
    age: number,
    gameStyle: GameStyle,
    gameState: GameState
  ): Scenario | null {
    const numberOfChildren = Object.keys(gameState.children).length;
    
    if (numberOfChildren >= 2) {
      return getFamilyScenario(age, gameStyle, numberOfChildren, gameState.familyDynamics.stress);
    }
    
    return null;
  }

  // Generate complex moral dilemma scenarios for ages 8-12
  private static generateComplexMoralScenario(
    age: number,
    gameStyle: GameStyle,
    character: ChildCharacter
  ): Scenario | null {
    
    // Filter scenarios appropriate for age and game style
    const availableScenarios = Object.entries(this.COMPLEX_MORAL_SCENARIOS)
      .filter(([_, scenario]) => 
        age >= scenario.minAge && 
        age <= scenario.maxAge && 
(scenario.scenarios as any)[gameStyle]
      );

    if (availableScenarios.length === 0) {
      return null;
    }

    // Randomly select a scenario
    const [scenarioKey, scenarioData] = availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
    const scenarioTemplate = (scenarioData.scenarios as any)[gameStyle];

    return this.buildComplexMoralScenario(scenarioTemplate, character, age);
  }

  // Build complex moral scenario with multiple options and deep consequences
  private static buildComplexMoralScenario(
    template: any,
    character: ChildCharacter,
    age: number
  ): Scenario {
    
    return {
      title: TranslationService.translate(template.titleKey),
      description: TranslationService.translate(template.templateKey).replace('{childName}', character.name),
      options: template.options.map((option: any) => ({
        label: TranslationService.translate(option.labelKey),
        consequence: TranslationService.translate(option.consequenceKey),
        effects: option.effects
      })),
      customAllowed: true
    };
  }

  // Generate trait-based scenarios
  private static generateTraitBasedScenario(
    age: number,
    gameStyle: GameStyle,
    character: ChildCharacter
  ): Scenario | null {
    
    // Find traits that are significantly high or low
    const significantTraits = character.personalityTraits.filter(trait => {
      const mapping = (this.TRAIT_SCENARIO_MAPPING as any)[trait.id];
      return mapping && 
             age >= mapping.minAge && 
             (trait.value >= this.TRAIT_THRESHOLDS.HIGH || trait.value <= this.TRAIT_THRESHOLDS.LOW);
    });

    // Priority to most extreme traits
    significantTraits.sort((a, b) => {
      const aExtreme = Math.abs(a.value - 50);
      const bExtreme = Math.abs(b.value - 50);
      return bExtreme - aExtreme;
    });

    for (const trait of significantTraits) {
      const mapping = (this.TRAIT_SCENARIO_MAPPING as any)[trait.id];
      const styleScenarios = mapping.scenarios[gameStyle];
      
      if (styleScenarios) {
        const trigger = trait.value >= this.TRAIT_THRESHOLDS.HIGH ? 'HIGH' : 'LOW';
        const scenario = styleScenarios.find((s: any) => s.trigger === trigger);
        
        if (scenario) {
          return this.buildTraitScenario(scenario, trait, character, age);
        }
      }
    }

    return null;
  }

  // Generate skill-based scenarios
  private static generateSkillBasedScenario(
    age: number,
    gameStyle: GameStyle,
    character: ChildCharacter
  ): Scenario | null {
    
    for (const skill of character.skills) {
      const mapping = (this.SKILL_SCENARIO_MAPPING as any)[skill.id];
      if (!mapping) continue;

      const expectedLevel = this.getExpectedSkillLevel(skill.id, age);
      let trigger: string | null = null;

      if (skill.level >= expectedLevel + 3) {
        trigger = 'ADVANCED';
      } else if (skill.level <= Math.max(1, expectedLevel - 2)) {
        trigger = 'STRUGGLING';
      }

      if (trigger) {
        const styleScenarios = mapping.scenarios[gameStyle];
        if (styleScenarios) {
          const scenario = styleScenarios.find((s: any) => s.trigger === trigger);
          if (scenario) {
            return this.buildSkillScenario(scenario, skill, character, age);
          }
        }
      }
    }

    return null;
  }

  // Build a trait-based scenario with appropriate options
  private static buildTraitScenario(
    template: any,
    trait: PersonalityTrait,
    character: ChildCharacter,
    age: number
  ): Scenario {
    
    const isHighTrait = trait.value >= this.TRAIT_THRESHOLDS.HIGH;
    
    return {
      title: TranslationService.translate(template.titleKey),
      description: TranslationService.translate(template.templateKey).replace('{childName}', character.name),
      options: this.generateTraitScenarioOptions(trait, isHighTrait, age),
      customAllowed: true
    };
  }

  // Build a skill-based scenario with appropriate options
  private static buildSkillScenario(
    template: any,
    skill: Skill,
    character: ChildCharacter,
    age: number
  ): Scenario {
    
    return {
      title: TranslationService.translate(template.titleKey),
      description: TranslationService.translate(template.templateKey).replace('{childName}', character.name),
      options: this.generateSkillScenarioOptions(skill, age),
      customAllowed: true
    };
  }

  // Generate options for trait-based scenarios
  private static generateTraitScenarioOptions(
    trait: PersonalityTrait,
    isHighTrait: boolean,
    age: number
  ): ScenarioOption[] {
    
    const traitId = trait.id;
    const baseOptions: ScenarioOption[] = [];
    const traitName = trait.name.toLowerCase();

    if (isHighTrait) {
      // Options for handling high traits
      baseOptions.push({
        label: `A) ${TranslationService.translate('option_encourage_channel').replace('{trait}', traitName)}`,
        consequence: TranslationService.translate('consequence_supporting_natural').replace('{trait}', traitName),
        effects: {
          happiness: 15,
          finances: -2000,
          traits: { [traitId]: 5, 'confidence': 8 },
          relationships: { 'parent-child': { quality: 10, trust: 5 } }
        }
      });

      baseOptions.push({
        label: `B) ${TranslationService.translate('option_set_boundaries').replace('{trait}', traitName)}`,
        consequence: TranslationService.translate('consequence_balanced_approach'),
        effects: {
          happiness: 10,
          finances: -1000,
          traits: { [traitId]: -3, 'cooperation': 5 },
          relationships: { 'parent-child': { communication: 8 } }
        }
      });
    } else {
      // Options for handling low traits
      baseOptions.push({
        label: `A) ${TranslationService.translate('option_actively_develop').replace('{trait}', traitName)}`,
        consequence: TranslationService.translate('consequence_focused_effort'),
        effects: {
          happiness: 5,
          finances: -3000,
          traits: { [traitId]: 12, 'determination': 5 },
          relationships: { 'parent-child': { quality: 8 } }
        }
      });

      baseOptions.push({
        label: `B) ${TranslationService.translate('option_accept_personality')}`,
        consequence: TranslationService.translate('consequence_accepting_nature'),
        effects: {
          happiness: 8,
          finances: 0,
          traits: { 'resilience': 3 },
          relationships: { 'parent-child': { trust: 10 } }
        }
      });
    }

    // Add age-appropriate third option
    if (age >= 6) {
      baseOptions.push({
        label: `C) ${TranslationService.translate('option_seek_guidance')}`,
        consequence: TranslationService.translate('consequence_expert_advice'),
        effects: {
          happiness: 20,
          finances: -5000,
          traits: { [traitId]: isHighTrait ? 3 : 8, 'focus': 5 },
          relationships: { 'parent-child': { communication: 12 } }
        }
      });
    }

    return baseOptions;
  }

  // Generate options for skill-based scenarios with enhanced psychology-based consequences
  private static generateSkillScenarioOptions(skill: Skill, age: number): ScenarioOption[] {
    const isAdvanced = skill.level > this.getExpectedSkillLevel(skill.id, age) + 2;
    const skillName = skill.name.toLowerCase();
    
    if (isAdvanced) {
      return [
        {
          label: `A) ${TranslationService.translate('option_provide_advanced_resources').replace('{skill}', skillName)}`,
          consequence: TranslationService.translate('consequence_challenging_material'),
          effects: {
            happiness: 20,
            finances: -4000,
            skills: { [skill.id]: 15 },
            traits: { 'curiosity': 8, 'confidence': 10 },
            // Enhanced psychology: Advanced skills boost self-efficacy and growth mindset
            relationships: { 'parent-child': { quality: 8, trust: 5 } }
          }
        },
        {
          label: `B) ${TranslationService.translate('option_find_mentor')}`,
          consequence: TranslationService.translate('consequence_expert_guidance'),
          effects: {
            happiness: 25,
            finances: -6000,
            skills: { [skill.id]: 20 },
            traits: { 'confidence': 15, 'focus': 8 },
            // Psychology: Mentorship builds social learning and achievement motivation
            relationships: { 
              'mentor': { quality: 70, trust: 60, communication: 65, lastUpdated: age },
              'parent-child': { quality: 5, communication: 10 }
            }
          }
        },
        {
          label: `C) ${TranslationService.translate('option_self_directed_learning')}`,
          consequence: TranslationService.translate('consequence_builds_independence'),
          effects: {
            happiness: 15,
            finances: -1000,
            skills: { [skill.id]: 8 },
            traits: { 'independence': 12, 'creativity': 5 },
            // Psychology: Autonomy satisfaction increases intrinsic motivation
            relationships: { 'parent-child': { trust: 8 } }
          }
        }
      ];
    } else {
      return [
        {
          label: `A) ${TranslationService.translate('option_extra_support')}`,
          consequence: TranslationService.translate('consequence_gradual_improvement'),
          effects: {
            happiness: 10,
            finances: -3000,
            skills: { [skill.id]: 12 },
            traits: { 'determination': 8, 'resilience': 3 },
            // Psychology: Supportive scaffolding prevents learned helplessness
            relationships: { 'parent-child': { quality: 12, communication: 8 } }
          }
        },
        {
          label: `B) ${TranslationService.translate('option_different_approaches')}`,
          consequence: TranslationService.translate('consequence_alternative_methods'),
          effects: {
            happiness: 15,
            finances: -2000,
            skills: { [skill.id]: 10 },
            traits: { 'creativity': 8, 'confidence': 6, 'adaptability': 5 },
            // Psychology: Multiple learning modalities address different learning styles
            relationships: { 'parent-child': { communication: 10 } }
          }
        },
        {
          label: `C) ${TranslationService.translate('option_focus_strengths')}`,
          consequence: TranslationService.translate('consequence_natural_talents'),
          effects: {
            happiness: 20,
            finances: -1000,
            traits: { 'confidence': 15, 'resilience': 8, 'self_worth': 10 },
            // Psychology: Strength-based approach builds positive self-concept
            relationships: { 'parent-child': { trust: 12 } }
          }
        }
      ];
    }
  }

  // Get expected skill level for age with enhanced developmental psychology considerations
  private static getExpectedSkillLevel(skillId: string, age: number): number {
    // Based on developmental psychology research and typical milestone progression
    const skillAgeMap: { [key: string]: number } = {
      // Cognitive Skills - follow Piaget's stages
      'reading': Math.max(1, Math.floor((age - 3) / 2)), // Emergent literacy starts ~3-4
      'math': Math.max(1, Math.floor((age - 4) / 2)), // Number sense develops ~4-5
      'writing': Math.max(1, Math.floor((age - 5) / 2)), // Fine motor + symbolic thinking
      'problem_solving': Math.max(1, Math.floor((age - 5) / 2)), // Concrete operations ~5-7
      'science': Math.max(1, Math.floor((age - 7) / 2)), // Abstract thinking emerges ~7+
      
      // Creative/Artistic Skills - develop through sensorimotor exploration
      'art': Math.max(1, Math.floor((age - 2) / 2)), // Symbolic representation ~2-3
      'music': Math.max(1, Math.floor((age - 3) / 2.5)), // Rhythm/melody perception
      'creativity': Math.max(1, Math.floor((age - 3) / 2)), // Divergent thinking
      
      // Physical Skills - follow motor development patterns
      'sports': Math.max(1, Math.floor((age - 4) / 2)), // Gross motor coordination
      'cooking': Math.max(1, Math.floor((age - 6) / 2)), // Safety awareness + fine motor
      
      // Social-Emotional Skills - follow attachment and social cognitive theory
      'communication': Math.max(1, Math.floor(age / 3)), // Language acquisition
      'leadership': Math.max(1, Math.floor((age - 8) / 2)), // Social cognition matures
      'teamwork': Math.max(1, Math.floor((age - 6) / 2)), // Cooperative play emerges
      'empathy': Math.max(1, Math.floor((age - 4) / 2.5)), // Theory of mind ~4-5
      'social_skills': Math.max(1, Math.floor((age - 3) / 2)) // Peer interaction skills
    };

    // Cap at level 10 to maintain game balance
    return Math.min(10, skillAgeMap[skillId] || Math.max(1, Math.floor(age / 4)));
  }

  // Fallback default scenario
  private static getDefaultScenario(age: number, gameStyle: GameStyle): Scenario {
    return {
      title: `${TranslationService.translate('scenario_growing_up_title')} (${TranslationService.translate('age')} ${age})`,
      description: TranslationService.translate('scenario_growing_up_desc').replace('{age}', age.toString()),
      options: [
        {
          label: `A) ${TranslationService.translate('option_focus_emotional')}`,
          consequence: TranslationService.translate('consequence_emotional_growth'),
          effects: {
            happiness: 10,
            finances: -1000,
            traits: { 'empathy': 5, 'resilience': 3 }
          }
        },
        {
          label: `B) ${TranslationService.translate('option_encourage_independence')}`,
          consequence: TranslationService.translate('consequence_autonomy_confidence'),
          effects: {
            happiness: 8,
            finances: -500,
            traits: { 'independence': 8, 'confidence': 5 }
          }
        },
        {
          label: `C) ${TranslationService.translate('option_strengthen_bonds')}`,
          consequence: TranslationService.translate('consequence_quality_time'),
          effects: {
            happiness: 12,
            finances: -800,
            relationships: { 'parent-child': { quality: 10, trust: 8, communication: 6 } }
          }
        }
      ],
      customAllowed: true
    };
  }

  // Main interface - maintains compatibility with existing usage
  static getScenario(age: number, gameStyle: GameStyle): Scenario {
    // For backward compatibility, return default scenario when no character context
    return this.getDefaultScenario(age, gameStyle);
  }

  // Enhanced interface with character context and psychology-based adaptations
  static getContextualScenario(
    age: number,
    gameStyle: GameStyle,
    character: ChildCharacter,
    gameState: GameState,
    availablePeers?: PeerCharacter[]
  ): Scenario {
    const scenario = this.generateScenario(age, gameStyle, character, gameState, availablePeers);
    
    // Apply comprehensive psychology-based enhancements
    return this.enhanceScenarioWithAdvancedPsychology(scenario, character, gameState);
  }
  
  // Enhanced scenario options with comprehensive psychology-based consequence modeling
  private static enhanceScenarioWithAdvancedPsychology(
    scenario: Scenario,
    character: ChildCharacter,
    gameState: GameState
  ): Scenario {
    const enhancedOptions = scenario.options.map(option => {
      let enhancedEffects = { ...option.effects };
      
      // Apply trait-based psychology principles
      enhancedEffects = this.applyTraitPsychology(enhancedEffects, character);
      
      // Apply family dynamics impact
      enhancedEffects = this.applyFamilyDynamicsImpact(enhancedEffects, gameState);
      
      // Apply multi-child family effects
      enhancedEffects = this.applyMultiChildEffects(enhancedEffects, character, gameState);
      
      // Apply parenting style influence
      enhancedEffects = this.applyParentingStyleEffects(enhancedEffects, gameState.familyDynamics);
      
      // Apply age-based developmental considerations
      enhancedEffects = this.applyDevelopmentalEffects(enhancedEffects, character.age);
      
      return {
        ...option,
        effects: enhancedEffects
      };
    });
    
    return {
      ...scenario,
      options: enhancedOptions
    };
  }
  
  // Apply trait-based psychological principles
  private static applyTraitPsychology(effects: any, character: ChildCharacter): any {
    const enhancedEffects = { ...effects };
    
    if (enhancedEffects.traits) {
      Object.keys(enhancedEffects.traits).forEach(traitId => {
        const currentTrait = character.personalityTraits.find(t => t.id === traitId);
        if (currentTrait) {
          const currentValue = currentTrait.value;
          const baseEffect = enhancedEffects.traits![traitId];
          
          // Diminishing returns: Higher current values reduce growth rate
          if (currentValue > 75) {
            enhancedEffects.traits![traitId] = Math.ceil(baseEffect * 0.7);
          } else if (currentValue > 50) {
            enhancedEffects.traits![traitId] = Math.ceil(baseEffect * 0.85);
          }
          
          // Compound growth: Very low traits get bonus growth (intervention effect)
          if (currentValue < 25 && baseEffect > 0) {
            enhancedEffects.traits![traitId] = Math.ceil(baseEffect * 1.3);
          }
          
          // Cross-trait influences (psychological trait interactions)
          this.applyTraitInteractions(enhancedEffects, traitId, baseEffect, character);
        }
      });
    }
    
    return enhancedEffects;
  }
  
  // Apply family dynamics impact on decision effectiveness
  private static applyFamilyDynamicsImpact(effects: any, gameState: GameState): any {
    const enhancedEffects = { ...effects };
    const { familyDynamics } = gameState;
    
    // High stress reduces intervention effectiveness
    const stressModifier = Math.max(0.5, 1 - (familyDynamics.stress / 200));
    
    // Low cohesion reduces positive relationship effects
    const cohesionModifier = Math.max(0.7, familyDynamics.cohesion / 100);
    
    // Resource strain affects financial decisions
    const resourceModifier = Math.max(0.6, 1 - (familyDynamics.resourceStrain / 150));
    
    // Apply stress impact
    if (enhancedEffects.happiness) {
      enhancedEffects.happiness = Math.floor(enhancedEffects.happiness * stressModifier);
    }
    
    // Apply cohesion impact on relationships
    if (enhancedEffects.relationships) {
      Object.keys(enhancedEffects.relationships).forEach(relType => {
        const rel = enhancedEffects.relationships![relType];
        if (rel.quality) rel.quality = Math.floor(rel.quality * cohesionModifier);
        if (rel.trust) rel.trust = Math.floor(rel.trust * cohesionModifier);
      });
    }
    
    // Apply resource strain to financial costs
    if (enhancedEffects.finances && enhancedEffects.finances < 0) {
      enhancedEffects.finances = Math.floor(enhancedEffects.finances * resourceModifier);
    }
    
    // Parenting style specific adjustments
    this.applyParentingStyleModifiers(enhancedEffects, familyDynamics);
    
    return enhancedEffects;
  }
  
  // Apply multi-child family specific effects
  private static applyMultiChildEffects(effects: any, character: ChildCharacter, gameState: GameState): any {
    const enhancedEffects = { ...effects };
    const childrenCount = Object.keys(gameState.children).length;
    
    if (childrenCount > 1) {
      // Resource competition effects
      const competitionFactor = Math.max(0.8, 1 - ((childrenCount - 1) * 0.1));
      
      // Financial resources are more strained
      if (enhancedEffects.finances && enhancedEffects.finances < 0) {
        enhancedEffects.finances = Math.floor(enhancedEffects.finances * competitionFactor);
      }
      
      // Attention is divided
      if (enhancedEffects.relationships && enhancedEffects.relationships['parent-child']) {
        const rel = enhancedEffects.relationships['parent-child'];
        if (rel.quality) rel.quality = Math.floor(rel.quality * competitionFactor);
      }
      
      // Add sibling effects for multi-child decisions
      if (!enhancedEffects.siblingEffects) {
        enhancedEffects.siblingEffects = {};
      }
      
      // Generate sibling impact based on decision type
      Object.keys(gameState.children).forEach(siblingId => {
        if (siblingId !== character.id) {
          enhancedEffects.siblingEffects[siblingId] = this.generateSiblingImpact(
            character, gameState.children[siblingId], enhancedEffects
          );
        }
      });
      
      // Family dynamics effects for multi-child families
      if (!enhancedEffects.familyDynamics) {
        enhancedEffects.familyDynamics = {};
      }
      
      // Decisions affecting one child impact family stress
      if (enhancedEffects.happiness && Math.abs(enhancedEffects.happiness) > 15) {
        enhancedEffects.familyDynamics.stress = enhancedEffects.happiness > 0 ? -2 : 3;
      }
    }
    
    return enhancedEffects;
  }
  
  // Apply parenting style effects on decision outcomes
  private static applyParentingStyleEffects(effects: any, familyDynamics: FamilyDynamics): any {
    const enhancedEffects = { ...effects };
    const { parentingStyle } = familyDynamics;
    
    switch (parentingStyle) {
      case 'authoritative':
        // Balanced approach amplifies positive effects
        if (enhancedEffects.traits) {
          Object.keys(enhancedEffects.traits).forEach(traitId => {
            if (enhancedEffects.traits![traitId] > 0) {
              enhancedEffects.traits![traitId] = Math.ceil(enhancedEffects.traits![traitId] * 1.1);
            }
          });
        }
        break;
        
      case 'authoritarian':
        // Compliance-focused, reduces independence gains
        if (enhancedEffects.traits?.independence) {
          enhancedEffects.traits.independence = Math.floor(enhancedEffects.traits.independence * 0.8);
        }
        if (enhancedEffects.traits?.cooperation) {
          enhancedEffects.traits.cooperation = Math.ceil(enhancedEffects.traits.cooperation * 1.2);
        }
        break;
        
      case 'permissive':
        // Freedom-focused, amplifies independence but reduces structure
        if (enhancedEffects.traits?.independence) {
          enhancedEffects.traits.independence = Math.ceil(enhancedEffects.traits.independence * 1.3);
        }
        if (enhancedEffects.traits?.focus) {
          enhancedEffects.traits.focus = Math.floor(enhancedEffects.traits.focus * 0.9);
        }
        break;
        
      case 'neglectful':
        // Reduced effectiveness of all interventions
        if (enhancedEffects.traits) {
          Object.keys(enhancedEffects.traits).forEach(traitId => {
            enhancedEffects.traits![traitId] = Math.floor(enhancedEffects.traits![traitId] * 0.7);
          });
        }
        break;
        
      case 'adaptive':
        // Context-sensitive, optimizes based on child's needs
        // (Would require character analysis to fully implement)
        if (enhancedEffects.traits) {
          Object.keys(enhancedEffects.traits).forEach(traitId => {
            if (enhancedEffects.traits![traitId] > 0) {
              enhancedEffects.traits![traitId] = Math.ceil(enhancedEffects.traits![traitId] * 1.15);
            }
          });
        }
        break;
    }
    
    return enhancedEffects;
  }
  
  // Apply age-based developmental effects
  private static applyDevelopmentalEffects(effects: any, age: number): any {
    const enhancedEffects = { ...effects };
    
    // Critical periods for different traits
    const criticalPeriods = {
      'empathy': { start: 3, end: 7, multiplier: 1.3 },
      'curiosity': { start: 2, end: 6, multiplier: 1.2 },
      'independence': { start: 6, end: 12, multiplier: 1.25 },
      'confidence': { start: 4, end: 8, multiplier: 1.2 },
      'creativity': { start: 3, end: 9, multiplier: 1.15 },
      'focus': { start: 6, end: 10, multiplier: 1.3 },
      'cooperation': { start: 3, end: 8, multiplier: 1.2 }
    };
    
    if (enhancedEffects.traits) {
      Object.keys(enhancedEffects.traits).forEach(traitId => {
        const period = criticalPeriods[traitId as keyof typeof criticalPeriods];
        if (period && age >= period.start && age <= period.end) {
          enhancedEffects.traits![traitId] = Math.ceil(
            enhancedEffects.traits![traitId] * period.multiplier
          );
        }
      });
    }
    
    // Age-specific relationship development
    if (enhancedEffects.relationships) {
      if (age < 6 && enhancedEffects.relationships['parent-child']) {
        // Young children: stronger parent attachment effects
        const rel = enhancedEffects.relationships['parent-child'];
        if (rel.quality) rel.quality = Math.ceil(rel.quality * 1.2);
      } else if (age >= 10 && enhancedEffects.relationships['peer']) {
        // Older children: stronger peer relationship effects
        const rel = enhancedEffects.relationships['peer'];
        if (rel.quality) rel.quality = Math.ceil(rel.quality * 1.15);
      }
    }
    
    return enhancedEffects;
  }
  
  // Helper methods for psychological modeling
  private static applyTraitInteractions(effects: any, traitId: string, baseEffect: number, character: ChildCharacter): void {
    // Psychological trait interactions based on research
    const interactions = {
      'confidence': ['independence', 'resilience'],
      'empathy': ['compassion', 'cooperation'],
      'curiosity': ['creativity', 'focus'],
      'independence': ['confidence', 'determination'],
      'resilience': ['confidence', 'determination']
    };
    
    if (interactions[traitId as keyof typeof interactions] && baseEffect > 0) {
      const relatedTraits = interactions[traitId as keyof typeof interactions];
      relatedTraits.forEach(relatedTrait => {
        if (!effects.traits) effects.traits = {};
        if (!effects.traits[relatedTrait]) {
          effects.traits[relatedTrait] = Math.ceil(baseEffect * 0.3); // Secondary trait influence
        }
      });
    }
  }
  
  private static applyParentingStyleModifiers(effects: any, familyDynamics: FamilyDynamics): void {
    // Communication pattern effects
    if (familyDynamics.communicationPattern === 'open' || familyDynamics.communicationPattern === 'healthy') {
      if (effects.relationships?.['parent-child']?.communication) {
        effects.relationships['parent-child'].communication = Math.ceil(
          effects.relationships['parent-child'].communication * 1.2
        );
      }
    }
    
    // Boundary clarity effects
    if (familyDynamics.boundaryClarity > 70) {
      if (effects.traits?.cooperation) {
        effects.traits.cooperation = Math.ceil(effects.traits.cooperation * 1.1);
      }
    }
  }
  
  private static generateSiblingImpact(targetChild: ChildCharacter, sibling: ChildCharacter, effects: any): any {
    const siblingImpact: any = {};
    
    // Age-based sibling influence
    const ageDifference = Math.abs(targetChild.age - sibling.age);
    const influenceStrength = ageDifference < 3 ? 0.6 : ageDifference < 6 ? 0.4 : 0.2;
    
    // Generate trait effects based on decision impact
    if (effects.traits) {
      siblingImpact.traits = {};
      Object.keys(effects.traits).forEach(traitId => {
        const effect = effects.traits[traitId];
        // Siblings experience reduced version of trait changes
        if (Math.abs(effect) > 5) {
          siblingImpact.traits[traitId] = Math.ceil(effect * influenceStrength * 0.5);
        }
      });
    }
    
    // Sibling relationship effects
    if (Math.abs(effects.happiness || 0) > 10) {
      siblingImpact.relationship = {
        rivalry: effects.happiness > 0 ? 2 : -1, // Positive outcomes for one can increase rivalry
        cooperation: effects.happiness > 0 ? 1 : 2 // Negative outcomes can increase cooperation
      };
    }
    
    return siblingImpact;
  }

  // Initialize peer relationships for a character
  static initializePeerRelationshipsForCharacter(character: ChildCharacter): ChildCharacter {
    return PeerInteractionService.initializePeerRelationships(character);
  }

  // Generate peers for a character
  static generatePeersForCharacter(character: ChildCharacter): PeerCharacter[] {
    return PeerInteractionService.generatePeers(
      character.age, 
      character.personalityTraits, 
      character.interests
    );
  }

  // Apply peer influence on character development
  static applyPeerInfluenceToCharacter(
    character: ChildCharacter,
    peers: PeerCharacter[],
    ageIncrement: number = 1
  ): ChildCharacter {
    return PeerInteractionService.applyPeerInfluence(character, peers, ageIncrement);
  }

  // Multi-child scenario testing and generation
  static testMultiChildScenarioGeneration(gameState: GameState): {
    scenarioCount: number;
    familyScenarios: number;
    traitScenarios: number;
    peerScenarios: number;
    coverageReport: { [trait: string]: boolean };
  } {
    const children = Object.values(gameState.children);
    let scenarioCount = 0;
    let familyScenarios = 0;
    let traitScenarios = 0;
    let peerScenarios = 0;
    const coverageReport: { [trait: string]: boolean } = {};
    
    // Test scenario generation for each child
    children.forEach(child => {
      // Test family scenarios
      if (children.length > 1) {
        const familyScenario = this.checkFamilyScenarios(child.age, gameState.gameStyle!, gameState);
        if (familyScenario) {
          familyScenarios++;
          scenarioCount++;
        }
      }
      
      // Test trait-based scenarios for all traits
      child.personalityTraits.forEach(trait => {
        const mapping = (this.TRAIT_SCENARIO_MAPPING as any)[trait.id];
        if (mapping && child.age >= mapping.minAge) {
          const styleScenarios = mapping.scenarios[gameState.gameStyle!];
          if (styleScenarios) {
            const trigger = trait.value >= this.TRAIT_THRESHOLDS.HIGH ? 'HIGH' : 
                           trait.value <= this.TRAIT_THRESHOLDS.LOW ? 'LOW' : null;
            if (trigger) {
              const scenario = styleScenarios.find((s: any) => s.trigger === trigger);
              if (scenario) {
                traitScenarios++;
                scenarioCount++;
                coverageReport[trait.id] = true;
              }
            }
          }
        }
        
        // Mark trait as tested
        if (!coverageReport[trait.id]) {
          coverageReport[trait.id] = false;
        }
      });
      
      // Test peer scenarios
      const mockPeers = [{ id: 'test_peer', age: child.age }] as PeerCharacter[];
      const peerScenario = PeerInteractionService.generatePeerScenario(
        child, gameState.gameStyle!, mockPeers
      );
      if (peerScenario) {
        peerScenarios++;
        scenarioCount++;
      }
    });
    
    return {
      scenarioCount,
      familyScenarios,
      traitScenarios,
      peerScenarios,
      coverageReport
    };
  }
  
  // Enhanced family scenario prioritization for multi-child families
  static generateFamilyContextualScenario(
    gameState: GameState,
    focusChildId: string
  ): Scenario | null {
    const focusChild = gameState.children[focusChildId];
    if (!focusChild) return null;
    
    const siblings = Object.values(gameState.children).filter(child => child.id !== focusChildId);
    if (siblings.length === 0) return null;
    
    // Generate family-specific scenarios based on family dynamics
    const { familyDynamics } = gameState;
    
    // High stress family scenarios
    if (familyDynamics.stress > 70) {
      return this.generateStressManagementScenario(focusChild, siblings, gameState);
    }
    
    // Resource strain scenarios
    if (familyDynamics.resourceStrain > 60) {
      return this.generateResourceAllocationScenario(focusChild, siblings, gameState);
    }
    
    // Sibling conflict scenarios
    const conflictSibling = siblings.find(sibling => {
      const relationship = gameState.siblingRelationships.find(
        rel => (rel.childId1 === focusChildId && rel.childId2 === sibling.id!) ||
               (rel.childId2 === focusChildId && rel.childId1 === sibling.id!)
      );
      return relationship && relationship.rivalry > 60;
    });
    
    if (conflictSibling) {
      return this.generateSiblingConflictScenario(focusChild, conflictSibling, gameState);
    }
    
    return null;
  }
  
  // Helper methods for family scenario generation
  private static generateStressManagementScenario(
    focusChild: ChildCharacter,
    siblings: ChildCharacter[],
    gameState: GameState
  ): Scenario {
    return {
      title: TranslationService.translate('scenario_family_stress_title'),
      description: TranslationService.translate('scenario_family_stress_desc')
        .replace('{childName}', focusChild.name)
        .replace('{siblingCount}', siblings.length.toString()),
      options: [
        {
          label: `A) ${TranslationService.translate('option_family_meeting')}`,
          consequence: TranslationService.translate('consequence_open_communication'),
          effects: {
            happiness: 15,
            finances: -500,
            familyDynamics: { stress: -10, cohesion: 8 },
            siblingEffects: this.generateStressReliefSiblingEffects(siblings)
          }
        },
        {
          label: `B) ${TranslationService.translate('option_individual_attention')}`,
          consequence: TranslationService.translate('consequence_focused_care'),
          effects: {
            happiness: 20,
            finances: -2000,
            traits: { 'confidence': 8, 'resilience': 5 },
            relationships: { 'parent-child': { quality: 12, trust: 8 } },
            familyDynamics: { stress: -5, favoritism: { [focusChild.id!]: 5 } }
          }
        },
        {
          label: `C) ${TranslationService.translate('option_professional_help')}`,
          consequence: TranslationService.translate('consequence_family_therapy'),
          effects: {
            happiness: 25,
            finances: -5000,
            familyDynamics: { stress: -20, cohesion: 15, communicationPattern: 'healthy' },
            siblingEffects: this.generateTherapySiblingEffects(siblings)
          }
        }
      ],
      customAllowed: true
    };
  }
  
  private static generateResourceAllocationScenario(
    focusChild: ChildCharacter,
    siblings: ChildCharacter[],
    gameState: GameState
  ): Scenario {
    return {
      title: TranslationService.translate('scenario_resource_allocation_title'),
      description: TranslationService.translate('scenario_resource_allocation_desc')
        .replace('{childName}', focusChild.name),
      options: [
        {
          label: `A) ${TranslationService.translate('option_equal_distribution')}`,
          consequence: TranslationService.translate('consequence_fairness_priority'),
          effects: {
            happiness: 10,
            finances: -3000,
            familyDynamics: { resourceStrain: 5, cohesion: 8 },
            siblingEffects: this.generateEqualitySiblingEffects(siblings)
          }
        },
        {
          label: `B) ${TranslationService.translate('option_need_based')}`,
          consequence: TranslationService.translate('consequence_targeted_support'),
          effects: {
            happiness: 15,
            finances: -2000,
            traits: { 'empathy': 5, 'understanding': 3 },
            familyDynamics: { resourceStrain: -2 }
          }
        }
      ],
      customAllowed: true
    };
  }
  
  private static generateSiblingConflictScenario(
    focusChild: ChildCharacter,
    conflictSibling: ChildCharacter,
    gameState: GameState
  ): Scenario {
    return {
      title: TranslationService.translate('scenario_sibling_conflict_title'),
      description: TranslationService.translate('scenario_sibling_conflict_desc')
        .replace('{child1Name}', focusChild.name)
        .replace('{child2Name}', conflictSibling.name),
      options: [
        {
          label: `A) ${TranslationService.translate('option_mediate_conflict')}`,
          consequence: TranslationService.translate('consequence_conflict_resolution'),
          effects: {
            happiness: 12,
            finances: -1000,
            traits: { 'empathy': 8, 'cooperation': 6 },
            siblingEffects: {
              [conflictSibling.id!]: {
                traits: { 'empathy': 5, 'cooperation': 5 },
                relationship: { rivalry: -10, cooperation: 8 }
              }
            }
          }
        },
        {
          label: `B) ${TranslationService.translate('option_separate_activities')}`,
          consequence: TranslationService.translate('consequence_reduced_friction'),
          effects: {
            happiness: 8,
            finances: -1500,
            traits: { 'independence': 5 },
            siblingEffects: {
              [conflictSibling.id!]: {
                relationship: { rivalry: -5, bond: -2 }
              }
            }
          }
        }
      ],
      customAllowed: true
    };
  }
  
  // Helper methods for sibling effects generation
  private static generateStressReliefSiblingEffects(siblings: ChildCharacter[]): any {
    const effects: any = {};
    siblings.forEach(sibling => {
      if (sibling.id) {
        effects[sibling.id] = {
          traits: { 'resilience': 3, 'cooperation': 2 },
          relationship: { cooperation: 5 }
        };
      }
    });
    return effects;
  }
  
  private static generateTherapySiblingEffects(siblings: ChildCharacter[]): any {
    const effects: any = {};
    siblings.forEach(sibling => {
      if (sibling.id) {
        effects[sibling.id] = {
          traits: { 'empathy': 5, 'communication': 8, 'resilience': 4 },
          relationship: { cooperation: 8, bond: 6 }
        };
      }
    });
    return effects;
  }
  
  private static generateEqualitySiblingEffects(siblings: ChildCharacter[]): any {
    const effects: any = {};
    siblings.forEach(sibling => {
      if (sibling.id) {
        effects[sibling.id] = {
          traits: { 'cooperation': 4, 'fairness': 6 },
          relationship: { rivalry: -3, cooperation: 5 }
        };
      }
    });
    return effects;
  }
  
  // Family scenario interface - maintains compatibility
  static getFamilyScenario = getFamilyScenario;
  static getChildBirthScenario = getChildBirthScenario;
}