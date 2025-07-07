import { ScenarioModule } from './types';

// Ages 4-8: Middle Childhood scenarios
export const middleChildhoodScenarios: ScenarioModule = {
  ageRange: { min: 4, max: 8 },
  scenarios: {
    4: {
      Realistic: {
        title: "Aggressive Behavior Crisis",
        description: "Your child is showing violent tantrums and aggression at daycare, with other children becoming afraid and parents complaining.",
        options: [
          { label: "A) Behavioral therapy", consequence: "Professional intervention improves behavior. Happiness +30, finances -8000" },
          { label: "B) Strict discipline", consequence: "Harsh methods suppress but don't solve. Happiness -20, finances +0" },
          { label: "C) Medical evaluation", consequence: "Comprehensive assessment reveals solutions. Happiness +35, finances -12000" },
          { label: "D) Change environment", consequence: "New setting provides temporary relief. Happiness +5, finances -5000" }
        ]
      },
      Fantasy: {
        title: "Dragon Companion Bond",
        description: "A baby dragon has chosen your child as its bond-mate, bringing both magical power and dangerous attention from dragon hunters.",
        options: [
          { label: "A) Hide dragon secretly", consequence: "Bond maintained but constant secrecy. Happiness +15, finances -15000" },
          { label: "B) Official registration", consequence: "Legal protection but bureaucratic control. Happiness -10, finances +10000" },
          { label: "C) Find dragon community", consequence: "Supportive community for magical bond. Happiness +25, finances +5000" },
          { label: "D) Force separation", consequence: "Safety but heartbreak for both. Happiness -30, finances +20000" }
        ]
      },
      Thrilling: {
        title: "International Spy Ring",
        description: "Your child overheard classified information and is now targeted by foreign agents who want to silence them permanently.",
        options: [
          { label: "A) Witness protection", consequence: "Safety but new identity required. Happiness -15, finances +15000" },
          { label: "B) Private security", consequence: "Expensive but maintains normal life. Happiness -25, finances -40000" },
          { label: "C) Counterintelligence asset", consequence: "Dangerous but lucrative arrangement. Happiness +10, finances +30000" },
          { label: "D) Public exposure", consequence: "Media attention provides protection. Happiness -10, finances +25000" }
        ]
      }
    },
    5: {
      Realistic: {
        title: "Learning Disability Crisis",
        description: "Your child has been diagnosed with severe dyslexia and ADHD. The public school says they can't handle their needs and recommends a $30,000/year special school.",
        options: [
          { label: "A) Sacrifice for private school", consequence: "Child thrives academically but family goes into debt. Happiness +35, finances -30000" },
          { label: "B) Fight school district", consequence: "Legal battle is exhausting but you win support. Happiness +20, finances -8000" },
          { label: "C) Homeschool with curriculum", consequence: "Child improves but you lose career advancement. Happiness +15, finances -10000" },
          { label: "D) Regular school with tutoring", consequence: "Child continues struggling, self-esteem plummets. Happiness -30, finances -5000" }
        ]
      },
      Fantasy: {
        title: "The Forbidden Sight",
        description: "Your child can see magical creatures invisible to others and won't stop talking to 'imaginary friends' at school. The Veil between worlds is weakening around your family.",
        options: [
          { label: "A) Train them to hide gift", consequence: "Sight suppressed but child loses part of soul. Happiness -20, finances -2000" },
          { label: "B) Embrace Bridge role", consequence: "Dangerous but they become magical diplomat. Happiness +25, finances -15000" },
          { label: "C) Magical school relocation", consequence: "Perfect fit but must abandon old life. Happiness +30, finances -25000" },
          { label: "D) Let them navigate alone", consequence: "Child overwhelmed by supernatural forces. Happiness -35, finances -500" }
        ]
      },
      Thrilling: {
        title: "Kidnapping Attempt",
        description: "A stranger attempted to abduct your child from kindergarten but they escaped by screaming. The perpetrator was never caught and left threatening notes.",
        options: [
          { label: "A) Full-time security", consequence: "Child feels safe but lives in protective bubble. Happiness +15, finances -35000" },
          { label: "B) Move across country", consequence: "Safe but traumatic upheaval for everyone. Happiness -10, finances -40000" },
          { label: "C) Community watch groups", consequence: "Shows strength but danger remains constant. Happiness +10, finances -5000" },
          { label: "D) Police protection alone", consequence: "Inadequate security, child lives in fear. Happiness -35, finances -1000" }
        ]
      }
    },
    6: {
      Realistic: {
        title: "Learning Differences Discovery",
        description: "Your child is struggling in first grade with possible learning disabilities, falling behind peers and losing confidence.",
        options: [
          { label: "A) Private assessment", consequence: "Comprehensive evaluation provides clarity. Happiness +25, finances -15000" },
          { label: "B) School services", consequence: "Limited help but no cost. Happiness +5, finances +0" },
          { label: "C) Homeschooling", consequence: "Personalized education but career sacrifice. Happiness +15, finances -8000" },
          { label: "D) Specialized school", consequence: "Expert environment but expensive. Happiness +35, finances -25000" }
        ]
      },
      Fantasy: {
        title: "Prophecy Academy Admission",
        description: "Your child has been invited to attend an academy for young seers, but training may cost them their present-moment awareness.",
        options: [
          { label: "A) Accept admission", consequence: "Powerful seer training but lost childhood. Happiness -10, finances +20000" },
          { label: "B) Alternative education", consequence: "Balanced approach to magical education. Happiness +20, finances -10000" },
          { label: "C) Delay until mature", consequence: "Wisdom of waiting but missed opportunities. Happiness +15, finances -5000" },
          { label: "D) Part-time compromise", consequence: "Best of both worlds arrangement. Happiness +25, finances -15000" }
        ]
      },
      Thrilling: {
        title: "Corporate Espionage Target",
        description: "Your child can predict stock market movements and is being targeted by both ethical and corrupt corporations.",
        options: [
          { label: "A) Ethical investment partnership", consequence: "Profitable collaboration with integrity. Happiness +10, finances +40000" },
          { label: "B) Go off-grid", consequence: "Safety but isolation from society. Happiness -20, finances -20000" },
          { label: "C) Expose corruption", consequence: "Dangerous but morally right choice. Happiness +15, finances -10000" },
          { label: "D) Hide abilities", consequence: "Safe but unfulfilled potential. Happiness -15, finances +5000" }
        ]
      }
    },
    7: {
      Realistic: {
        title: "Social Bullying Situation",
        description: "Your child is being excluded and bullied by classmates, affecting their school performance and self-esteem.",
        options: [
          { label: "A) School intervention", consequence: "Official support addresses bullying. Happiness +20, finances +0" },
          { label: "B) Transfer schools", consequence: "Fresh start in new environment. Happiness +30, finances -8000" },
          { label: "C) Self-defense training", consequence: "Confidence building through empowerment. Happiness +25, finances -3000" },
          { label: "D) Build individual friendships", consequence: "Gradual social network development. Happiness +15, finances -2000" }
        ]
      },
      Fantasy: {
        title: "Familiar Creature Selection",
        description: "It's time for your child to choose their magical companion: a wise owl, loyal wolf, mysterious raven, or rare unicorn.",
        options: [
          { label: "A) Wise owl choice", consequence: "Intellectual companion aids learning. Happiness +5, finances +10000" },
          { label: "B) Loyal wolf choice", consequence: "Protective companion builds courage. Happiness +25, finances +5000" },
          { label: "C) Let creatures choose", consequence: "Perfect magical bond forms naturally. Happiness +30, finances +15000" },
          { label: "D) Child's preference", consequence: "Personal choice strengthens bond. Happiness +20, finances +8000" }
        ]
      },
      Thrilling: {
        title: "Witness to Assassination",
        description: "Your child witnessed a political assassination and is now marked for elimination by the conspiracy behind it.",
        options: [
          { label: "A) FBI protection", consequence: "Federal protection but restricted life. Happiness -10, finances +20000" },
          { label: "B) Flee country", consequence: "International escape but exile. Happiness -25, finances -30000" },
          { label: "C) Private security", consequence: "Expensive but effective protection. Happiness -15, finances -50000" },
          { label: "D) Media protection", consequence: "Public attention as shield. Happiness +5, finances +35000" }
        ]
      }
    },
    8: {
      Realistic: {
        title: "Academic Excellence Pressure",
        description: "Your gifted child is being pushed in advanced programs but showing stress signs from the pressure to perform.",
        options: [
          { label: "A) Full acceleration", consequence: "Academic success but social isolation. Happiness -15, finances +15000" },
          { label: "B) Balanced enrichment", consequence: "Optimal development approach. Happiness +20, finances -8000" },
          { label: "C) Child chooses level", consequence: "Empowered decision making. Happiness +15, finances -5000" },
          { label: "D) Focus on social development", consequence: "Well-rounded growth prioritized. Happiness +25, finances +0" }
        ]
      },
      Fantasy: {
        title: "Dark Magic Temptation",
        description: "Your child shows aptitude for dark magic and has been offered secret training by a powerful but morally ambiguous sorcerer.",
        options: [
          { label: "A) Forbid dark magic", consequence: "Safety but suppressed natural abilities. Happiness -20, finances -10000" },
          { label: "B) Supervised exploration", consequence: "Controlled study of dark arts. Happiness +20, finances -15000" },
          { label: "C) Study with dark sorcerer", consequence: "Powerful but dangerous mentorship. Happiness +10, finances +5000" },
          { label: "D) Council guidance", consequence: "Wise magical authorities advise. Happiness +25, finances -20000" }
        ]
      },
      Thrilling: {
        title: "Alien Contact Discovery",
        description: "Your child has been communicating telepathically with aliens who are evaluating humanity for first contact.",
        options: [
          { label: "A) Report to government", consequence: "Official channels but loss of control. Happiness -10, finances +25000" },
          { label: "B) Secret cooperation", consequence: "Maintain communication privately. Happiness +20, finances +40000" },
          { label: "C) Stop communication", consequence: "Safety but missed opportunity. Happiness -25, finances +0" },
          { label: "D) Set boundaries", consequence: "Controlled contact on your terms. Happiness +30, finances +20000" }
        ]
      }
    }
  }
};

export default middleChildhoodScenarios;