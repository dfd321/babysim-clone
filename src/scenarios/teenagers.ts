import { ScenarioModule } from './types';

// Ages 13-18: Teenager scenarios
export const teenagerScenarios: ScenarioModule = {
  ageRange: { min: 13, max: 18 },
  scenarios: {
    13: {
      Realistic: {
        title: "Gender Identity Crisis",
        description: "Your child has come out as transgender and wants to start hormone therapy. Half your family is supportive, the other half threatens to cut you off.",
        options: [
          { label: "A) Full support including medical transition", consequence: "Child thrives but family divides. Happiness +25, finances -25000" },
          { label: "B) Support socially but delay medical decisions", consequence: "Compromise approach with mixed results. Happiness +10, finances -10000" },
          { label: "C) Seek family therapy for middle ground", consequence: "Slow progress but family stays together. Happiness +15, finances -15000" },
          { label: "D) Insist they wait until older", consequence: "Child feels rejected and pulls away. Happiness -30, finances -5000" }
        ]
      },
      Fantasy: {
        title: "Shapeshifter's Dilemma",
        description: "Your child's shapeshifting abilities have manifested, allowing them to take any form. They're using it to escape their identity, becoming different people daily.",
        options: [
          { label: "A) Force human form only", consequence: "Identity preserved but abilities suppressed. Happiness -15, finances -10000" },
          { label: "B) Let them explore freely", consequence: "Happy but risk losing human identity. Happiness +20, finances -20000" },
          { label: "C) Hire identity anchor specialist", consequence: "Professional help to balance forms. Happiness +25, finances -35000" },
          { label: "D) Join shapeshifter community", consequence: "Peer support but isolated from humans. Happiness +15, finances -15000" }
        ]
      },
      Thrilling: {
        title: "Dark Web Discovery",
        description: "You discovered your child has been recruited as a hacker for a dark web crime syndicate. They've already stolen thousands in cryptocurrency and know too much to simply walk away.",
        options: [
          { label: "A) FBI cooperation and witness protection", consequence: "Safety but complete life upheaval. Happiness -10, finances -60000" },
          { label: "B) Hire hackers to fake death", consequence: "Freedom but constant hiding. Happiness -20, finances -80000" },
          { label: "C) Negotiate exit with syndicate", consequence: "Dangerous but might find compromise. Happiness +5, finances -100000" },
          { label: "D) Use skills to destroy syndicate", consequence: "Fight back but extreme danger. Happiness -30, finances -40000" }
        ]
      }
    },
    14: {
      Realistic: {
        title: "Eating Disorder Emergency",
        description: "Your child has been hospitalized for severe anorexia. They're at 60% of healthy body weight and their organs are starting to fail. The treatment center costs $100,000 with no guarantee of success.",
        options: [
          { label: "A) Sell house for best treatment", consequence: "Top care but financial devastation. Happiness +20, finances -100000" },
          { label: "B) Try outpatient treatment at home", consequence: "Affordable but may not be enough. Happiness +5, finances -20000" },
          { label: "C) Court-ordered involuntary treatment", consequence: "Forces help but damages trust. Happiness -10, finances -40000" },
          { label: "D) Let them make own choices", consequence: "Respects autonomy but life-threatening. Happiness -40, finances -10000" }
        ]
      },
      Fantasy: {
        title: "Blood Magic Awakening",
        description: "Your teenager's blood has awakened as the most powerful magical catalyst in generations. Every drop can grant wishes, cure diseases, or create weapons.",
        options: [
          { label: "A) Accept Blood Mage protection", consequence: "Safety but child becomes their property. Happiness -20, finances +50000" },
          { label: "B) Magical suppression surgery", consequence: "Removes power and danger permanently. Happiness +10, finances -60000" },
          { label: "C) Create family blood magic circle", consequence: "Family shares power and protection. Happiness +25, finances -30000" },
          { label: "D) Magical witness protection", consequence: "Hidden but isolated from world. Happiness -15, finances -40000" }
        ]
      },
      Thrilling: {
        title: "School Shooting Survivor",
        description: "Your child survived a school shooting by playing dead among their classmates' bodies. They have severe PTSD, can't return to any school, and have become agoraphobic.",
        options: [
          { label: "A) Intensive trauma therapy", consequence: "Healing but isolated recovery. Happiness +15, finances -50000" },
          { label: "B) Move somewhere remote", consequence: "Escape triggers but running from trauma. Happiness -5, finances -70000" },
          { label: "C) Join survivor advocacy", consequence: "Purpose from pain but reliving trauma. Happiness +10, finances -20000" },
          { label: "D) Sue everyone involved", consequence: "Potential justice but prolonged suffering. Happiness -20, finances -30000" }
        ]
      }
    },
    15: {
      Realistic: {
        title: "Teen Romance Turned Abusive",
        description: "Your 15-year-old is in an abusive relationship with an 18-year-old. They have bruises they're hiding, their grades have plummeted, and they've cut off all friends.",
        options: [
          { label: "A) Police intervention", consequence: "Legal protection but child feels betrayed. Happiness +5, finances -15000" },
          { label: "B) Secret therapy and gradual intervention", consequence: "Slow but maintains trust. Happiness +20, finances -25000" },
          { label: "C) Forcibly separate them immediately", consequence: "Stops abuse but child rebels dangerously. Happiness -15, finances -10000" },
          { label: "D) Try to befriend partner", consequence: "Risky approach that rarely works. Happiness -25, finances -5000" }
        ]
      },
      Fantasy: {
        title: "Prophecy's Chosen Sacrifice",
        description: "Ancient prophecy states your 15-year-old must sacrifice themselves on their 16th birthday to prevent apocalypse. Religious zealots are preparing the ritual.",
        options: [
          { label: "A) Flee to prophecy-null dimension", consequence: "Family safe but world potentially doomed. Happiness +30, finances -80000" },
          { label: "B) Fight to break prophecy's power", consequence: "Dangerous battle against fate itself. Happiness -10, finances -100000" },
          { label: "C) Find prophecy loophole", consequence: "Possible solution but time running out. Happiness +15, finances -50000" },
          { label: "D) Prepare child for sacrifice", consequence: "Accept fate but lose your child. Happiness -50, finances -20000" }
        ]
      },
      Thrilling: {
        title: "Human Trafficking Near-Miss",
        description: "Your teen was groomed online and nearly trafficked after meeting someone they thought was a fellow teenager. They escaped but the trafficking ring knows your address.",
        options: [
          { label: "A) Private security and investigation", consequence: "Professional protection and justice. Happiness +20, finances -75000" },
          { label: "B) Disappear into witness protection", consequence: "Safety but lose entire life. Happiness -15, finances -50000" },
          { label: "C) Go public with media campaign", consequence: "Pressure authorities but increase danger. Happiness +5, finances -20000" },
          { label: "D) Take justice into own hands", consequence: "Dangerous vigilante action. Happiness -30, finances -30000" }
        ]
      }
    },
    16: {
      Realistic: {
        title: "Fatal Car Accident",
        description: "Your teen was driving drunk and killed another teenager in a crash. They're facing vehicular manslaughter charges, the victim's family is demanding maximum punishment.",
        options: [
          { label: "A) Fight for reduced charges", consequence: "Lighter sentence but family goes bankrupt. Happiness +15, finances -150000" },
          { label: "B) Accept plea deal", consequence: "Child goes to prison but gets therapy. Happiness +5, finances -50000" },
          { label: "C) Move away and change identities", consequence: "Escape public shame but legal issues follow. Happiness -20, finances -100000" },
          { label: "D) Let public defender handle", consequence: "Maximum sentence, child's life destroyed. Happiness -55, finances -25000" }
        ]
      },
      Fantasy: {
        title: "The Darkness Awakens",
        description: "Your teenager has been possessed by an ancient evil that feeds on their anger and pain. They're becoming a vessel for dark magic that grows stronger each day.",
        options: [
          { label: "A) Risk dangerous exorcism", consequence: "Entity banished but child may not survive. Happiness +25, finances -75000" },
          { label: "B) Seek to contain darkness", consequence: "Dark power controlled but child forever changed. Happiness -10, finances -50000" },
          { label: "C) Accept possession and guide entity", consequence: "Dangerous alliance but child retains humanity. Happiness -20, finances -25000" },
          { label: "D) Abandon child to protect others", consequence: "Family safe but lose child to darkness. Happiness -50, finances -30000" }
        ]
      },
      Thrilling: {
        title: "Terrorism Accusation",
        description: "Your teenager has been accused of planning a school bombing after authorities found suspicious materials and manifestos in their room.",
        options: [
          { label: "A) Hire best criminal defense", consequence: "Strong legal defense but massive financial burden. Happiness +20, finances -200000" },
          { label: "B) Cooperate fully with authorities", consequence: "Transparency helps but child traumatized. Happiness +10, finances -75000" },
          { label: "C) Move to another country", consequence: "Escape prosecution but become fugitives. Happiness -30, finances -120000" },
          { label: "D) Trust public defender", consequence: "Inadequate defense, child likely convicted. Happiness -60, finances -40000" }
        ]
      }
    },
    17: {
      Realistic: {
        title: "College Application Scandal",
        description: "You discovered your child cheated on their SATs and falsified extracurriculars on college applications. They've already been accepted to their dream Ivy League school.",
        options: [
          { label: "A) Make them confess and withdraw", consequence: "Ethical choice but destroys their future. Happiness -20, finances -30000" },
          { label: "B) Keep quiet and let them attend", consequence: "They succeed but built on lies. Happiness +10, finances -80000" },
          { label: "C) Anonymous tip to protect legally", consequence: "Covers you but betrays your child. Happiness -35, finances -20000" },
          { label: "D) Negotiate honest admission elsewhere", consequence: "Compromise preserves some opportunities. Happiness +5, finances -40000" }
        ]
      },
      Fantasy: {
        title: "Magical Academy Final Trial",
        description: "Your child must pass the Deadly Seven Trials to graduate from magical academy. Each trial has a 20% fatality rate, but success grants master-level powers.",
        options: [
          { label: "A) Support participation fully", consequence: "Shows faith but may lose them. Happiness +20, finances -50000" },
          { label: "B) Secretly sabotage trials", consequence: "Protects them but destroys trust if discovered. Happiness -15, finances -75000" },
          { label: "C) Offer alternative education", consequence: "Safe but less prestigious path. Happiness +10, finances -100000" },
          { label: "D) Let them choose without influence", consequence: "Respects autonomy with uncertain outcome. Happiness +5, finances -25000" }
        ]
      },
      Thrilling: {
        title: "International Spy Recruitment",
        description: "Your brilliant child has been recruited by multiple intelligence agencies. The CIA offers a full scholarship and future career, but the work is dangerous.",
        options: [
          { label: "A) Encourage patriotic CIA path", consequence: "Prestigious but dangerous career. Happiness +15, finances +60000" },
          { label: "B) Forbid all intelligence work", consequence: "Safety but wastes their talents. Happiness -20, finances -10000" },
          { label: "C) Help them stay freelance", consequence: "Freedom but no protection. Happiness +10, finances +40000" },
          { label: "D) Consider foreign offer", consequence: "Lucrative but morally complex. Happiness -10, finances +150000" }
        ]
      }
    },
    18: {
      Realistic: {
        title: "Addiction and Overdose",
        description: "Your child has been hiding a severe drug addiction and just overdosed at a college party. They're in the ICU fighting for their life, facing expulsion and criminal charges.",
        options: [
          { label: "A) Pay for exclusive rehabilitation", consequence: "Best chance of recovery but financial ruin. Happiness +30, finances -180000" },
          { label: "B) Use tough love approach", consequence: "They might learn but could also die. Happiness -20, finances -10000" },
          { label: "C) Take custody and move home", consequence: "Close monitoring but enabling behavior. Happiness +5, finances -50000" },
          { label: "D) Give up and protect other children", consequence: "Family survives but lose child forever. Happiness -60, finances -5000" }
        ]
      },
      Fantasy: {
        title: "The Final Ascension",
        description: "Your child has mastered their magical abilities and been offered godhood by the Council of Eternity. Accepting means unlimited power and immortality but must leave the mortal realm forever.",
        options: [
          { label: "A) Support ascension to godhood", consequence: "Child becomes god but you never see them again. Happiness +40, finances -50000" },
          { label: "B) Convince them to stay human", consequence: "Family stays together but magic lost forever. Happiness +20, finances -10000" },
          { label: "C) Ask them to delay decision", consequence: "Council becomes angry, magic unstable. Happiness -25, finances -75000" },
          { label: "D) Let them choose without input", consequence: "Child makes decision alone, outcome uncertain. Happiness +10, finances -25000" }
        ]
      },
      Thrilling: {
        title: "Nuclear Crisis",
        description: "Your child, now a brilliant nuclear physicist, discovered evidence that a major corporation is planning to trigger a nuclear incident to profit from cleanup contracts.",
        options: [
          { label: "A) Support exposing truth publicly", consequence: "Nuclear disaster prevented but family targeted for life. Happiness +50, finances -200000" },
          { label: "B) Convince them to stay silent", consequence: "Family survives but thousands may die. Happiness -40, finances -150000" },
          { label: "C) Try to expose anonymously", consequence: "Partial success but still dangerous. Happiness +15, finances -100000" },
          { label: "D) Turn evidence over to authorities", consequence: "Evidence disappears, family becomes expendable. Happiness -60, finances -50000" }
        ]
      }
    }
  }
};

export default teenagerScenarios;