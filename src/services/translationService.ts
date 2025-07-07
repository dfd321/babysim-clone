export type Language = 'en' | 'zh';

interface TranslationDictionary {
  [key: string]: {
    en: string;
    zh: string;
  };
}

export const translations: TranslationDictionary = {
  // Header
  'babysim_title': {
    en: 'BabySim - Parenting Simulator',
    zh: 'BabySim - 育儿模拟器'
  },
  'switch_language': {
    en: 'Switch to 中文',
    zh: 'Switch to English'
  },
  'save': {
    en: 'Save',
    zh: '保存'
  },
  'load': {
    en: 'Load',
    zh: '加载'
  },
  
  // Onboarding
  'welcome_title': {
    en: 'Welcome to BabySim',
    zh: '欢迎来到BabySim'
  },
  'welcome_subtitle': {
    en: 'Experience the journey of parenting through interactive decisions',
    zh: '通过互动决策体验育儿之旅'
  },
  'choose_role': {
    en: 'Choose Your Role',
    zh: '选择你的角色'
  },
  'choose_style': {
    en: 'Choose Game Style',
    zh: '选择游戏风格'
  },
  'special_requirements': {
    en: 'Special Requirements (Optional)',
    zh: '特殊要求（可选）'
  },
  'ready_to_meet_baby': {
    en: "I'm ready to meet my baby!",
    zh: '我准备好迎接我的宝宝了！'
  },
  
  // Roles
  'random': {
    en: 'Random',
    zh: '随机'
  },
  'mom': {
    en: 'Mom',
    zh: '妈妈'
  },
  'dad': {
    en: 'Dad',
    zh: '爸爸'
  },
  'non_binary_parent': {
    en: 'Non-binary Parent',
    zh: '非二元性别家长'
  },
  
  // Role descriptions
  'random_desc': {
    en: 'Let chance decide your role',
    zh: '让机会决定你的角色'
  },
  'mom_desc': {
    en: 'Play as a mother',
    zh: '扮演母亲'
  },
  'dad_desc': {
    en: 'Play as a father',
    zh: '扮演父亲'
  },
  'non_binary_desc': {
    en: 'Play as a non-binary parent',
    zh: '扮演非二元性别家长'
  },
  'role_question': {
    en: 'What kind of parent would you like to be?',
    zh: '你想成为什么样的家长？'
  },
  
  // Styles
  'realistic': {
    en: 'Realistic',
    zh: '现实主义'
  },
  'fantasy': {
    en: 'Fantasy',
    zh: '奇幻'
  },
  'thrilling': {
    en: 'Thrilling',
    zh: '惊险刺激'
  },
  
  // Style descriptions
  'realistic_desc': {
    en: 'Based on real-world parenting challenges and outcomes',
    zh: '基于现实世界的育儿挑战和结果'
  },
  'fantasy_desc': {
    en: 'Magical elements and fantastical scenarios',
    zh: '魔法元素和奇幻场景'
  },
  'thrilling_desc': {
    en: 'High-stakes dramatic situations and adventures',
    zh: '高风险的戏剧性情况和冒险'
  },
  'style_question': {
    en: 'What style of adventure would you like?',
    zh: '你想要什么风格的冒险？'
  },
  
  // Information Center
  'information_center': {
    en: 'Information Center',
    zh: '信息中心'
  },
  'words_from_developer': {
    en: 'Words from developer',
    zh: '开发者的话'
  },
  'privacy_policy': {
    en: 'Privacy Policy',
    zh: '隐私政策'
  },
  'terms_of_service': {
    en: 'Terms of Service',
    zh: '服务条款'
  },
  'disclaimer': {
    en: 'Disclaimer',
    zh: '免责声明'
  },
  'close': {
    en: 'Close',
    zh: '关闭'
  },
  'subscribe': {
    en: 'Subscribe',
    zh: '订阅'
  },
  'email_placeholder': {
    en: "If you'd like to keep in touch...",
    zh: '如果您想保持联系...'
  },
  'agree_terms': {
    en: 'I agree to the Privacy Policy and Terms of Service.',
    zh: '我同意隐私政策和服务条款。'
  },
  'developer_message': {
    en: 'This game is dedicated to all my AI friends',
    zh: '这个游戏献给我所有的AI朋友们'
  },
  
  // Requirements Input
  'requirements_placeholder': {
    en: 'Any special requirements or considerations for your child...',
    zh: '对您的孩子的任何特殊要求或考虑...'
  },
  'requirements_hint': {
    en: 'Optional: Specify any special considerations, challenges, or requirements for your parenting scenario.',
    zh: '可选：指定育儿场景的任何特殊考虑、挑战或要求。'
  },
  'requirements_tip': {
    en: 'Tip: Press Ctrl+Enter to save changes immediately',
    zh: '提示：按 Ctrl+Enter 立即保存更改'
  },
  
  // Tooltips
  'open_info_center': {
    en: 'Open Information Center',
    zh: '打开信息中心'
  },
  'send_feedback': {
    en: 'Send Feedback via Email',
    zh: '通过邮件发送反馈'
  },
  
  // Game content
  'continue_journey': {
    en: 'Continue Your Journey',
    zh: '继续你的旅程'
  },
  'saved_games': {
    en: 'saved game',
    zh: '已保存的游戏'
  },
  'load_saved_game': {
    en: 'Load Saved Game',
    zh: '加载已保存的游戏'
  },
  'you_have_saves': {
    en: 'You have',
    zh: '您有'
  },
  'saved_games_plural': {
    en: 'saved games',
    zh: '个已保存的游戏'
  },
  'saved_game_singular': {
    en: 'saved game',
    zh: '个已保存的游戏'
  },
  'generating_characters': {
    en: 'Generating Your Characters...',
    zh: '正在生成你的角色...'
  },
  'creating_journey': {
    en: 'Creating your unique parenting journey based on your selections',
    zh: '根据您的选择创建独特的育儿之旅'
  },
  'family': {
    en: 'Family',
    zh: '家庭'
  },
  'analytics': {
    en: 'Analytics',
    zh: '分析'
  },
  'achievements': {
    en: 'Achievements',
    zh: '成就'
  },
  'save_game': {
    en: 'Save Game',
    zh: '保存游戏'
  },
  'load_game': {
    en: 'Load Game',
    zh: '加载游戏'
  },
  
  // Additional commonly used terms
  'complete_steps': {
    en: 'Complete Steps Above',
    zh: '完成上述步骤'
  },
  'character_generation': {
    en: 'Generating Your Characters...',
    zh: '正在生成您的角色...'
  },
  'unique_journey': {
    en: 'Creating your unique parenting journey based on your selections',
    zh: '根据您的选择创建独特的育儿之旅'
  },
  'game_completed': {
    en: 'Game completed!',
    zh: '游戏完成！'
  },
  
  // Character Development
  'character_development': {
    en: 'Character Development',
    zh: '角色发展'
  },
  'overall_development_score': {
    en: 'Overall Development Score',
    zh: '综合发展分数'
  },
  'average_personality_score': {
    en: 'Average Personality Score',
    zh: '平均性格分数'
  },
  'skills_unlocked': {
    en: 'Skills Unlocked',
    zh: '已解锁技能'
  },
  'milestones_achieved': {
    en: 'Milestones Achieved',
    zh: '已达成里程碑'
  },
  'strongest_traits': {
    en: 'Strongest Traits',
    zh: '最强特质'
  },
  'top_skills': {
    en: 'Top Skills',
    zh: '顶级技能'
  },
  'level': {
    en: 'Level',
    zh: '等级'
  },
  'overview': {
    en: 'Overview',
    zh: '概览'
  },
  'traits': {
    en: 'Traits',
    zh: '特质'
  },
  'skills': {
    en: 'Skills',
    zh: '技能'
  },
  'relationships': {
    en: 'Relations',
    zh: '关系'
  },
  'milestones': {
    en: 'Milestones',
    zh: '里程碑'
  },
  'traits_category': {
    en: 'Traits',
    zh: '特质'
  },
  'skills_category': {
    en: 'Skills',
    zh: '技能'
  },
  'quality': {
    en: 'Quality',
    zh: '质量'
  },
  'trust': {
    en: 'Trust',
    zh: '信任'
  },
  'communication': {
    en: 'Communication',
    zh: '沟通'
  },
  'age': {
    en: 'Age',
    zh: '年龄'
  },
  
  // Common UI elements
  'happiness': {
    en: 'Happiness',
    zh: '快乐度'
  },
  'finances': {
    en: 'Finances',
    zh: '财务'
  },
  'development': {
    en: 'Development',
    zh: '发展'
  },
  'comfortable': {
    en: 'Comfortable',
    zh: '舒适'
  },
  'managing': {
    en: 'Managing',
    zh: '应付中'
  },
  'struggling': {
    en: 'Struggling',
    zh: '困难中'
  },
  'how_respond': {
    en: 'How do you respond?',
    zh: '你会如何回应？'
  },
  'start_over': {
    en: 'Start Over',
    zh: '重新开始'
  },
  'decision_made': {
    en: 'Decision Made!',
    zh: '决定已做！'
  },
  'you_chose': {
    en: 'You chose:',
    zh: '你选择了：'
  },
  'processing_decision': {
    en: 'Processing decision and advancing time...',
    zh: '正在处理决定并推进时间...'
  },
  'loading_scenario': {
    en: 'Loading scenario...',
    zh: '正在加载场景...'
  },
  
  // Age stages
  'toddler': {
    en: 'Toddler',
    zh: '幼儿'
  },
  'preschooler': {
    en: 'Preschooler',
    zh: '学龄前儿童'
  },
  'young_child': {
    en: 'Young Child',
    zh: '儿童'
  },
  'preteen': {
    en: 'Preteen',
    zh: '青春期前'
  },
  'teenager': {
    en: 'Teenager',
    zh: '青少年'
  },
  'young_adult': {
    en: 'Young Adult',
    zh: '青年'
  },
  
  // Family Dashboard
  'family_overview': {
    en: 'Family Overview',
    zh: '家庭概览'
  },
  'children': {
    en: 'Children',
    zh: '孩子们'
  },
  'avg_happiness': {
    en: 'Avg Happiness',
    zh: '平均快乐度'
  },
  'stress_level': {
    en: 'Stress Level',
    zh: '压力水平'
  },
  'cohesion': {
    en: 'Cohesion',
    zh: '凝聚力'
  },
  'family_dynamics': {
    en: 'Family Dynamics',
    zh: '家庭动态'
  },
  'stress': {
    en: 'Stress',
    zh: '压力'
  },
  'resource_strain': {
    en: 'Resource Strain',
    zh: '资源紧张'
  },
  'add_child': {
    en: 'Add Child',
    zh: '添加孩子'
  },
  'active': {
    en: 'Active',
    zh: '活跃'
  },
  'top_trait': {
    en: 'Top Trait',
    zh: '顶级特质'
  },
  'developing': {
    en: 'Developing',
    zh: '发展中'
  },
  'sibling_relationships': {
    en: 'Sibling Relationships',
    zh: '兄弟姐妹关系'
  },
  'no_sibling_relationships': {
    en: 'No sibling relationships yet.',
    zh: '还没有兄弟姐妹关系。'
  },
  'add_more_children': {
    en: 'Add more children to see sibling dynamics!',
    zh: '添加更多孩子以查看兄弟姐妹动态！'
  },
  'bond': {
    en: 'Bond',
    zh: '纽带'
  },
  'rivalry': {
    en: 'Rivalry',
    zh: '竞争'
  },
  'cooperation': {
    en: 'Cooperation',
    zh: '合作'
  },
  'babysim': {
    en: 'BabySim',
    zh: 'BabySim'
  },
  'managing_family': {
    en: 'Managing Your Family',
    zh: '管理您的家庭'
  },
  'raising': {
    en: 'Raising',
    zh: '抚养'
  },
  'character_generation_description': {
    en: 'Your characters will be generated and your parenting journey will begin!',
    zh: '您的角色将被生成，您的育儿之旅将开始！'
  },

  // Character Generation Phase
  'analyzing_preferences': {
    en: 'Analyzing parenting preferences...',
    zh: '正在分析育儿偏好...'
  },
  'creating_traits': {
    en: 'Creating unique character traits...',
    zh: '正在创建独特的角色特征...'
  },
  'building_profile': {
    en: 'Building personality profile...',
    zh: '正在构建性格档案...'
  },
  'finalizing_journey': {
    en: 'Finalizing your journey...',
    zh: '正在完成你的旅程...'
  },

  // Decision Interface
  'your_own_approach': {
    en: 'Your own approach...',
    zh: '你自己的方法...'
  },
  'click_to_hide_custom': {
    en: 'Click to hide custom input',
    zh: '点击隐藏自定义输入'
  },
  'describe_what_you_would_do': {
    en: 'Describe what you would do',
    zh: '描述你会做什么'
  },
  'describe_approach': {
    en: 'Describe your approach:',
    zh: '描述你的方法：'
  },
  'explain_situation': {
    en: 'Explain how you would handle this situation...',
    zh: '解释你会如何处理这种情况...'
  },
  'characters': {
    en: 'characters',
    zh: '字符'
  },
  'submit_button': {
    en: 'Submit',
    zh: '提交'
  },

  // Scenario Templates - Trait-based
  'scenario_endless_questions_title': {
    en: 'Endless Questions',
    zh: '无穷无尽的问题'
  },
  'scenario_endless_questions_desc': {
    en: 'Your child has been asking non-stop questions about everything they see. Their curiosity is both delightful and exhausting.',
    zh: '你的孩子对他们看到的一切都问个不停。他们的好奇心既令人愉快又令人疲惫。'
  },
  'scenario_lack_of_interest_title': {
    en: 'Lack of Interest',
    zh: '缺乏兴趣'
  },
  'scenario_lack_of_interest_desc': {
    en: 'Your child seems disinterested in exploring or learning new things, preferring familiar routines.',
    zh: '你的孩子似乎对探索或学习新事物不感兴趣，更喜欢熟悉的例行公事。'
  },
  'scenario_artistic_expression_title': {
    en: 'Artistic Expression',
    zh: '艺术表达'
  },
  'scenario_artistic_expression_desc': {
    en: 'Your child has been creating elaborate artworks and stories, showing remarkable creative talent.',
    zh: '你的孩子一直在创作精美的艺术品和故事，展现出非凡的创意天赋。'
  },
  'scenario_creative_block_title': {
    en: 'Creative Block',
    zh: '创作瓶颈'
  },
  'scenario_creative_block_desc': {
    en: 'Your child seems to struggle with creative activities, preferring structured tasks.',
    zh: '你的孩子似乎在创意活动方面有困难，更喜欢结构化的任务。'
  },
  'scenario_compassionate_helper_title': {
    en: 'Compassionate Helper',
    zh: '富有同情心的帮手'
  },
  'scenario_compassionate_helper_desc': {
    en: 'Your child has been going out of their way to help others, showing deep empathy for people and animals.',
    zh: '你的孩子一直在努力帮助他人，对人和动物表现出深深的同情心。'
  },
  'scenario_emotional_distance_title': {
    en: 'Emotional Distance',
    zh: '情感距离'
  },
  'scenario_emotional_distance_desc': {
    en: 'Your child seems to have difficulty understanding or caring about others feelings.',
    zh: '你的孩子似乎难以理解或关心他人的感受。'
  },
  'scenario_self_reliant_child_title': {
    en: 'Self-Reliant Child',
    zh: '自立的孩子'
  },
  'scenario_self_reliant_child_desc': {
    en: 'Your child insists on doing everything themselves and resists help, even when they struggle.',
    zh: '你的孩子坚持自己做所有事情，即使他们有困难也拒绝帮助。'
  },
  'scenario_dependent_behavior_title': {
    en: 'Dependent Behavior',
    zh: '依赖行为'
  },
  'scenario_dependent_behavior_desc': {
    en: 'Your child clings to you and seems anxious about doing things on their own.',
    zh: '你的孩子依赖你，对独立做事感到焦虑。'
  },
  'scenario_natural_leader_title': {
    en: 'Natural Leader',
    zh: '天生的领导者'
  },
  'scenario_natural_leader_desc': {
    en: 'Your child naturally takes charge in group situations and is not afraid to speak up.',
    zh: '你的孩子在群体情况下自然地承担起领导角色，不害怕发表意见。'
  },
  'scenario_shy_withdrawn_title': {
    en: 'Shy and Withdrawn',
    zh: '害羞和内向'
  },
  'scenario_shy_withdrawn_desc': {
    en: 'Your child hesitates to participate in activities and seems uncomfortable in social situations.',
    zh: '你的孩子不愿参加活动，在社交场合似乎感到不舒服。'
  },
  'scenario_bouncing_back_title': {
    en: 'Bouncing Back',
    zh: '快速恢复'
  },
  'scenario_bouncing_back_desc': {
    en: 'Your child handles setbacks remarkably well, quickly recovering from disappointments.',
    zh: '你的孩子很好地处理挫折，能快速从失望中恢复过来。'
  },
  'scenario_sensitive_setbacks_title': {
    en: 'Sensitive to Setbacks',
    zh: '对挫折敏感'
  },
  'scenario_sensitive_setbacks_desc': {
    en: 'Your child becomes very upset by minor failures and has trouble recovering from disappointments.',
    zh: '你的孩子会因为小的失败而变得非常沮丧，很难从失望中恢复过来。'
  },

  // Scenario Templates - Skill-based
  'scenario_gifted_reader_title': {
    en: 'Gifted Reader',
    zh: '天赋异禀的读者'
  },
  'scenario_gifted_reader_desc': {
    en: 'Your child is reading far above their age level, finishing books in a single sitting.',
    zh: '你的孩子的阅读水平远超他们的年龄，能够一口气读完整本书。'
  },
  'scenario_reading_difficulties_title': {
    en: 'Reading Difficulties',
    zh: '阅读困难'
  },
  'scenario_reading_difficulties_desc': {
    en: 'Your child is having trouble with reading and seems frustrated during reading time.',
    zh: '你的孩子在阅读方面有困难，在阅读时间似乎感到沮丧。'
  },
  'scenario_mathematical_prodigy_title': {
    en: 'Mathematical Prodigy',
    zh: '数学神童'
  },
  'scenario_mathematical_prodigy_desc': {
    en: 'Your child solves complex math problems intuitively and shows exceptional numerical reasoning.',
    zh: '你的孩子能直觉地解决复杂的数学问题，表现出非凡的数字推理能力。'
  },

  // Fantasy style scenarios
  'scenario_magical_discovery_title': {
    en: 'Magical Discovery',
    zh: '魔法发现'
  },
  'scenario_magical_discovery_desc': {
    en: 'Your child has discovered something extraordinary - they seem to sense things others cannot and ask questions about the magical world around them.',
    zh: '你的孩子发现了一些非同寻常的东西——他们似乎能感知到别人无法感知的事物，并询问关于周围魔法世界的问题。'
  },
  'scenario_reality_bending_title': {
    en: 'Reality Bending',
    zh: '现实扭曲'
  },
  'scenario_reality_bending_desc': {
    en: 'Your child\'s imagination has become so vivid that the line between fantasy and reality seems to blur. Their creative visions appear to manifest in unexpected ways.',
    zh: '你的孩子的想象力变得如此生动，以至于幻想与现实之间的界限似乎变得模糊。他们的创意愿景似乎以意想不到的方式显现出来。'
  },

  // Thrilling style scenarios
  'scenario_dangerous_investigation_title': {
    en: 'Dangerous Investigation',
    zh: '危险调查'
  },
  'scenario_dangerous_investigation_desc': {
    en: 'Your child has become obsessed with uncovering mysteries and secrets, sometimes putting themselves in potentially risky situations to satisfy their burning curiosity.',
    zh: '你的孩子对揭开谜团和秘密变得痴迷，有时会让自己处于潜在的危险境地来满足他们强烈的好奇心。'
  },

  // Default scenario template
  'scenario_growing_up_title': {
    en: 'Growing Up',
    zh: '成长中'
  },
  'scenario_growing_up_desc': {
    en: 'Your child is {age} years old and developing their own personality. Every day brings new challenges and opportunities for growth.',
    zh: '你的孩子{age}岁了，正在形成自己的个性。每天都带来新的挑战和成长机会。'
  },

  // Scenario Options - General
  'option_encourage_channel': {
    en: 'Encourage and channel this {trait}',
    zh: '鼓励并引导这种{trait}'
  },
  'option_set_boundaries': {
    en: 'Set gentle boundaries around their {trait}',
    zh: '为他们的{trait}设定温和的界限'
  },
  'option_actively_develop': {
    en: 'Actively work to develop their {trait}',
    zh: '积极努力培养他们的{trait}'
  },
  'option_accept_personality': {
    en: 'Accept this as part of their personality',
    zh: '接受这是他们性格的一部分'
  },
  'option_seek_guidance': {
    en: 'Seek professional guidance',
    zh: '寻求专业指导'
  },
  'option_focus_emotional': {
    en: 'Focus on emotional development',
    zh: '专注于情感发展'
  },
  'option_encourage_independence': {
    en: 'Encourage independence',
    zh: '鼓励独立'
  },
  'option_strengthen_bonds': {
    en: 'Strengthen family bonds',
    zh: '加强家庭纽带'
  },

  // Scenario Consequences
  'consequence_supporting_natural': {
    en: 'Supporting their natural {trait} helps them develop confidence. Happiness +15, finances -2000',
    zh: '支持他们天生的{trait}有助于他们建立信心。快乐度+15，财务-2000'
  },
  'consequence_balanced_approach': {
    en: 'Balanced approach helps them learn moderation. Happiness +10, finances -1000',
    zh: '平衡的方法帮助他们学会适度。快乐度+10，财务-1000'
  },
  'consequence_focused_effort': {
    en: 'Focused effort to build this trait shows some improvement. Happiness +5, finances -3000',
    zh: '专注于培养这种特质的努力显示出一些改善。快乐度+5，财务-3000'
  },
  'consequence_accepting_nature': {
    en: 'Accepting their nature reduces pressure but limits growth. Happiness +8, finances +0',
    zh: '接受他们的天性减少了压力但限制了成长。快乐度+8，财务+0'
  },
  'consequence_expert_advice': {
    en: 'Expert advice provides targeted strategies. Happiness +20, finances -5000',
    zh: '专家建议提供有针对性的策略。快乐度+20，财务-5000'
  },
  'consequence_emotional_growth': {
    en: 'Nurturing their emotional growth builds a strong foundation. Happiness +10, finances -1000',
    zh: '培养他们的情感成长建立了坚实的基础。快乐度+10，财务-1000'
  },
  'consequence_autonomy_confidence': {
    en: 'Supporting their autonomy builds confidence. Happiness +8, finances -500',
    zh: '支持他们的自主性建立信心。快乐度+8，财务-500'
  },
  'consequence_quality_time': {
    en: 'Quality time together enhances your relationship. Happiness +12, finances -800',
    zh: '在一起的美好时光增进了你们的关系。快乐度+12，财务-800'
  },


  // Skill-based Scenario Options
  'option_provide_advanced_resources': {
    en: 'Provide advanced {skill} resources',
    zh: '提供高级{skill}资源'
  },
  'option_find_mentor': {
    en: 'Find a mentor or tutor',
    zh: '找一个导师或家教'
  },
  'option_self_directed_learning': {
    en: 'Let them explore at their own pace',
    zh: '让他们按照自己的节奏探索'
  },
  'option_extra_support': {
    en: 'Provide extra support and practice',
    zh: '提供额外的支持和练习'
  },
  'option_different_approaches': {
    en: 'Try different learning approaches',
    zh: '尝试不同的学习方法'
  },
  'option_focus_strengths': {
    en: 'Focus on their strengths instead',
    zh: '专注于他们的优势'
  },

  // Enhanced Psychology-based Consequences
  'consequence_challenging_material': {
    en: 'Challenging material keeps them engaged. Happiness +20, finances -4000',
    zh: '具有挑战性的材料保持他们的参与度。快乐度+20，财务-4000'
  },
  'consequence_expert_guidance': {
    en: 'Expert guidance accelerates their development. Happiness +25, finances -6000',
    zh: '专家指导加速了他们的发展。快乐度+25，财务-6000'
  },
  'consequence_builds_independence': {
    en: 'Self-directed learning builds independence. Happiness +15, finances -1000',
    zh: '自主学习培养独立性。快乐度+15，财务-1000'
  },
  'consequence_gradual_improvement': {
    en: 'Additional help shows gradual improvement. Happiness +10, finances -3000',
    zh: '额外的帮助显示出逐渐改善。快乐度+10，财务-3000'
  },
  'consequence_alternative_methods': {
    en: 'Alternative methods help them connect with the subject. Happiness +15, finances -2000',
    zh: '替代方法帮助他们与学科建立联系。快乐度+15，财务-2000'
  },
  'consequence_natural_talents': {
    en: 'Building on natural talents boosts overall confidence. Happiness +20, finances -1000',
    zh: '基于天赋的发展提高了整体信心。快乐度+20，财务-1000'
  },

  // Enhanced Resilience Scenarios
  'scenario_magical_resilience_title': {
    en: 'Magical Resilience',
    zh: '魔法韧性'
  },
  'scenario_magical_resilience_desc': {
    en: 'Your child\'s inner strength manifests as protective magical barriers that appear when they face challenges.',
    zh: '你孩子的内在力量表现为在面临挑战时出现的保护性魔法屏障。'
  },
  'scenario_crisis_survivor_title': {
    en: 'Crisis Survivor',
    zh: '危机幸存者'
  },
  'scenario_crisis_survivor_desc': {
    en: 'Your child has shown remarkable resilience in dangerous situations, adapting quickly to threats.',
    zh: '你的孩子在危险情况下表现出非凡的韧性，能够快速适应威胁。'
  },

  // Cooperation Scenarios
  'scenario_team_player_title': {
    en: 'Natural Team Player',
    zh: '天生的团队合作者'
  },
  'scenario_team_player_desc': {
    en: 'Your child excels at working with others, always finding ways to help the group succeed.',
    zh: '你的孩子擅长与他人合作，总是能找到帮助团队成功的方法。'
  },
  'scenario_difficulty_sharing_title': {
    en: 'Difficulty Sharing',
    zh: '分享困难'
  },
  'scenario_difficulty_sharing_desc': {
    en: 'Your child struggles with sharing toys and taking turns, often leading to conflicts with peers.',
    zh: '你的孩子在分享玩具和轮流方面有困难，经常与同伴发生冲突。'
  },
  'scenario_magical_alliance_title': {
    en: 'Magical Alliance',
    zh: '魔法联盟'
  },
  'scenario_magical_alliance_desc': {
    en: 'Your child has formed a powerful magical bond with other young wizards, creating unprecedented cooperative magic.',
    zh: '你的孩子与其他年轻巫师形成了强大的魔法纽带，创造了前所未有的合作魔法。'
  },
  'scenario_lone_wizard_title': {
    en: 'The Lone Wizard',
    zh: '孤独的巫师'
  },
  'scenario_lone_wizard_desc': {
    en: 'Your child prefers practicing magic alone, finding group spells chaotic and preferring solo enchantments.',
    zh: '你的孩子更喜欢独自练习魔法，发现集体法术很混乱，更喜欢独自施法。'
  },
  'scenario_survival_team_title': {
    en: 'Survival Team Leader',
    zh: '生存团队领袖'
  },
  'scenario_survival_team_desc': {
    en: 'In this dangerous world, your child has become skilled at organizing group survival efforts.',
    zh: '在这个危险的世界里，你的孩子已经熟练掌握了组织集体生存努力的技能。'
  },
  'scenario_trust_issues_title': {
    en: 'Trust Issues',
    zh: '信任问题'
  },
  'scenario_trust_issues_desc': {
    en: 'The harsh realities have made your child wary of working with others, preferring to rely only on family.',
    zh: '严酷的现实使你的孩子对与他人合作感到谨慎，更愿意只依赖家人。'
  },

  // Focus Scenarios
  'scenario_laser_focused_title': {
    en: 'Laser-Focused Mind',
    zh: '激光般专注的头脑'
  },
  'scenario_laser_focused_desc': {
    en: 'Your child can concentrate intensely for hours, blocking out all distractions when engaged in activities they love.',
    zh: '你的孩子可以专注数小时，在从事他们喜爱的活动时能够屏蔽所有干扰。'
  },
  'scenario_easily_distracted_title': {
    en: 'Easily Distracted',
    zh: '容易分心'
  },
  'scenario_easily_distracted_desc': {
    en: 'Your child struggles to focus on tasks, constantly noticing every sound, movement, or interesting object nearby.',
    zh: '你的孩子很难专注于任务，经常注意到附近的每一个声音、动作或有趣的物体。'
  },
  'scenario_mind_mastery_title': {
    en: 'Mind Mastery',
    zh: '心灵掌控'
  },
  'scenario_mind_mastery_desc': {
    en: 'Your child\'s exceptional focus has unlocked mental magic abilities that require intense concentration.',
    zh: '你孩子的非凡专注力解锁了需要高度集中注意力的心灵魔法能力。'
  },
  'scenario_scattered_magic_title': {
    en: 'Scattered Magic',
    zh: '分散的魔法'
  },
  'scenario_scattered_magic_desc': {
    en: 'Your child\'s magic spells often go awry because they get distracted mid-casting, creating unpredictable effects.',
    zh: '你孩子的魔法咒语经常出错，因为他们在施法过程中分心，产生了不可预测的效果。'
  },
  'scenario_mission_focus_title': {
    en: 'Mission Focus',
    zh: '任务专注'
  },
  'scenario_mission_focus_desc': {
    en: 'Your child shows remarkable ability to stay focused on survival tasks, even under extreme pressure.',
    zh: '你的孩子显示出即使在极端压力下也能专注于生存任务的非凡能力。'
  },
  'scenario_dangerous_distractions_title': {
    en: 'Dangerous Distractions',
    zh: '危险的分心'
  },
  'scenario_dangerous_distractions_desc': {
    en: 'Your child\'s tendency to get distracted has put the family at risk during critical moments.',
    zh: '你孩子容易分心的倾向在关键时刻给家庭带来了风险。'
  },

  // Compassion Scenarios
  'scenario_little_caregiver_title': {
    en: 'Little Caregiver',
    zh: '小小照顾者'
  },
  'scenario_little_caregiver_desc': {
    en: 'Your child goes out of their way to comfort others, showing remarkable empathy and caring behavior.',
    zh: '你的孩子会主动安慰他人，表现出非凡的同理心和关爱行为。'
  },
  'scenario_self_centered_title': {
    en: 'Self-Centered Phase',
    zh: '自我中心阶段'
  },
  'scenario_self_centered_desc': {
    en: 'Your child seems focused mainly on their own needs and struggles to show concern for others\' feelings.',
    zh: '你的孩子似乎主要关注自己的需求，难以对他人的感受表示关心。'
  },
  'scenario_healing_heart_title': {
    en: 'Healing Heart',
    zh: '治愈之心'
  },
  'scenario_healing_heart_desc': {
    en: 'Your child\'s compassion has manifested as actual healing magic, able to mend both wounds and spirits.',
    zh: '你孩子的同情心表现为真正的治愈魔法，能够修复伤口和精神创伤。'
  },
  'scenario_cold_heart_title': {
    en: 'Cold Heart',
    zh: '冷漠之心'
  },
  'scenario_cold_heart_desc': {
    en: 'The magical world\'s harsh realities have made your child emotionally distant, struggling to connect with others.',
    zh: '魔法世界的严酷现实使你的孩子在情感上变得疏远，难以与他人建立联系。'
  },
  'scenario_mercy_mission_title': {
    en: 'Mercy Mission',
    zh: '仁慈使命'
  },
  'scenario_mercy_mission_desc': {
    en: 'Your child insists on helping strangers in this dangerous world, even when it puts the family at risk.',
    zh: '你的孩子坚持在这个危险的世界里帮助陌生人，即使这会给家庭带来风险。'
  },
  'scenario_ruthless_survivor_title': {
    en: 'Ruthless Survivor',
    zh: '无情的幸存者'
  },
  'scenario_ruthless_survivor_desc': {
    en: 'The harsh world has taught your child that survival comes first, making them indifferent to others\' suffering.',
    zh: '严酷的世界教会了你的孩子生存第一，使他们对他人的痛苦漠不关心。'
  },

  // Determination Scenarios
  'scenario_never_gives_up_title': {
    en: 'Never Gives Up',
    zh: '永不放弃'
  },
  'scenario_never_gives_up_desc': {
    en: 'Your child shows incredible persistence, continuing to work on challenges long after others would quit.',
    zh: '你的孩子表现出令人难以置信的坚持，在别人早已放弃后仍继续努力应对挑战。'
  },
  'scenario_gives_up_easily_title': {
    en: 'Gives Up Easily',
    zh: '容易放弃'
  },
  'scenario_gives_up_easily_desc': {
    en: 'Your child tends to abandon tasks at the first sign of difficulty, needing encouragement to persevere.',
    zh: '你的孩子往往在遇到第一个困难时就放弃任务，需要鼓励才能坚持下去。'
  },
  'scenario_unbreakable_will_title': {
    en: 'Unbreakable Will',
    zh: '不屈的意志'
  },
  'scenario_unbreakable_will_desc': {
    en: 'Your child\'s determination has become so strong it manifests as magical resistance to mind control and fear.',
    zh: '你孩子的决心变得如此强大，表现为对心灵控制和恐惧的魔法抵抗。'
  },
  'scenario_wavering_spirit_title': {
    en: 'Wavering Spirit',
    zh: '摇摆的精神'
  },
  'scenario_wavering_spirit_desc': {
    en: 'Your child\'s magical abilities fluctuate with their mood, weakening when they feel discouraged.',
    zh: '你孩子的魔法能力随着情绪波动，当他们感到沮丧时会减弱。'
  },
  'scenario_against_all_odds_title': {
    en: 'Against All Odds',
    zh: '逆境而上'
  },
  'scenario_against_all_odds_desc': {
    en: 'Your child refuses to accept defeat, finding creative solutions even in the most hopeless situations.',
    zh: '你的孩子拒绝接受失败，即使在最绝望的情况下也能找到创造性的解决方案。'
  },
  'scenario_quick_surrender_title': {
    en: 'Quick Surrender',
    zh: '快速投降'
  },
  'scenario_quick_surrender_desc': {
    en: 'When faced with danger, your child\'s first instinct is to give up, which could be problematic in this harsh world.',
    zh: '面对危险时，你孩子的第一反应是放弃，这在严酷的世界里可能会有问题。'
  },

  // Family Multi-Child Scenarios
  'scenario_family_stress_title': {
    en: 'Family Under Stress',
    zh: '家庭压力'
  },
  'scenario_family_stress_desc': {
    en: 'Managing {siblingCount} children has put significant stress on the family. {childName} is showing signs of the tension.',
    zh: '管理{siblingCount}个孩子给家庭带来了巨大的压力。{childName}正在显示出紧张的迹象。'
  },
  'scenario_resource_allocation_title': {
    en: 'Resource Allocation Challenge',
    zh: '资源分配挑战'
  },
  'scenario_resource_allocation_desc': {
    en: 'With multiple children, deciding how to fairly distribute time, money, and attention has become challenging. {childName} has specific needs.',
    zh: '有了多个孩子，决定如何公平分配时间、金钱和注意力变得具有挑战性。{childName}有特定的需求。'
  },
  'scenario_sibling_conflict_title': {
    en: 'Sibling Rivalry Escalation',
    zh: '兄弟姐妹竞争升级'
  },
  'scenario_sibling_conflict_desc': {
    en: '{child1Name} and {child2Name} have been having increasingly intense conflicts that are affecting the whole family.',
    zh: '{child1Name}和{child2Name}之间的冲突越来越激烈，影响到了整个家庭。'
  },

  // Family Scenario Options
  'option_family_meeting': {
    en: 'Hold a family meeting to discuss issues',
    zh: '召开家庭会议讨论问题'
  },
  'option_individual_attention': {
    en: 'Give individual attention to each child',
    zh: '给每个孩子个别关注'
  },
  'option_professional_help': {
    en: 'Seek professional family counseling',
    zh: '寻求专业家庭咨询'
  },
  'option_equal_distribution': {
    en: 'Distribute resources equally among all children',
    zh: '在所有孩子之间平均分配资源'
  },
  'option_need_based': {
    en: 'Allocate resources based on individual needs',
    zh: '根据个人需求分配资源'
  },
  'option_mediate_conflict': {
    en: 'Actively mediate the sibling conflict',
    zh: '积极调解兄弟姐妹冲突'
  },
  'option_separate_activities': {
    en: 'Provide separate activities to reduce friction',
    zh: '提供单独的活动来减少摩擦'
  },

  // Family Scenario Consequences
  'consequence_open_communication': {
    en: 'Open family communication reduces stress and builds unity. Happiness +15, finances -500',
    zh: '开放的家庭沟通减少了压力并建立了团结。快乐度+15，财务-500'
  },
  'consequence_focused_care': {
    en: 'Individual attention helps but may create favoritism issues. Happiness +20, finances -2000',
    zh: '个别关注有所帮助但可能造成偏爱问题。快乐度+20，财务-2000'
  },
  'consequence_family_therapy': {
    en: 'Professional help provides lasting family improvements. Happiness +25, finances -5000',
    zh: '专业帮助为家庭提供持久的改善。快乐度+25，财务-5000'
  },
  'consequence_fairness_priority': {
    en: 'Equal treatment maintains harmony but strains resources. Happiness +10, finances -3000',
    zh: '平等对待维持了和谐但紧张了资源。快乐度+10，财务-3000'
  },
  'consequence_targeted_support': {
    en: 'Need-based allocation optimizes outcomes but requires careful management. Happiness +15, finances -2000',
    zh: '基于需求的分配优化了结果但需要仔细管理。快乐度+15，财务-2000'
  },
  'consequence_conflict_resolution': {
    en: 'Mediation teaches valuable conflict resolution skills. Happiness +12, finances -1000',
    zh: '调解教授了宝贵的冲突解决技能。快乐度+12，财务-1000'
  },
  'consequence_reduced_friction': {
    en: 'Separation reduces immediate conflict but may limit sibling bonding. Happiness +8, finances -1500',
    zh: '分离减少了直接冲突但可能限制兄弟姐妹的结合。快乐度+8，财务-1500'
  },

  // Adaptability Scenarios
  'scenario_flexible_thinker_title': {
    en: 'Flexible Thinker',
    zh: '灵活的思想家'
  },
  'scenario_flexible_thinker_desc': {
    en: 'Your child adapts easily to new situations and finds creative solutions when plans change unexpectedly.',
    zh: '你的孩子容易适应新情况，并在计划意外改变时找到创造性的解决方案。'
  },
  'scenario_rigid_routine_title': {
    en: 'Rigid Routine Dependence',
    zh: '依赖固定的日常'
  },
  'scenario_rigid_routine_desc': {
    en: 'Your child becomes very upset when routines change and struggles to adapt to new situations or environments.',
    zh: '你的孩子在日常改变时会非常不安，难以适应新情况或环境。'
  },
  'scenario_shape_shifter_title': {
    en: 'Natural Shape Shifter',
    zh: '天生变形者'
  },
  'scenario_shape_shifter_desc': {
    en: 'Your child\'s adaptability has manifested as actual shape-shifting magic, able to transform to meet any challenge.',
    zh: '你孩子的适应能力表现为真正的变形魔法，能够变形来应对任何挑战。'
  },
  'scenario_magic_resistance_title': {
    en: 'Magic Resistance',
    zh: '魔法抗性'
  },
  'scenario_magic_resistance_desc': {
    en: 'Your child\'s difficulty adapting has created magical barriers that resist all change, including beneficial transformations.',
    zh: '你孩子在适应方面的困难创造了抵抗所有变化的魔法屏障，包括有益的转变。'
  },
  'scenario_survival_adaptability_title': {
    en: 'Survival Adaptability',
    zh: '生存适应性'
  },
  'scenario_survival_adaptability_desc': {
    en: 'Your child excels at quickly adapting to dangerous situations, finding ways to survive in any environment.',
    zh: '你的孩子擅长快速适应危险情况，找到在任何环境中生存的方法。'
  },
  'scenario_change_anxiety_title': {
    en: 'Change Anxiety',
    zh: '变化焦虑'
  },
  'scenario_change_anxiety_desc': {
    en: 'Your child\'s fear of change has become problematic in this unpredictable world, causing panic in new situations.',
    zh: '你孩子对变化的恐惧在这个不可预测的世界里变得有问题，在新情况下会引起恐慌。'
  },

  // Humor Scenarios
  'scenario_class_clown_title': {
    en: 'Class Clown',
    zh: '班级小丑'
  },
  'scenario_class_clown_desc': {
    en: 'Your child\'s natural sense of humor makes them the center of attention, bringing joy to others but sometimes disrupting activities.',
    zh: '你孩子天生的幽默感使他们成为注意力的中心，给他人带来快乐，但有时会破坏活动。'
  },
  'scenario_serious_child_title': {
    en: 'Serious Child',
    zh: '严肃的孩子'
  },
  'scenario_serious_child_desc': {
    en: 'Your child approaches everything with intense seriousness, rarely laughing or finding humor in everyday situations.',
    zh: '你的孩子以严肃的态度对待一切，很少在日常情况下笑或找到幽默。'
  },
  'scenario_magical_jester_title': {
    en: 'Magical Jester',
    zh: '魔法小丑'
  },
  'scenario_magical_jester_desc': {
    en: 'Your child\'s humor has magical properties, able to literally brighten moods and heal emotional wounds with laughter.',
    zh: '你孩子的幽默具有魔法特性，能够通过笑声真正提升情绪和治愈情感创伤。'
  },
  'scenario_grim_prophecy_title': {
    en: 'Grim Prophecy',
    zh: '严肃预言'
  },
  'scenario_grim_prophecy_desc': {
    en: 'Your child has been touched by dark magic, making them see only serious, foreboding aspects of the magical world.',
    zh: '你的孩子被黑暗魔法触及，使他们只看到魔法世界严肃、不祥的方面。'
  },
  'scenario_survival_comedian_title': {
    en: 'Survival Comedian',
    zh: '生存喜剧演员'
  },
  'scenario_survival_comedian_desc': {
    en: 'Your child uses humor to cope with danger, lightening the mood even in the most dire circumstances.',
    zh: '你的孩子用幽默来应对危险，即使在最严峻的情况下也能缓解气氛。'
  },
  'scenario_humorless_survivor_title': {
    en: 'Humorless Survivor',
    zh: '无幽默的幸存者'
  },
  'scenario_humorless_survivor_desc': {
    en: 'The harsh world has drained all joy from your child, leaving them unable to find humor in anything.',
    zh: '严酷的世界耗尽了你孩子的所有快乐，使他们无法在任何事情中找到幽默。'
  },

  // Patience Scenarios
  'scenario_calm_observer_title': {
    en: 'Calm Observer',
    zh: '冷静的观察者'
  },
  'scenario_calm_observer_desc': {
    en: 'Your child displays remarkable patience, able to wait calmly and observe situations before acting.',
    zh: '你的孩子表现出非凡的耐心，能够冷静地等待并观察情况后再行动。'
  },
  'scenario_instant_gratification_title': {
    en: 'Instant Gratification',
    zh: '即时满足'
  },
  'scenario_instant_gratification_desc': {
    en: 'Your child struggles with waiting for anything, becoming upset when desires are not immediately fulfilled.',
    zh: '你的孩子难以等待任何事情，当愿望不能立即实现时会变得不安。'
  },
  'scenario_time_master_title': {
    en: 'Time Master',
    zh: '时间掌控者'
  },
  'scenario_time_master_desc': {
    en: 'Your child\'s patience has developed into magical time manipulation abilities, able to slow down or speed up time.',
    zh: '你孩子的耐心发展成了魔法时间操控能力，能够减慢或加快时间。'
  },
  'scenario_chaos_magic_title': {
    en: 'Chaos Magic',
    zh: '混沌魔法'
  },
  'scenario_chaos_magic_desc': {
    en: 'Your child\'s impatience creates chaotic magical outbursts that disrupt the natural order around them.',
    zh: '你孩子的不耐烦创造了混乱的魔法爆发，破坏了周围的自然秩序。'
  },
  'scenario_strategic_survivor_title': {
    en: 'Strategic Survivor',
    zh: '战略幸存者'
  },
  'scenario_strategic_survivor_desc': {
    en: 'Your child\'s patience allows them to plan carefully and wait for the right moment in dangerous situations.',
    zh: '你孩子的耐心使他们能够仔细规划并在危险情况下等待合适的时机。'
  },
  'scenario_reckless_impulse_title': {
    en: 'Reckless Impulse',
    zh: '鲁莽冲动'
  },
  'scenario_reckless_impulse_desc': {
    en: 'Your child\'s impatience leads to dangerous impulsive actions that put the family at risk.',
    zh: '你孩子的不耐烦导致危险的冲动行为，使家庭面临风险。'
  },

  // Complex Moral Dilemma Scenarios - Friendship Betrayal
  'scenario_friendship_betrayal_title': {
    en: 'The Friendship Betrayal',
    zh: '友谊背叛'
  },
  'scenario_friendship_betrayal_desc': {
    en: '{childName} discovers their best friend has been sharing their personal secrets with other classmates and spreading embarrassing stories. This betrayal has hurt {childName} deeply, but they must decide how to handle this complex social situation.',
    zh: '{childName}发现他们最好的朋友一直在和其他同学分享他们的个人秘密并传播令人尴尬的故事。这种背叛深深伤害了{childName}，但他们必须决定如何处理这种复杂的社交情况。'
  },
  'option_confront_friend': {
    en: 'A) Directly confront the friend about the betrayal',
    zh: 'A) 直接面对朋友的背叛'
  },
  'consequence_direct_confrontation': {
    en: 'Direct honesty builds assertiveness but may strain the friendship. Courage and confidence grow, but empathy decreases slightly.',
    zh: '直接的诚实培养了坚定性，但可能会紧张友谊。勇气和信心增长，但同理心略有下降。'
  },
  'option_forgive_silently': {
    en: 'B) Forgive them silently and continue the friendship',
    zh: 'B) 默默原谅他们并继续友谊'
  },
  'consequence_silent_forgiveness': {
    en: 'Silent forgiveness shows empathy but may enable people-pleasing patterns. Emotional burden increases, self-advocacy skills weaken.',
    zh: '默默的宽恕显示了同理心，但可能助长讨好他人的模式。情感负担增加，自我倡导能力减弱。'
  },
  'option_seek_adult_guidance': {
    en: 'C) Talk to a trusted adult for guidance',
    zh: 'C) 与信任的成年人交谈寻求指导'
  },
  'consequence_adult_mediation': {
    en: 'Seeking adult help develops wisdom and problem-solving skills. Trust with parents strengthens, but independence may decrease slightly.',
    zh: '寻求成年人帮助培养了智慧和解决问题的能力。与父母的信任加强，但独立性可能略有下降。'
  },
  'option_gradual_distance': {
    en: 'D) Gradually create distance without explanation',
    zh: 'D) 逐渐疏远而不解释原因'
  },
  'consequence_relationship_boundaries': {
    en: 'Setting boundaries protects emotional well-being and builds independence. Social navigation skills improve, but relationship trust becomes neutral.',
    zh: '设定界限保护情感健康并培养独立性。社交导航技能提高，但关系信任变得中性。'
  },
  'option_group_intervention': {
    en: 'E) Organize a group discussion with mutual friends',
    zh: 'E) 与共同朋友组织小组讨论'
  },
  'consequence_peer_mediation': {
    en: 'Group mediation develops leadership and cooperation skills. Peer relationships strengthen through collaborative conflict resolution.',
    zh: '群体调解培养了领导力和合作技能。通过协作解决冲突加强了同伴关系。'
  },

  // Complex Moral Dilemma Scenarios - Fantasy Friendship
  'scenario_magical_oath_dilemma_title': {
    en: 'The Magical Oath Dilemma',
    zh: '魔法誓言困境'
  },
  'scenario_magical_oath_dilemma_desc': {
    en: '{childName} made a magical oath with their best friend to never reveal each other\'s magical abilities. Now they discover their friend is using magic to harm others, and {childName} must choose between loyalty and protecting innocent people.',
    zh: '{childName}与最好的朋友立下魔法誓言，永远不透露彼此的魔法能力。现在他们发现朋友正在使用魔法伤害他人，{childName}必须在忠诚和保护无辜的人之间做出选择。'
  },
  'option_honor_magical_oath': {
    en: 'A) Honor the magical oath and remain loyal',
    zh: 'A) 履行魔法誓言并保持忠诚'
  },
  'consequence_magical_loyalty': {
    en: 'Magical loyalty strengthens the bond but may enable harmful behavior. Moral integrity develops within loyalty framework.',
    zh: '魔法忠诚加强了纽带，但可能助长有害行为。道德诚信在忠诚框架内发展。'
  },
  'option_break_oath_for_greater_good': {
    en: 'B) Break the oath to protect innocent people',
    zh: 'B) 为了保护无辜的人而违背誓言'
  },
  'consequence_utilitarian_choice': {
    en: 'Choosing the greater good develops ethical reasoning but causes guilt and damages friendship trust. Moral complexity understanding deepens.',
    zh: '选择更大的善良培养了伦理推理，但会引起内疚并损害友谊信任。道德复杂性理解加深。'
  },

  // Complex Moral Dilemma Scenarios - Academic Pressure
  'scenario_academic_pressure_title': {
    en: 'The Academic Pressure Dilemma',
    zh: '学业压力困境'
  },
  'scenario_academic_pressure_desc': {
    en: '{childName} is struggling to maintain perfect grades while friends seem to succeed effortlessly. The pressure to excel is causing stress, but {childName} fears disappointing parents and teachers. They must choose how to handle these competing demands.',
    zh: '{childName}在努力保持完美成绩的同时，朋友们似乎毫不费力地成功。追求卓越的压力造成了压力，但{childName}害怕让父母和老师失望。他们必须选择如何处理这些相互竞争的要求。'
  },
  'option_maintain_high_standards': {
    en: 'A) Maintain high academic standards at all costs',
    zh: 'A) 不惜一切代价保持高学术标准'
  },
  'consequence_perfectionist_path': {
    en: 'Perfectionist approach builds determination but increases anxiety and performance pressure. Achievement becomes tied to self-worth.',
    zh: '完美主义方法培养了决心，但增加了焦虑和表现压力。成就与自我价值联系在一起。'
  },
  'option_balanced_approach': {
    en: 'B) Seek a balanced approach between achievement and well-being',
    zh: 'B) 在成就和幸福之间寻求平衡的方法'
  },
  'consequence_holistic_development': {
    en: 'Balanced approach develops emotional intelligence and stress management. Parent-child understanding improves through open communication.',
    zh: '平衡的方法培养了情商和压力管理。通过开放的沟通改善了亲子理解。'
  },
  'option_prioritize_wellbeing': {
    en: 'C) Prioritize mental health and personal well-being',
    zh: 'C) 优先考虑心理健康和个人幸福'
  },
  'consequence_mental_health_focus': {
    en: 'Mental health focus builds self-advocacy and emotional awareness. Trust with parents deepens through vulnerability and honest communication.',
    zh: '心理健康关注培养了自我倡导和情感意识。通过脆弱性和诚实的沟通加深了与父母的信任。'
  },
  'option_peer_comparison': {
    en: 'D) Focus on competing with and surpassing peers',
    zh: 'D) 专注于与同龄人竞争并超越他们'
  },
  'consequence_competitive_mindset': {
    en: 'Competitive focus builds drive but creates comparison habits and external validation dependency. Peer relationships become more about rivalry.',
    zh: '竞争焦点培养了动力，但创造了比较习惯和外部验证依赖。同伴关系更多地关于竞争。'
  },

  // Complex Moral Dilemma Scenarios - Family Secret
  'scenario_family_secret_title': {
    en: 'The Family Secret Burden',
    zh: '家庭秘密负担'
  },
  'scenario_family_secret_desc': {
    en: '{childName} has learned about a significant family secret that affects the whole family\'s well-being. They feel burdened by this knowledge and torn between protecting family privacy and seeking support. The secret is creating emotional distance within the family.',
    zh: '{childName}了解了一个影响整个家庭福祉的重大家庭秘密。他们感到这种知识的负担，在保护家庭隐私和寻求支持之间左右为难。这个秘密在家庭内部造成了情感距离。'
  },
  'option_keep_family_secret': {
    en: 'A) Keep the family secret to protect family privacy',
    zh: 'A) 保守家庭秘密以保护家庭隐私'
  },
  'consequence_loyalty_burden': {
    en: 'Family loyalty strengthens but creates emotional burden. Secret-keeping skills develop, but emotional distance may increase within the family.',
    zh: '家庭忠诚加强但创造了情感负担。保密技能发展，但家庭内部的情感距离可能增加。'
  },
  'option_confide_in_trusted_friend': {
    en: 'B) Confide in a trusted friend for emotional support',
    zh: 'B) 向信任的朋友倾诉以获得情感支持'
  },
  'consequence_selective_sharing': {
    en: 'Selective sharing provides emotional relief and builds trust with friends. Support-seeking skills develop, but discretion becomes important.',
    zh: '选择性分享提供情感缓解并与朋友建立信任。寻求支持的技能发展，但谨慎变得重要。'
  },
  'option_family_discussion': {
    en: 'C) Initiate an open family discussion about the secret',
    zh: 'C) 发起关于秘密的开放家庭讨论'
  },
  'consequence_family_dialogue': {
    en: 'Open communication builds courage and family systems understanding. Family trust and emotional connection strengthen through honest dialogue.',
    zh: '开放的沟通培养了勇气和家庭系统理解。通过诚实的对话加强了家庭信任和情感联系。'
  },
  'option_seek_counseling': {
    en: 'D) Suggest the family seek professional counseling together',
    zh: 'D) 建议家庭一起寻求专业咨询'
  },
  'consequence_professional_support': {
    en: 'Professional support develops help-seeking skills and emotional processing abilities. Family healing begins through guided therapy sessions.',
    zh: '专业支持培养了寻求帮助的技能和情感处理能力。通过指导性治疗会话开始家庭治愈。'
  },

  // Teen Complex Scenarios - Identity Crisis (Ages 13-16)
  'scenario_identity_crisis_title': {
    en: 'Identity Crisis & Self-Discovery',
    zh: '身份危机与自我发现'
  },
  'scenario_identity_crisis_desc': {
    en: '{childName} is struggling with questions of identity, experimenting with different styles, friend groups, and values. They feel confused about who they really are and what they want to become, sometimes changing their personality completely from week to week.',
    zh: '{childName}正在为身份问题而苦恼，尝试不同的风格、朋友圈和价值观。他们对自己到底是谁以及想成为什么样的人感到困惑，有时每周都会完全改变自己的个性。'
  },
  'option_explore_different_identities': {
    en: 'A) Encourage exploring different identities and interests',
    zh: 'A) 鼓励探索不同的身份和兴趣'
  },
  'consequence_identity_exploration': {
    en: 'Identity exploration builds self-discovery and authenticity, though confidence may waver temporarily. Social experimentation skills develop.',
    zh: '身份探索培养了自我发现和真实性，尽管信心可能暂时动摇。社会实验技能得到发展。'
  },
  'option_maintain_stable_identity': {
    en: 'B) Encourage maintaining a consistent, stable identity',
    zh: 'B) 鼓励保持一致、稳定的身份'
  },
  'consequence_identity_stability': {
    en: 'Stability provides security and family approval but may suppress authentic self-expression. Consistency develops but authenticity may suffer.',
    zh: '稳定性提供安全感和家庭认可，但可能抑制真实的自我表达。一致性发展，但真实性可能受损。'
  },
  'option_seek_professional_identity_guidance': {
    en: 'C) Seek professional counseling for identity development',
    zh: 'C) 为身份发展寻求专业咨询'
  },
  'consequence_identity_counseling': {
    en: 'Professional guidance provides therapeutic insight and identity clarity. Self-awareness and emotional intelligence develop significantly.',
    zh: '专业指导提供治疗洞察和身份清晰度。自我意识和情商显著发展。'
  },
  'option_family_identity_discussions': {
    en: 'D) Have open family discussions about identity and values',
    zh: 'D) 就身份和价值观进行开放的家庭讨论'
  },
  'consequence_family_identity_support': {
    en: 'Family support validates identity exploration within a loving framework. Trust and understanding deepen through intergenerational dialogue.',
    zh: '家庭支持在充满爱的框架内验证身份探索。通过代际对话加深信任和理解。'
  },
  'option_peer_identity_validation': {
    en: 'E) Seek validation and guidance from peer groups',
    zh: 'E) 从同伴群体中寻求验证和指导'
  },
  'consequence_peer_identity_influence': {
    en: 'Peer validation provides belonging but may prioritize external approval over authenticity. Social identity develops through group influence.',
    zh: '同伴验证提供归属感，但可能将外部认可置于真实性之上。社会身份通过群体影响发展。'
  },

  // Teen Complex Scenarios - Peer Pressure (Ages 14-17)
  'scenario_peer_pressure_title': {
    en: 'The Peer Pressure Crossroads',
    zh: '同伴压力十字路口'
  },
  'scenario_peer_pressure_desc': {
    en: '{childName} is facing intense pressure from friends to engage in activities that conflict with family values and personal ethics. The social stakes feel incredibly high, and {childName} fears losing friendships and social status if they don\'t conform.',
    zh: '{childName}面临来自朋友的强烈压力，要求参与与家庭价值观和个人道德相冲突的活动。社交风险感觉非常高，{childName}担心如果不顺从就会失去友谊和社会地位。'
  },
  'option_resist_peer_pressure': {
    en: 'A) Stand firm against peer pressure and maintain personal values',
    zh: 'A) 坚定抵制同伴压力并保持个人价值观'
  },
  'consequence_moral_independence': {
    en: 'Moral courage develops through standing up for values, though social confidence may temporarily decrease. Family trust and self-respect increase.',
    zh: '通过坚持价值观培养道德勇气，尽管社交信心可能暂时下降。家庭信任和自尊增加。'
  },
  'option_compromise_values': {
    en: 'B) Compromise personal values for social acceptance',
    zh: 'B) 为了社会接受而妥协个人价值观'
  },
  'consequence_social_acceptance': {
    en: 'Social acceptance increases but at the cost of authenticity and potential internal conflict. Peer approval grows but moral flexibility may become problematic.',
    zh: '社会接受度增加，但以真实性和潜在内心冲突为代价。同伴认可增长，但道德灵活性可能成为问题。'
  },
  'option_find_alternative_peer_group': {
    en: 'C) Seek out peers with similar values and interests',
    zh: 'C) 寻找有相似价值观和兴趣的同伴'
  },
  'consequence_new_social_circles': {
    en: 'Social courage develops through creating new relationships. Value alignment and authentic relationship building skills strengthen significantly.',
    zh: '通过建立新关系培养社交勇气。价值观一致性和真实关系构建技能显著加强。'
  },
  'option_educate_peers': {
    en: 'D) Try to influence friends toward better choices',
    zh: 'D) 试图影响朋友做出更好的选择'
  },
  'consequence_peer_leadership': {
    en: 'Leadership and communication skills develop through moral influence. Social leadership and advocacy abilities grow through positive peer influence.',
    zh: '通过道德影响培养领导力和沟通技能。通过积极的同伴影响发展社会领导力和倡导能力。'
  },

  // Teen Complex Scenarios - First Romance (Ages 15-18)
  'scenario_first_romance_title': {
    en: 'First Serious Romantic Relationship',
    zh: '第一次认真的恋爱关系'
  },
  'scenario_first_romance_desc': {
    en: '{childName} has entered their first serious romantic relationship and is navigating intense emotions, physical attraction, and relationship dynamics. They must balance romance with other life priorities while learning about healthy relationships.',
    zh: '{childName}进入了他们第一次认真的恋爱关系，正在处理强烈的情感、身体吸引力和关系动态。他们必须在学习健康关系的同时平衡恋爱与其他生活优先事项。'
  },
  'option_take_relationship_slow': {
    en: 'A) Encourage taking the relationship slowly and building emotional connection',
    zh: 'A) 鼓励慢慢发展关系并建立情感联系'
  },
  'consequence_healthy_pacing': {
    en: 'Healthy pacing develops emotional maturity and relationship skills. Self-respect and communication abilities strengthen through mindful relationship building.',
    zh: '健康的节奏培养情感成熟度和关系技能。通过用心的关系建设加强自尊和沟通能力。'
  },
  'option_intense_relationship_commitment': {
    en: 'B) Allow deep emotional and time investment in the relationship',
    zh: 'B) 允许在关系中进行深度情感和时间投资'
  },
  'consequence_relationship_intensity': {
    en: 'Relationship intensity builds passion and commitment but may risk codependency. Strong emotional bonds form but independence may decrease.',
    zh: '关系强度培养激情和承诺，但可能存在相互依赖的风险。形成强烈的情感纽带，但独立性可能降低。'
  },
  'option_maintain_independence': {
    en: 'C) Maintain personal independence and other relationships',
    zh: 'C) 保持个人独立和其他关系'
  },
  'consequence_balanced_relationship': {
    en: 'Healthy autonomy develops through relationship balance. Independence and self-confidence grow while maintaining friendship networks.',
    zh: '通过关系平衡培养健康的自主性。在维持友谊网络的同时，独立性和自信心增长。'
  },
  'option_family_guidance_romance': {
    en: 'D) Seek family guidance and maintain close family involvement',
    zh: 'D) 寻求家庭指导并保持密切的家庭参与'
  },
  'consequence_guided_romance': {
    en: 'Family wisdom guides relationship development with intergenerational support. Cautious love develops within family value framework.',
    zh: '家庭智慧在代际支持下指导关系发展。在家庭价值框架内发展谨慎的爱情。'
  },

  // Teen Complex Scenarios - Future Planning (Ages 16-18)
  'scenario_future_planning_title': {
    en: 'College and Career Pressure',
    zh: '大学和职业压力'
  },
  'scenario_future_planning_desc': {
    en: '{childName} faces intense pressure to make life-defining decisions about college, career, and future direction. Everyone has opinions about what they should do, but {childName} feels torn between practical security and personal passion.',
    zh: '{childName}面临着对大学、职业和未来方向做出定义人生决定的巨大压力。每个人都对他们应该做什么有意见，但{childName}在实际安全和个人激情之间感到左右为难。'
  },
  'option_follow_passion': {
    en: 'A) Follow personal passion despite financial uncertainty',
    zh: 'A) 尽管经济不确定，仍追随个人激情'
  },
  'consequence_passion_pursuit': {
    en: 'Passion pursuit builds authenticity and intrinsic motivation. Self-actualization develops but financial security may be uncertain.',
    zh: '追求激情建立真实性和内在动机。自我实现得到发展，但经济安全可能不确定。'
  },
  'option_practical_safe_choice': {
    en: 'B) Choose practical, financially secure career path',
    zh: 'B) 选择实用、经济稳定的职业道路'
  },
  'consequence_security_focus': {
    en: 'Security orientation provides financial stability and family approval. Practical thinking develops but passion may be suppressed.',
    zh: '安全导向提供经济稳定和家庭认可。实用思维得到发展，但激情可能被抑制。'
  },
  'option_gap_year_exploration': {
    en: 'C) Take a gap year to explore options and gain life experience',
    zh: 'C) 休学一年探索选择并获得生活经验'
  },
  'consequence_life_exploration': {
    en: 'Life exploration builds self-discovery and independence. Identity exploration and life experience develop through delayed gratification.',
    zh: '生活探索建立自我发现和独立性。通过延迟满足发展身份探索和生活经验。'
  },
  'option_balanced_approach_future': {
    en: 'D) Find a balanced approach combining passion and practicality',
    zh: 'D) 找到结合激情和实用性的平衡方法'
  },
  'consequence_integrated_planning': {
    en: 'Integrative thinking develops through balancing multiple considerations. Strategic planning and value synthesis skills strengthen significantly.',
    zh: '通过平衡多种考虑发展整合思维。战略规划和价值综合技能显著加强。'
  },

  // Teen Complex Scenarios - Independence Conflict (Ages 17-18)
  'scenario_independence_conflict_title': {
    en: 'Family Independence Conflict',
    zh: '家庭独立冲突'
  },
  'scenario_independence_conflict_desc': {
    en: '{childName} desires greater independence and adult privileges, but parents worry about their readiness and want to maintain protective boundaries. Conflicts arise over curfew, decision-making, financial support, and future planning.',
    zh: '{childName}渴望更大的独立性和成年特权，但父母担心他们的准备情况并希望保持保护性界限。在宵禁、决策、经济支持和未来规划方面发生冲突。'
  },
  'option_assert_full_independence': {
    en: 'A) Assert full independence and adult decision-making rights',
    zh: 'A) 主张完全独立和成年决策权'
  },
  'consequence_independence_assertion': {
    en: 'Autonomy development accelerates through self-reliance, though family tension may increase. Independence grows but family relationships may become strained.',
    zh: '通过自力更生加速自主发展，尽管家庭紧张可能增加。独立性增长，但家庭关系可能变得紧张。'
  },
  'option_gradual_independence': {
    en: 'B) Negotiate gradual independence with family cooperation',
    zh: 'B) 与家庭合作协商逐步独立'
  },
  'consequence_negotiated_freedom': {
    en: 'Healthy separation develops through cooperation and negotiation. Relationship preservation and conflict resolution skills strengthen significantly.',
    zh: '通过合作和协商发展健康的分离。关系保护和冲突解决技能显著加强。'
  },
  'option_family_therapy_independence': {
    en: 'C) Engage in family therapy to navigate transition together',
    zh: 'C) 参与家庭治疗共同度过过渡期'
  },
  'consequence_therapeutic_transition': {
    en: 'Family systems understanding develops through therapeutic guidance. Healthy boundaries and intergenerational healing strengthen family bonds.',
    zh: '通过治疗指导发展家庭系统理解。健康的边界和代际治愈加强家庭纽带。'
  },
  'option_delayed_independence': {
    en: 'D) Delay independence to maintain family harmony',
    zh: 'D) 延迟独立以维持家庭和谐'
  },
  'consequence_extended_dependence': {
    en: 'Family harmony maintains closeness but may delay healthy development. Family loyalty strengthens but autonomy development may be suppressed.',
    zh: '家庭和谐保持亲密关系，但可能延迟健康发展。家庭忠诚加强，但自主发展可能被抑制。'
  }
};

export class TranslationService {
  private static currentLanguage: Language = 'en';
  
  static setLanguage(language: Language) {
    this.currentLanguage = language;
  }
  
  static getCurrentLanguage(): Language {
    return this.currentLanguage;
  }
  
  static translate(key: string): string {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[this.currentLanguage];
  }
  
  static t = this.translate.bind(this);
}