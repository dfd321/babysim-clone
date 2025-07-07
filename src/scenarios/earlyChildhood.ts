import { ScenarioModule } from './types';

// Ages 1-3: Early Childhood scenarios
export const earlyChildhoodScenarios: ScenarioModule = {
  ageRange: { min: 1, max: 3 },
  scenarios: {
    1: {
      Realistic: {
        title: "First Steps Crisis",
        description: "Your child is delayed in reaching developmental milestones compared to peers. Other parents are commenting, and you're worried about long-term development.",
        options: [
          { label: "A) Early intervention therapy", consequence: "Professional help accelerates development. Happiness +20, finances -8000" },
          { label: "B) Wait naturally", consequence: "Patience pays off but worry continues. Happiness -15, finances +0" },
          { label: "C) Alternative methods", consequence: "Mixed results from unconventional approaches. Happiness +5, finances -3000" },
          { label: "D) Multiple medical opinions", consequence: "Comprehensive assessment provides peace of mind. Happiness +25, finances -12000" }
        ]
      },
      Fantasy: {
        title: "The First Magic",
        description: "Your baby's tears turn into wish-granting crystals, attracting magical attention from both good and evil forces.",
        options: [
          { label: "A) Crystal Guardian protection", consequence: "Magical protection but restricted freedom. Happiness -10, finances +15000" },
          { label: "B) Hide abilities", consequence: "Safety through secrecy but constant fear. Happiness -25, finances -5000" },
          { label: "C) Share gift openly", consequence: "Community support but unwanted attention. Happiness +15, finances +8000" },
          { label: "D) Seek magical scholars", consequence: "Expert guidance for magical development. Happiness +30, finances -10000" }
        ]
      },
      Thrilling: {
        title: "Baby Kidnapping Plot",
        description: "Your child has demonstrated superhuman memory abilities, making them a target for intelligence agencies and criminal organizations.",
        options: [
          { label: "A) Government cooperation", consequence: "Official protection but loss of privacy. Happiness -5, finances +20000" },
          { label: "B) Flee with false identities", consequence: "Freedom but constant running. Happiness -20, finances -25000" },
          { label: "C) Go public for protection", consequence: "Media attention provides safety shield. Happiness -15, finances +50000" },
          { label: "D) Negotiate with all parties", consequence: "Diplomatic solution balances interests. Happiness +10, finances +10000" }
        ]
      }
    },
    2: {
      Realistic: {
        title: "Daycare Disaster",
        description: "Your child has been expelled from daycare for aggressive behavior - biting other children and having violent meltdowns. You're getting calls from work daily, and other parents are complaining.",
        options: [
          { label: "A) Quit your job to stay home", consequence: "Intensive training works but massive financial hit. Happiness +25, finances -15000" },
          { label: "B) Hire behavioral specialist", consequence: "Professional help transforms behavior. Happiness +30, finances -8000" },
          { label: "C) Keep switching daycares", consequence: "Child becomes more unstable from constant changes. Happiness -25, finances -2000" },
          { label: "D) Leave with untrained family", consequence: "Behavioral problems worsen dramatically. Happiness -35, finances -500" }
        ]
      },
      Fantasy: {
        title: "Magical Outbursts",
        description: "Your child's magical abilities are manifesting as destructive tantrums. When angry, objects burst into flames or shatter.",
        options: [
          { label: "A) Seek Elder Mages training", consequence: "Child learns control but you owe magical debts. Happiness +30, finances -5000" },
          { label: "B) Suppress with binding spells", consequence: "Magic contained but child becomes withdrawn. Happiness -20, finances -3000" },
          { label: "C) Let them express freely", consequence: "Powers grow wild, family becomes outcasts. Happiness -30, finances -10000" },
          { label: "D) Move to magical sanctuary", consequence: "Safe environment but isolated from normal world. Happiness +15, finances -12000" }
        ]
      },
      Thrilling: {
        title: "Life-Threatening Tantrum",
        description: "During a massive public meltdown, your child ran into traffic and was nearly hit by a car. Witnesses are calling child services.",
        options: [
          { label: "A) Crisis management team", consequence: "Public relations managed, child gets help. Happiness +20, finances -12000" },
          { label: "B) Flee the city", consequence: "Escape scrutiny but lose everything built. Happiness -15, finances -20000" },
          { label: "C) Fight accusations publicly", consequence: "Some support you but child more traumatized. Happiness -25, finances -5000" },
          { label: "D) Accept intervention", consequence: "Lose custody temporarily, devastating. Happiness -40, finances -8000" }
        ]
      }
    },
    3: {
      Realistic: {
        title: "Preschool Preparation Panic",
        description: "Your child has severe separation anxiety and social difficulties as preschool approaches. They cling to you and have meltdowns around other children.",
        options: [
          { label: "A) Delay preschool entry", consequence: "More time to prepare but social delay. Happiness +20, finances -12000" },
          { label: "B) Intensive preparation", consequence: "Structured approach builds confidence. Happiness +25, finances -15000" },
          { label: "C) Send unprepared", consequence: "Sink or swim approach causes trauma. Happiness -20, finances +0" },
          { label: "D) Gradual exposure", consequence: "Slow progress builds steady confidence. Happiness +10, finances -5000" }
        ]
      },
      Fantasy: {
        title: "Elemental Powers Emerge",
        description: "Your child can control elements based on emotions and must choose which element to specialize in for proper training.",
        options: [
          { label: "A) Choose fire element", consequence: "Powerful but dangerous specialization. Happiness -15, finances +5000" },
          { label: "B) Choose water element", consequence: "Gentle and healing element mastery. Happiness +25, finances +10000" },
          { label: "C) Refuse to choose", consequence: "Unstable powers without focus. Happiness -25, finances -20000" },
          { label: "D) Let child choose", consequence: "Natural affinity leads to best outcome. Happiness +20, finances +8000" }
        ]
      },
      Thrilling: {
        title: "Bioweapon Exposure",
        description: "Your child was exposed to an experimental substance that enhances their physical and mental abilities, making them valuable to various organizations.",
        options: [
          { label: "A) Government monitoring", consequence: "Medical care but constant surveillance. Happiness -10, finances +25000" },
          { label: "B) Underground treatment", consequence: "Risky but maintains freedom. Happiness -15, finances -30000" },
          { label: "C) Natural reversal", consequence: "Attempting to reverse enhancement. Happiness +5, finances -10000" },
          { label: "D) Embrace and train", consequence: "Develop abilities safely. Happiness +20, finances +15000" }
        ]
      }
    }
  }
};

export default earlyChildhoodScenarios;