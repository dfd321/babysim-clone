import { ScenarioModule } from './types';

// Ages 9-12: Pre-teen scenarios
export const preTeenScenarios: ScenarioModule = {
  ageRange: { min: 9, max: 12 },
  scenarios: {
    9: {
      Realistic: {
        title: "Friend Group Drama",
        description: "Your child is caught in the middle of friend group conflicts and social factions that are causing stress and isolation.",
        options: [
          { label: "A) Stay neutral", consequence: "Diplomatic but lonely approach. Happiness -5, finances +0" },
          { label: "B) Find new friends", consequence: "Fresh social connections formed. Happiness +20, finances -2000" },
          { label: "C) Mediate conflicts", consequence: "Peacemaking builds leadership skills. Happiness +25, finances +0" },
          { label: "D) Individual friendships", consequence: "One-on-one relationships preferred. Happiness +15, finances +0" }
        ]
      },
      Fantasy: {
        title: "Time Magic Awakening",
        description: "Your child can see and manipulate time streams, but the Time Guardians warn this power comes with great responsibility.",
        options: [
          { label: "A) Guardian training", consequence: "Official time magic education. Happiness -10, finances +10000" },
          { label: "B) Help others only", consequence: "Altruistic use of time powers. Happiness +25, finances +5000" },
          { label: "C) Suppress abilities", consequence: "Safety but unfulfilled potential. Happiness -20, finances -8000" },
          { label: "D) Natural experimentation", consequence: "Learning through experience. Happiness +10, finances -5000" }
        ]
      },
      Thrilling: {
        title: "Underground Fighting Ring",
        description: "Your child's martial arts skills have attracted attention from an illegal fighting organization offering dangerous opportunities.",
        options: [
          { label: "A) Forbid involvement", consequence: "Safety but disappointment. Happiness -15, finances +0" },
          { label: "B) Controlled participation", consequence: "Supervised competitive fighting. Happiness +20, finances +15000" },
          { label: "C) Legitimate competitions", consequence: "Official martial arts tournaments. Happiness +25, finances +10000" },
          { label: "D) Teach others instead", consequence: "Sharing skills builds community. Happiness +30, finances +5000" }
        ]
      }
    },
    10: {
      Realistic: {
        title: "Middle School Transition Anxiety",
        description: "Your child is extremely anxious about starting middle school next year, with panic attacks and school avoidance behaviors.",
        options: [
          { label: "A) Preparation programs", consequence: "Structured transition support. Happiness +20, finances -3000" },
          { label: "B) Repeat 5th grade", consequence: "Extra year but delayed development. Happiness -5, finances +0" },
          { label: "C) Anxiety counseling", consequence: "Professional mental health support. Happiness +25, finances -8000" },
          { label: "D) Reassurance only", consequence: "Minimal intervention approach. Happiness +5, finances +0" }
        ]
      },
      Fantasy: {
        title: "Ancient Magic Artifact Discovery",
        description: "Your child has found an ancient magical artifact that bonds with them, attracting dangerous attention from dark forces.",
        options: [
          { label: "A) Magical authorities", consequence: "Official protection but bureaucracy. Happiness -15, finances +5000" },
          { label: "B) Secret training", consequence: "Hidden development of artifact powers. Happiness +20, finances -15000" },
          { label: "C) Experienced mentors", consequence: "Wise guidance for artifact mastery. Happiness +30, finances -10000" },
          { label: "D) Destroy artifact", consequence: "Safety but lost magical potential. Happiness -25, finances -12000" }
        ]
      },
      Thrilling: {
        title: "Corporate Heir Target",
        description: "Your child has been revealed as heir to a massive fortune, with multiple factions competing for control over their inheritance.",
        options: [
          { label: "A) Accept inheritance", consequence: "Wealth but dangerous responsibilities. Happiness -20, finances +100000" },
          { label: "B) Reject inheritance", consequence: "Freedom but financial struggles. Happiness -10, finances -20000" },
          { label: "C) Trust until adulthood", consequence: "Delayed but secure arrangement. Happiness +15, finances +50000" },
          { label: "D) Immediate philanthropy", consequence: "Generous but wise use of wealth. Happiness +30, finances +25000" }
        ]
      }
    },
    11: {
      Realistic: {
        title: "Social Media Nightmare",
        description: "Your child is being severely cyberbullied on social media. Cruel memes about them have gone viral at school, they're receiving death threats.",
        options: [
          { label: "A) Legal action against bullies", consequence: "Protection but child labeled as snitch. Happiness +10, finances -15000" },
          { label: "B) Delete social media and change schools", consequence: "Fresh start but problem may follow. Happiness +5, finances -20000" },
          { label: "C) School intervention program", consequence: "Slow progress but addresses root causes. Happiness +15, finances -5000" },
          { label: "D) Teach them to fight back online", consequence: "Empowering but escalates situation. Happiness -10, finances -2000" }
        ]
      },
      Fantasy: {
        title: "Dream Walker's Curse",
        description: "Your child has developed the ability to enter and manipulate dreams. They've been helping friends with nightmares, but now they're trapped in someone else's nightmare realm.",
        options: [
          { label: "A) Hire master dream walker", consequence: "Expert help but dangerous journey. Happiness +20, finances -30000" },
          { label: "B) Enter dream realm yourself", consequence: "Parent-child bond helps but you risk getting trapped. Happiness +15, finances -10000" },
          { label: "C) Use magical artifacts", consequence: "Quick but may cause permanent damage. Happiness -20, finances -25000" },
          { label: "D) Wait and trust them", consequence: "Shows faith but time is running out. Happiness -15, finances -5000" }
        ]
      },
      Thrilling: {
        title: "Gang Recruitment Pressure",
        description: "A dangerous gang is aggressively recruiting your child, using threats against your family. They've already beaten up your child once for refusing.",
        options: [
          { label: "A) Hire private security", consequence: "Protection but expensive and temporary. Happiness +5, finances -40000" },
          { label: "B) Relocate family immediately", consequence: "Safety but lose everything built. Happiness -10, finances -50000" },
          { label: "C) Community anti-gang programs", consequence: "Long-term solution but immediate danger. Happiness +10, finances -8000" },
          { label: "D) Confront gang leaders", consequence: "Dangerous gamble that might earn respect or death. Happiness -25, finances -5000" }
        ]
      }
    },
    12: {
      Realistic: {
        title: "Teen Pregnancy Scare",
        description: "You discovered your 12-year-old has been sexually active with a 16-year-old. They might be pregnant, refuse to talk about it, and are threatening to run away if you involve authorities.",
        options: [
          { label: "A) Report to authorities", consequence: "Legal situation handled but child feels betrayed. Happiness +10, finances -20000" },
          { label: "B) Handle privately with therapy", consequence: "Family stays together but legal issues unresolved. Happiness +20, finances -15000" },
          { label: "C) Move to different state", consequence: "Escape problems but child's issues follow. Happiness -5, finances -60000" },
          { label: "D) Trust child to handle it", consequence: "Situation spirals completely out of control. Happiness -50, finances -30000" }
        ]
      },
      Fantasy: {
        title: "The Soul Bond Ritual",
        description: "Your child has been chosen by an ancient dragon for a soul-bonding ritual that happens once every 1000 years. Success would give them incredible power and immortality, but failure means death.",
        options: [
          { label: "A) Allow the bonding", consequence: "Child becomes immortal guardian but you never see them again. Happiness -30, finances -20000" },
          { label: "B) Fight the dragon", consequence: "Epic battle but likely death for everyone. Happiness -40, finances -100000" },
          { label: "C) Seek magical intervention", consequence: "Ritual broken but dragon's curse haunts family. Happiness -15, finances -50000" },
          { label: "D) Negotiate compromise", consequence: "Partial bond allows visits but child forever changed. Happiness +5, finances -30000" }
        ]
      },
      Thrilling: {
        title: "International Incident",
        description: "Your child accidentally started a diplomatic crisis by hacking into embassy computers during a school project. Foreign agents are demanding extradition, the CIA wants to recruit them.",
        options: [
          { label: "A) Cooperate with government", consequence: "Child becomes asset but loses normal childhood. Happiness +15, finances -40000" },
          { label: "B) Flee to non-extradition country", consequence: "Safety but permanent exile from homeland. Happiness -25, finances -80000" },
          { label: "C) Fight extradition in court", consequence: "Legal victory but years of stress and danger. Happiness +10, finances -100000" },
          { label: "D) Turn child over", consequence: "Crisis ends but you lose your child forever. Happiness -60, finances -20000" }
        ]
      }
    }
  }
};

export default preTeenScenarios;