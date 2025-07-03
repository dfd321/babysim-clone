import React, { useState, useEffect } from 'react';
import { GameplayPhaseProps, GameStyle } from '../types/game';
import { Timeline } from './Timeline';

// Simplified scenarios for initial implementation
const getScenario = (age: number, gameStyle: GameStyle): { title: string; description: string; options: { label: string; consequence: string }[] } => {
  const scenarios: Record<number, Record<string, { title: string; description: string; options: { label: string; consequence: string }[] }>> = {
    2: {
      Realistic: {
        title: "Daycare Disaster",
        description: "Your child has been expelled from daycare for aggressive behavior - biting other children and having violent meltdowns. You're getting calls from work daily, and other parents are complaining. You need daycare to keep your job, but no one wants to take your child.",
        options: [
          { 
            label: "A) Quit your job to stay home and work on behavior", 
            consequence: "Intensive training works but massive financial hit. Happiness +25, finances -15000"
          },
          { 
            label: "B) Hire expensive behavioral specialist and nanny", 
            consequence: "Professional help transforms behavior. Happiness +30, finances -8000"
          },
          { 
            label: "C) Keep switching daycares and hope for the best", 
            consequence: "Child becomes more unstable from constant changes. Happiness -25, finances -2000"
          },
          { 
            label: "D) Leave child with untrained family member", 
            consequence: "Behavioral problems worsen dramatically. Happiness -35, finances -500"
          }
        ]
      },
      Fantasy: {
        title: "Magical Outbursts",
        description: "Your child's magical abilities are manifesting as destructive tantrums. When angry, objects burst into flames or shatter. The magical community is threatening intervention, and normal daycares are unsafe.",
        options: [
          { 
            label: "A) Seek training from the Elder Mages Council", 
            consequence: "Child learns control but you owe magical debts. Happiness +30, finances -5000"
          },
          { 
            label: "B) Suppress the magic with binding spells", 
            consequence: "Magic contained but child becomes withdrawn and ill. Happiness -20, finances -3000"
          },
          { 
            label: "C) Let them express magic freely", 
            consequence: "Powers grow wild and dangerous, family becomes outcasts. Happiness -30, finances -10000"
          },
          { 
            label: "D) Move to a magical sanctuary community", 
            consequence: "Safe environment but isolated from normal world. Happiness +15, finances -12000"
          }
        ]
      },
      Thrilling: {
        title: "Life-Threatening Tantrum",
        description: "During a massive public meltdown, your child ran into traffic and was nearly hit by a car. Witnesses are calling child services, claiming negligence. A viral video is spreading online showing the incident.",
        options: [
          { 
            label: "A) Hire a crisis management team and therapist immediately", 
            consequence: "Public relations managed, child gets help. Happiness +20, finances -12000"
          },
          { 
            label: "B) Flee the city and start over somewhere new", 
            consequence: "Escape scrutiny but lose everything you've built. Happiness -15, finances -20000"
          },
          { 
            label: "C) Fight the accusations publicly", 
            consequence: "Some support you but child becomes more traumatized. Happiness -25, finances -5000"
          },
          { 
            label: "D) Accept child services intervention", 
            consequence: "Lose custody temporarily, devastating for everyone. Happiness -40, finances -8000"
          }
        ]
      }
    },
    5: {
      Realistic: {
        title: "Learning Disability Crisis",
        description: "Your child has been diagnosed with severe dyslexia and ADHD. The public school says they can't handle their needs and recommends a $30,000/year special school. Your child is falling further behind daily and developing deep shame about being 'stupid.' Your marriage is strained from the stress.",
        options: [
          { 
            label: "A) Sacrifice everything for the private special school", 
            consequence: "Child thrives academically but family goes into debt. Happiness +35, finances -30000"
          },
          { 
            label: "B) Fight the school district for proper accommodations", 
            consequence: "Legal battle is exhausting but you win support. Happiness +20, finances -8000"
          },
          { 
            label: "C) Homeschool with specialized curriculum", 
            consequence: "Child improves but you lose career advancement. Happiness +15, finances -10000"
          },
          { 
            label: "D) Keep them in regular school with tutoring", 
            consequence: "Child continues struggling, self-esteem plummets. Happiness -30, finances -5000"
          }
        ]
      },
      Fantasy: {
        title: "The Forbidden Sight",
        description: "Your child can see magical creatures invisible to others and won't stop talking to 'imaginary friends' at school. Teachers think they're disturbed, children are scared, and the magical beings are getting aggressive because your child revealed their existence. The Veil between worlds is weakening around your family.",
        options: [
          { 
            label: "A) Train them to hide their gift completely", 
            consequence: "Sight suppressed but child loses part of their soul. Happiness -20, finances -2000"
          },
          { 
            label: "B) Embrace their role as a Bridge between worlds", 
            consequence: "Dangerous but they become a magical diplomat. Happiness +25, finances -15000"
          },
          { 
            label: "C) Relocate to a school that teaches magical children", 
            consequence: "Perfect fit but must abandon your old life. Happiness +30, finances -25000"
          },
          { 
            label: "D) Let them navigate it alone", 
            consequence: "Child overwhelmed by supernatural forces. Happiness -35, finances -500"
          }
        ]
      },
      Thrilling: {
        title: "Kidnapping Attempt",
        description: "A stranger attempted to abduct your child from kindergarten but they escaped by screaming. The perpetrator was never caught and left threatening notes in your mailbox. Your child is now terrified to leave the house, and the school recommends private security or withdrawal. The media attention is overwhelming.",
        options: [
          { 
            label: "A) Hire full-time security and transfer to private school", 
            consequence: "Child feels safe but lives in a protective bubble. Happiness +15, finances -35000"
          },
          { 
            label: "B) Move across the country and change identities", 
            consequence: "Safe but traumatic upheaval for everyone. Happiness -10, finances -40000"
          },
          { 
            label: "C) Stay and fight with community watch groups", 
            consequence: "Shows strength but danger remains constant. Happiness +10, finances -5000"
          },
          { 
            label: "D) Rely on police protection alone", 
            consequence: "Inadequate security, child lives in constant fear. Happiness -35, finances -1000"
          }
        ]
      }
    },
    8: {
      Realistic: {
        title: "Cyberbullying Nightmare",
        description: "Your child is being viciously cyberbullied by classmates who created fake social media accounts to torment them. They've stopped eating, won't go to school, and you found them researching suicide methods. The school claims they can't control off-campus behavior, and the bullying is escalating.",
        options: [
          { 
            label: "A) Take legal action against families and school", 
            consequence: "Bullying stops but child becomes social pariah. Happiness +10, finances -15000"
          },
          { 
            label: "B) Transfer to boarding school for fresh start", 
            consequence: "Child recovers in new environment. Happiness +25, finances -45000"
          },
          { 
            label: "C) Homeschool and get intensive therapy", 
            consequence: "Child heals slowly but misses social development. Happiness +5, finances -20000"
          },
          { 
            label: "D) Try to handle it with school counselor only", 
            consequence: "Bullying continues, child's mental health deteriorates. Happiness -40, finances -2000"
          }
        ]
      },
      Fantasy: {
        title: "The Dark Prophecy",
        description: "A seer has declared your child is destined to either save or destroy the magical realm. Dark forces are hunting them while light beings demand they be trained as a weapon. Your child is developing terrifying powers they can't control, and normal life is becoming impossible as supernatural battles rage around your family.",
        options: [
          { 
            label: "A) Accept training with the Light Council", 
            consequence: "Child becomes powerful protector but loses childhood. Happiness +20, finances -25000"
          },
          { 
            label: "B) Seek the Dark Powers to reverse the prophecy", 
            consequence: "Prophecy broken but you owe terrible debts. Happiness -15, finances -30000"
          },
          { 
            label: "C) Hide your child from all magical factions", 
            consequence: "Temporary safety but destiny can't be avoided. Happiness -10, finances -40000"
          },
          { 
            label: "D) Let your child choose their own path", 
            consequence: "Child overwhelmed by destiny, powers go wild. Happiness -30, finances -10000"
          }
        ]
      },
      Thrilling: {
        title: "Witness Protection",
        description: "Your child witnessed a brutal gang murder and is the only witness who can identify the killer. The crime family has put a bounty on your heads and already made two attempts on your lives. The FBI wants to put you in witness protection, but it means abandoning your entire life forever and living in constant fear.",
        options: [
          { 
            label: "A) Enter witness protection immediately", 
            consequence: "Safe but lose all friends, family, and identity. Happiness -20, finances -50000"
          },
          { 
            label: "B) Testify and risk staying in your hometown", 
            consequence: "Justice served but family becomes permanent targets. Happiness +15, finances -25000"
          },
          { 
            label: "C) Flee the country and start over illegally", 
            consequence: "Escape threats but become international fugitives. Happiness -25, finances -35000"
          },
          { 
            label: "D) Refuse to cooperate and hope for the best", 
            consequence: "Killer goes free, family lives in constant terror. Happiness -45, finances -5000"
          }
        ]
      }
    },
    12: {
      Realistic: {
        title: "Teen Pregnancy Scare",
        description: "You discovered your 12-year-old has been sexually active with a 16-year-old. They might be pregnant, refuse to talk about it, and are threatening to run away if you involve authorities. The age gap makes this potentially illegal, but your child claims it's love. Your family is fracturing under the crisis.",
        options: [
          { 
            label: "A) Report to authorities and get counseling", 
            consequence: "Legal situation handled but child feels betrayed. Happiness +10, finances -20000"
          },
          { 
            label: "B) Handle privately with family therapy", 
            consequence: "Family stays together but legal issues unresolved. Happiness +20, finances -15000"
          },
          { 
            label: "C) Move to different state for fresh start", 
            consequence: "Escape problems but child's issues follow. Happiness -5, finances -60000"
          },
          { 
            label: "D) Trust child to handle it themselves", 
            consequence: "Situation spirals completely out of control. Happiness -50, finances -30000"
          }
        ]
      },
      Fantasy: {
        title: "The Soul Bond Ritual",
        description: "Your child has been chosen by an ancient dragon for a soul-bonding ritual that happens once every 1000 years. Success would give them incredible power and immortality, but failure means death, and the ritual requires them to leave the human world forever. The dragon is growing impatient and threatens to destroy your city if they refuse.",
        options: [
          { 
            label: "A) Allow the bonding and lose your child forever", 
            consequence: "Child becomes immortal guardian but you never see them again. Happiness -30, finances -20000"
          },
          { 
            label: "B) Fight the dragon to protect your child", 
            consequence: "Epic battle but likely death for everyone. Happiness -40, finances -100000"
          },
          { 
            label: "C) Seek magical intervention to break the bond", 
            consequence: "Ritual broken but dragon's curse haunts family. Happiness -15, finances -50000"
          },
          { 
            label: "D) Try to negotiate a compromise with the dragon", 
            consequence: "Partial bond allows visits but child forever changed. Happiness +5, finances -30000"
          }
        ]
      },
      Thrilling: {
        title: "International Incident",
        description: "Your child accidentally started a diplomatic crisis by hacking into embassy computers during a school project. Foreign agents are demanding extradition, the CIA wants to recruit them, and your family is at the center of international tensions. Media from around the world is camped outside your house.",
        options: [
          { 
            label: "A) Cooperate with government agencies fully", 
            consequence: "Child becomes asset but loses normal childhood. Happiness +15, finances -40000"
          },
          { 
            label: "B) Flee to a non-extradition country", 
            consequence: "Safety but permanent exile from homeland. Happiness -25, finances -80000"
          },
          { 
            label: "C) Fight extradition in international court", 
            consequence: "Legal victory but years of stress and danger. Happiness +10, finances -100000"
          },
          { 
            label: "D) Turn child over to foreign authorities", 
            consequence: "Crisis ends but you lose your child forever. Happiness -60, finances -20000"
          }
        ]
      }
    },
    16: {
      Realistic: {
        title: "Fatal Car Accident",
        description: "Your teen was driving drunk and killed another teenager in a crash. They're facing vehicular manslaughter charges, the victim's family is demanding maximum punishment, and your child is suicidal with guilt. The legal fees are bankrupting you, and the media has turned your family into public villains.",
        options: [
          { 
            label: "A) Fight for reduced charges with expensive lawyers", 
            consequence: "Lighter sentence but family goes bankrupt. Happiness +15, finances -150000"
          },
          { 
            label: "B) Accept plea deal and focus on rehabilitation", 
            consequence: "Child goes to prison but gets therapy. Happiness +5, finances -50000"
          },
          { 
            label: "C) Move away and change identities", 
            consequence: "Escape public shame but legal issues follow. Happiness -20, finances -100000"
          },
          { 
            label: "D) Let public defender handle everything", 
            consequence: "Maximum sentence, child's life destroyed. Happiness -55, finances -25000"
          }
        ]
      },
      Fantasy: {
        title: "The Darkness Awakens",
        description: "Your teenager has been possessed by an ancient evil that feeds on their anger and pain. They're becoming a vessel for dark magic that grows stronger each day. The possession is causing them to hurt people they love, and exorcists warn that the entity may be too powerful to remove without killing your child.",
        options: [
          { 
            label: "A) Risk the dangerous exorcism ritual", 
            consequence: "Entity banished but child may not survive. Happiness +25, finances -75000"
          },
          { 
            label: "B) Seek to contain the darkness instead of removing it", 
            consequence: "Dark power controlled but child forever changed. Happiness -10, finances -50000"
          },
          { 
            label: "C) Accept the possession and try to guide the entity", 
            consequence: "Dangerous alliance but child retains some humanity. Happiness -20, finances -25000"
          },
          { 
            label: "D) Abandon your child to protect others", 
            consequence: "Family safe but you lose your child to darkness. Happiness -50, finances -30000"
          }
        ]
      },
      Thrilling: {
        title: "Terrorism Accusation",
        description: "Your teenager has been accused of planning a school bombing after authorities found suspicious materials and manifestos in their room. They claim they were just writing a story, but evidence suggests otherwise. The FBI has your house surrounded, media calls them a monster, and their friends are afraid to speak up for them.",
        options: [
          { 
            label: "A) Hire the best criminal defense team immediately", 
            consequence: "Strong legal defense but massive financial burden. Happiness +20, finances -200000"
          },
          { 
            label: "B) Cooperate fully with authorities to prove innocence", 
            consequence: "Transparency helps but child traumatized by process. Happiness +10, finances -75000"
          },
          { 
            label: "C) Move to another country before trial", 
            consequence: "Escape prosecution but become international fugitives. Happiness -30, finances -120000"
          },
          { 
            label: "D) Trust the public defender and hope for justice", 
            consequence: "Inadequate defense, child likely convicted. Happiness -60, finances -40000"
          }
        ]
      }
    },
    18: {
      Realistic: {
        title: "Addiction and Overdose",
        description: "Your child has been hiding a severe drug addiction and just overdosed at a college party. They're in the ICU fighting for their life, facing expulsion and criminal charges. This is their third overdose this year. You've spent your retirement savings on previous rehab attempts, and they've relapsed every time.",
        options: [
          { 
            label: "A) Pay for exclusive long-term rehabilitation facility", 
            consequence: "Best chance of recovery but financial ruin. Happiness +30, finances -180000"
          },
          { 
            label: "B) Use tough love and let them face consequences alone", 
            consequence: "They might learn but could also die. Happiness -20, finances -10000"
          },
          { 
            label: "C) Take custody and move them back home", 
            consequence: "Close monitoring but enabling behavior. Happiness +5, finances -50000"
          },
          { 
            label: "D) Give up and protect your other children", 
            consequence: "Family survives but you lose your child forever. Happiness -60, finances -5000"
          }
        ]
      },
      Fantasy: {
        title: "The Final Ascension",
        description: "Your child has mastered their magical abilities and been offered godhood by the Council of Eternity. Accepting means they'll gain unlimited power and immortality but must leave the mortal realm forever. Refusing means they'll lose all magic and live as a normal human. The choice will determine the fate of both worlds.",
        options: [
          { 
            label: "A) Support their ascension to godhood", 
            consequence: "Child becomes a god but you never see them again. Happiness +40, finances -50000"
          },
          { 
            label: "B) Convince them to stay human and live normally", 
            consequence: "Family stays together but magic is lost forever. Happiness +20, finances -10000"
          },
          { 
            label: "C) Ask them to delay the decision", 
            consequence: "Council becomes angry, magic turns unstable. Happiness -25, finances -75000"
          },
          { 
            label: "D) Let them choose without your input", 
            consequence: "Child makes decision alone, outcome uncertain. Happiness +10, finances -25000"
          }
        ]
      },
      Thrilling: {
        title: "Nuclear Crisis",
        description: "Your child, now a brilliant nuclear physicist, discovered evidence that a major corporation is planning to trigger a nuclear incident to profit from the cleanup contracts. When they tried to whistleblow, assassins came for your family. Now you're in hiding while your child debates whether to go public with information that could prevent a catastrophe but guarantee your family's death.",
        options: [
          { 
            label: "A) Support them in exposing the truth publicly", 
            consequence: "Nuclear disaster prevented but family targeted for life. Happiness +50, finances -200000"
          },
          { 
            label: "B) Convince them to stay silent and disappear", 
            consequence: "Family survives but thousands may die. Happiness -40, finances -150000"
          },
          { 
            label: "C) Try to find a way to expose it anonymously", 
            consequence: "Partial success but still dangerous. Happiness +15, finances -100000"
          },
          { 
            label: "D) Turn evidence over to corrupt authorities", 
            consequence: "Evidence disappears, family becomes expendable. Happiness -60, finances -50000"
          }
        ]
      }
    }
  };

  return scenarios[age]?.[gameStyle] || {
    title: "Growing Up",
    description: `Your child is now ${age} years old and facing new challenges appropriate for their age.`,
    options: [
      { label: "A) Handle with care and patience", consequence: "Steady progress. Happiness +10, finances -1000" },
      { label: "B) Seek professional guidance", consequence: "Expert help improves situation. Happiness +15, finances -5000" },
      { label: "C) Let them figure it out themselves", consequence: "Mixed results from independence. Happiness +5, finances -500" },
      { label: "D) Ignore the problem", consequence: "Issues worsen over time. Happiness -10, finances -200" }
    ]
  };
};

export const GameplayPhase: React.FC<GameplayPhaseProps> = ({
  gameState,
  onDecision,
  onRestart
}) => {
  const [currentScenario, setCurrentScenario] = useState<{ title: string; description: string; options: { label: string; consequence: string }[] } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [lastChoice, setLastChoice] = useState<{ label: string; consequence: string } | null>(null);

  useEffect(() => {
    if (gameState.gameStyle) {
      const scenario = getScenario(gameState.currentAge, gameState.gameStyle);
      setCurrentScenario(scenario);
      setShowResult(false);
    }
  }, [gameState.currentAge, gameState.gameStyle]);

  const handleChoice = (option: { label: string; consequence: string }) => {
    setLastChoice(option);
    setShowResult(true);
    
    // Parse effects from consequence text
    const happinessMatch = option.consequence.match(/Happiness ([+-]\d+)/);
    const financesMatch = option.consequence.match(/finances ([+-]\d+)/);
    
    const effects = {
      happiness: happinessMatch ? parseInt(happinessMatch[1]) : 0,
      finances: financesMatch ? parseInt(financesMatch[1]) : 0
    };

    // Call parent handler after a delay
    setTimeout(() => {
      onDecision(option.label, option.consequence, effects);
    }, 3000);
  };

  const getAgeStage = (age: number) => {
    if (age <= 2) return "Toddler";
    if (age <= 5) return "Preschooler"; 
    if (age <= 8) return "Young Child";
    if (age <= 12) return "Preteen";
    if (age <= 16) return "Teenager";
    return "Young Adult";
  };

  if (!currentScenario) {
    return <div>Loading scenario...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header with Character Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <h3 className="font-bold text-gray-700">Child</h3>
              <p className="text-lg">{gameState.childCharacter?.name}</p>
              <p className="text-sm text-gray-600">Age {gameState.currentAge} • {getAgeStage(gameState.currentAge)}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-700">Happiness</h3>
              <div className="text-2xl font-bold text-blue-600">{gameState.happiness}/100</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.max(0, Math.min(100, gameState.happiness))}%` }}
                />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-700">Finances</h3>
              <div className={`text-lg font-bold ${gameState.finances >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${gameState.finances.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">
                {gameState.finances >= 50000 ? 'Comfortable' : 
                 gameState.finances >= 0 ? 'Managing' : 'Struggling'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Scenario Column (2/3 width) */}
          <div className="lg:col-span-2">
            {!showResult ? (
              /* Scenario Presentation */
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    Age {gameState.currentAge} • {gameState.gameStyle}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    {currentScenario.title}
                  </h1>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {currentScenario.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    How do you respond?
                  </h3>
                  
                  {currentScenario.options.map((option: { label: string; consequence: string }, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleChoice(option)}
                      className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
                    >
                      <div className="font-semibold text-gray-800 group-hover:text-purple-700 mb-2">
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={onRestart}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            ) : (
              /* Result Display */
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="mb-6">
                  <div className="text-6xl mb-4">
                    {lastChoice?.consequence.includes('+') ? '😊' : '😟'}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Decision Made!
                  </h2>
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="font-semibold text-blue-800 mb-2">You chose:</p>
                    <p className="text-blue-700">{lastChoice?.label}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{lastChoice?.consequence}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mr-3"></div>
                  <p className="text-gray-600">Processing decision and advancing time...</p>
                </div>
              </div>
            )}
          </div>

          {/* Timeline Column (1/3 width) */}
          <div className="lg:col-span-1">
            <Timeline 
              entries={gameState.timeline} 
              currentAge={gameState.currentAge}
            />
          </div>
        </div>
      </div>
    </div>
  );
};