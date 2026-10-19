import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
const PORT = 3001

app.use(cors())
app.use(bodyParser.json())

// Medical Knowledge Base
const medicalKnowledge = {
  // Heart & Circulation
  heart: {
    topic: 'The Heart & Circulation',
    facts: [
      'The heart is a muscular organ about the size of a fist that beats around 100,000 times per day.',
      'Your heart pumps about 2,000 gallons of blood through your body each day.',
      'The heart has four chambers: two atria (upper) and two ventricles (lower).',
      'Blood travels through your body in about 60 seconds.',
      'The heart has its own electrical system that controls the heartbeat rhythm.'
    ],
    explanations: {
      'how': 'The heart works like a pump. It has four chambers that fill with blood, then squeeze (contract) to push blood out. The right side pumps blood to the lungs to get oxygen, while the left side pumps oxygen-rich blood to the rest of your body.',
      'keep': 'To keep your heart healthy: exercise regularly, eat a balanced diet low in saturated fats, manage stress, maintain a healthy weight, avoid smoking, and limit alcohol intake.',
      'rate': 'A normal resting heart rate for adults is between 60-100 beats per minute. Athletes may have lower rates (40-60) which is normal.',
      'symptoms': 'Common signs of heart issues include chest pain, shortness of breath, fatigue, swelling in legs, and irregular heartbeat.'
    },
    quiz: [
      { q: 'How many chambers does the heart have?', a: 'Four (two atria and two ventricles)' },
      { q: 'How many times does the heart beat per day?', a: 'About 100,000 times' },
      { q: 'What is the normal resting heart rate for adults?', a: '60-100 beats per minute' }
    ]
  },

  // Lungs
  lungs: {
    topic: 'How Lungs Work',
    facts: [
      'You breathe about 20,000 times per day.',
      'Your lungs contain about 300 million tiny air sacs called alveoli.',
      'The surface area of your lungs is roughly equal to a tennis court.',
      'The right lung is larger than the left lung to make room for your heart.',
      'Lungs are the only organs that can float on water.'
    ],
    explanations: {
      'breathing': 'When you breathe in, your diaphragm contracts and moves down, expanding your chest cavity. Air rushes in through your nose/mouth, down your trachea, and into your bronchi which branch into smaller tubes called bronchioles, ending in alveoli where gas exchange happens.',
      'oxygen': 'In the alveoli, oxygen from the air passes into your bloodstream while carbon dioxide from your blood passes into the air to be exhaled.',
      'keep': 'Keep your lungs healthy: don\'t smoke, exercise regularly, avoid pollutants, practice deep breathing, and get regular check-ups.'
    },
    quiz: [
      { q: 'What are the tiny air sacs in the lungs called?', a: 'Alveoli' },
      { q: 'How many times do you breathe per day?', a: 'About 20,000 times' },
      { q: 'Which gas do lungs remove from the blood?', a: 'Carbon dioxide' }
    ]
  },

  // Digestive System
  digestive: {
    topic: 'The Digestive System',
    facts: [
      'The digestive system is about 30 feet long.',
      'It takes about 24-72 hours for food to pass through your digestive tract.',
      'Your stomach produces acid strong enough to dissolve metal (but don\'t try it!).',
      'The liver is the largest internal organ and performs over 500 functions.',
      'Gut bacteria weigh about 2-5 pounds and are essential for health.'
    ],
    explanations: {
      'process': 'Digestion starts in the mouth with chewing and saliva. Food then travels down the esophagus to the stomach where acids break it down. Next, it enters the small intestine where nutrients are absorbed. Finally, waste moves to the large intestine and is expelled.',
      'stomach': 'Your stomach produces hydrochloric acid and enzymes that break down food. The stomach lining renews itself every few days to protect against the acid.',
      'keep': 'Eat fiber-rich foods, drink plenty of water, avoid processed foods, eat slowly, and maintain regular meal times.'
    },
    quiz: [
      { q: 'How long is the digestive system?', a: 'About 30 feet' },
      { q: 'How long does digestion take?', a: '24-72 hours' },
      { q: 'What organ produces over 500 functions?', a: 'The liver' }
    ]
  },

  // Brain
  brain: {
    topic: 'Brain & Nervous System',
    facts: [
      'The brain weighs about 3 pounds and contains 86 billion neurons.',
      'The brain uses 20% of your body\'s total oxygen and energy.',
      'Neurons can transmit signals at 250 mph.',
      'Your brain is 73% water.',
      'The brain cannot feel pain - that\'s why brain surgery can be done while awake!'
    ],
    explanations: {
      'parts': 'The brain has three main parts: cerebrum (thinking, memory, emotions), cerebellum (balance, coordination), and brainstem (breathing, heart rate).',
      'neurons': 'Neurons are nerve cells that transmit information through electrical and chemical signals. They connect to form neural networks that enable everything you think, feel, and do.',
      'keep': 'Keep your brain healthy: get 7-9 hours of sleep, exercise regularly, eat omega-3 fatty acids, stay mentally active, manage stress, and maintain social connections.'
    },
    quiz: [
      { q: 'How much does the brain weigh?', a: 'About 3 pounds' },
      { q: 'How many neurons are in the brain?', a: 'About 86 billion' },
      { q: 'What percentage of the body\'s energy does the brain use?', a: '20%' }
    ]
  },

  // Bones & Muscles
  bones: {
    topic: 'Bones & Muscles',
    facts: [
      'Adults have 206 bones, but babies are born with about 270.',
      'Bone is stronger than steel, gram for gram.',
      'The smallest bone is the stirrup bone in your ear, about 3mm long.',
      'Muscles account for about 40% of your body weight.',
      'You have over 600 muscles in your body.'
    ],
    explanations: {
      'bones': 'Bones provide structure, protect organs, store minerals, and produce blood cells. They\'re living tissue that constantly rebuilds itself.',
      'muscles': 'Muscles work in pairs - when one contracts, the other relaxes. This allows movement. There are three types: skeletal (voluntary movement), cardiac (heart), and smooth (organs).',
      'keep': 'Build strong bones with calcium, vitamin D, and weight-bearing exercise. Maintain muscles through regular physical activity and protein intake.'
    },
    quiz: [
      { q: 'How many bones do adults have?', a: '206 bones' },
      { q: 'What percentage of body weight are muscles?', a: 'About 40%' },
      { q: 'What is the smallest bone?', a: 'The stirrup bone in the ear' }
    ]
  },

  // Nutrition
  nutrition: {
    topic: 'Healthy Eating',
    facts: [
      'You should eat at least 5 portions of fruits and vegetables daily.',
      'Protein is essential for building and repairing tissues.',
      'Carbohydrates are your body\'s main energy source.',
      'Healthy fats are crucial for brain function.',
      'Water makes up about 60% of your body weight.'
    ],
    explanations: {
      'macros': 'The three main macronutrients are: Carbohydrates (energy), Proteins (building blocks), and Fats (hormones, brain function).',
      'balance': 'A balanced diet includes: fruits & vegetables (vitamins, fiber), whole grains (energy, fiber), lean proteins (muscle maintenance), and healthy fats (heart health).',
      'tips': 'Eat colorful foods (more nutrients), read labels, limit added sugars, choose whole grains over refined, and drink water instead of sugary drinks.'
    },
    quiz: [
      { q: 'How many portions of fruits/vegetables daily?', a: 'At least 5 portions' },
      { q: 'What percentage of your body is water?', a: 'About 60%' },
      { q: 'What is the main energy source for the body?', a: 'Carbohydrates' }
    ]
  },

  // Exercise
  exercise: {
    topic: 'Exercise & Fitness',
    facts: [
      'Exercise releases endorphins - natural mood lifters.',
      'Just 30 minutes of moderate exercise can improve health.',
      'Muscles continue to burn calories even at rest.',
      'Exercise improves sleep quality.',
      'Regular activity can add years to your life.'
    ],
    explanations: {
      'types': 'There are four main types: Aerobic (cardio), Strength training, Flexibility, and Balance. All are important for overall health.',
      'benefits': 'Exercise strengthens the heart, improves circulation, builds muscle and bone density, boosts immune system, reduces stress, and improves mental health.',
      'recommendation': 'Adults should get at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week, plus strength training twice a week.'
    },
    quiz: [
      { q: 'What do exercise releases that improve mood?', a: 'Endorphins' },
      { q: 'How much exercise per week is recommended?', a: '150 minutes of moderate activity' },
      { q: 'Do muscles burn calories at rest?', a: 'Yes' }
    ]
  },

  // Sleep
  sleep: {
    topic: 'Sleep Health',
    facts: [
      'Adults need 7-9 hours of sleep per night.',
      'During sleep, your brain processes memories and clears toxins.',
      'Sleep deprivation can affect judgment and reaction time equivalent to drunk driving.',
      'The brain is as active during REM sleep as when awake.',
      'Consistent sleep schedules are more important than getting 8 hours.'
    ],
    explanations: {
      'cycles': 'Sleep has 4-5 cycles of 90 minutes each, alternating between light sleep, deep sleep (repair), and REM (dreaming).',
      'repair': 'During deep sleep, the body repairs tissues, builds bone and muscle, and strengthens the immune system. REM sleep is crucial for memory and learning.',
      'tips': 'Keep a regular schedule, avoid screens before bed, keep your room cool, limit caffeine after noon, and avoid large meals close to bedtime.'
    },
    quiz: [
      { q: 'How many hours of sleep do adults need?', a: '7-9 hours' },
      { q: 'What is the longest sleep cycle?', a: '90 minutes' },
      { q: 'When does the brain clear toxins?', a: 'During sleep' }
    ]
  },

  // CPR
  cpr: {
    topic: 'CPR Basics',
    facts: [
      'CPR can double or triple survival chances after cardiac arrest.',
      'The chain of survival includes: recognition, call for help, CPR, defibrillation, and advanced care.',
      'Hands-only CPR is recommended for untrained rescuers.',
      'Chest compressions should be at least 2 inches deep.',
      'An AED (Automated External Defibrillator) can restore normal heart rhythm.'
    ],
    explanations: {
      'when': 'CPR is needed when someone is unresponsive and not breathing normally or only gasping. This could be from cardiac arrest, drowning, or other emergencies.',
      'how': 'Place the person on their back, put your hands in the center of their chest, push hard and fast (100-120 compressions per minute), allow full chest recoil between compressions.',
      'aed': 'AEDs are found in public places. They give voice instructions and automatically analyze the heart rhythm. Follow the prompts - it will only shock if needed.'
    },
    quiz: [
      { q: 'What can CPR double or triple?', a: 'Survival chances' },
      { q: 'How deep should chest compressions be?', a: 'At least 2 inches' },
      { q: 'How many compressions per minute?', a: '100-120' }
    ]
  },

  // First Aid - Cuts & Burns
  cuts: {
    topic: 'Treating Cuts & Burns',
    facts: [
      'Stop bleeding by applying direct pressure with a clean cloth.',
      'Minor cuts should be cleaned within a few minutes to prevent infection.',
      'Never remove objects embedded in a wound - let a doctor remove them.',
      'For burns, cool with running water for at least 10 minutes.',
      'Don\'t apply ice, butter, or toothpaste to burns.'
    ],
    explanations: {
      'cuts': 'For minor cuts: clean with water, apply antibiotic ointment, cover with a bandage. For deep cuts: apply pressure, seek medical help if bleeding doesn\'t stop after 10 minutes.',
      'burns': 'Burns are classified by degree. First-degree (red, painful), Second-degree (blisters), Third-degree (white/charred, painless). Run cool (not cold) water over burns for 10-20 minutes.',
      'when': 'Seek medical help for: wounds that won\'t stop bleeding, deep wounds, wounds with debris, animal bites, burns larger than 3 inches, or any burn on face/hands/feet/genitals.'
    },
    quiz: [
      { q: 'How long should you cool a burn?', a: 'At least 10 minutes' },
      { q: 'What should you NOT apply to burns?', a: 'Ice, butter, or toothpaste' },
      { q: 'When should you seek help for cuts?', a: 'When bleeding doesn\'t stop after 10 minutes' }
    ]
  },

  // Choking
  choking: {
    topic: 'Choking Response',
    facts: [
      'The universal sign for choking is hands clutched to the throat.',
      'If the person can cough or speak, encourage them to keep coughing.',
      'The Heimlich maneuver (abdominal thrusts) can dislodge objects.',
      'Back blows can be more effective than abdominal thrusts.',
      'Choking is the 4th leading cause of accidental death.'
    ],
    explanations: {
      'adults': 'Stand behind the person, wrap your arms around their waist, make a fist above their navel, thrust upward and inward. Repeat until object is expelled or person becomes unconscious.',
      'children': 'For children over 1: similar to adults but with less force. For infants: hold face down on your forearm, give 5 back blows between shoulder blades, then turn and give 5 chest thrusts.',
      'self': 'If alone and choking: make a fist above navel, thrust against a chair back or counter, or perform abdominal thrusts on yourself.'
    },
    quiz: [
      { q: 'What is the universal choking sign?', a: 'Hands clutching the throat' },
      { q: 'What is another name for abdominal thrusts?', a: 'Heimlich maneuver' },
      { q: 'What comes first for infants: back blows or chest thrusts?', a: 'Back blows' }
    ]
  },

  // Cold & Flu
  cold: {
    topic: 'Cold & Flu',
    facts: [
      'Colds and flu are caused by different viruses - over 200 types cause the common cold.',
      'Flu can cause 5 million severe cases worldwide annually.',
      'Fever is actually your body fighting the infection.',
      'Antibiotics don\'t work against viruses.',
      'You\'re most contagious in the first 2-3 days of illness.'
    ],
    explanations: {
      'difference': 'Cold: mild symptoms, develops gradually, affects nose and throat. Flu: sudden onset, fever, body aches, fatigue, can lead to serious complications.',
      'treatment': 'Rest, stay hydrated, over-the-counter meds for symptoms. Antiviral drugs can help if taken early in flu. Antibiotics only for bacterial infections.',
      'prevention': 'Wash hands frequently, avoid touching your face, stay away from sick people, get vaccinated for flu annually, maintain healthy lifestyle.'
    },
    quiz: [
      { q: 'How many viruses cause the common cold?', a: 'Over 200' },
      { q: 'Do antibiotics work against viruses?', a: 'No' },
      { q: 'When are you most contagious?', a: 'First 2-3 days' }
    ]
  },

  // Headaches
  headaches: {
    topic: 'Headaches',
    facts: [
      'There are over 150 types of headaches.',
      'Tension headaches are the most common type.',
      'Migraines affect about 1 billion people worldwide.',
      'Dehydration is a common headache trigger.',
      'Most headaches are not dangerous but can indicate other issues.'
    ],
    explanations: {
      'types': 'Tension: pressure/tightness, usually stress-related. Migraine: throbbing one side, light/sound sensitivity, nausea. Cluster: severe pain around one eye, occurs in groups.',
      'triggers': 'Common triggers: stress, lack of sleep, dehydration, certain foods, hormonal changes, bright lights, loud noises.',
      'relief': 'For tension: rest, relaxation, OTC pain relievers. For migraine: dark room, rest, prescribed medications. For all: stay hydrated, manage stress, maintain regular sleep.'
    },
    quiz: [
      { q: 'How many types of headaches exist?', a: 'Over 150' },
      { q: 'What is the most common type?', a: 'Tension headache' },
      { q: 'What is a common headache trigger?', a: 'Dehydration' }
    ]
  },

  // Allergies
  allergies: {
    topic: 'Allergies',
    facts: [
      'Allergies affect 30-40% of people worldwide.',
      'An allergy is when your immune system overreacts to harmless substances.',
      'Histamines cause most allergy symptoms.',
      'Peanut allergies are the most common cause of food-related deaths.',
      'Allergies can develop at any age.'
    ],
    explanations: {
      'how': 'When you encounter an allergen (pollen, food, etc.), your immune system produces IgE antibodies. These trigger histamine release, causing symptoms like sneezing, itching, swelling.',
      'common': 'Seasonal (pollen, mold), Food (peanuts, shellfish, milk), Environmental (dust mites, pet dander), Drug (penicillin).',
      'treatment': 'Avoid known allergens, antihistamines for symptoms, nasal sprays, eye drops. Severe reactions (anaphylaxis) require epinephrine (EpiPen) and immediate medical care.'
    },
    quiz: [
      { q: 'What causes allergy symptoms?', a: 'Histamines' },
      { q: 'What percentage of people have allergies?', a: '30-40%' },
      { q: 'What is used for severe allergic reactions?', a: 'Epinephrine (EpiPen)' }
    ]
  },

  // Stress Management
  stress: {
    topic: 'Stress Management',
    facts: [
      'A little stress can be useful - it sharpens focus before a test or a match.',
      'Deep, slow breathing activates your body\'s natural relaxation response.',
      'Chronic stress affects sleep, digestion, memory and mood.',
      'Exercise is one of the most reliable ways to burn off stress hormones.',
      'Naming what you feel ("this is pressure about the exam") measurably lowers its intensity.'
    ],
    explanations: {
      'what': 'Stress is your body\'s response to pressure. Your brain flags a challenge, hormones like adrenaline and cortisol prepare you to act: heart rate up, senses sharp, muscles ready. Short bursts are healthy; long-term floods are not.',
      'keep': 'Golden rules: move your body daily, sleep 7-9 hours, break big tasks into small steps, breathe slowly (4 seconds in, 6 out), talk to someone you trust, and take real breaks from screens.',
      'signs': 'Common signs: trouble sleeping, headaches, tense shoulders, stomach aches, snapping at small things, or feeling constantly "on edge".'
    },
    quiz: [
      { q: 'Is all stress bad for you?', a: 'No - short bursts can boost focus and motivation' },
      { q: 'Which breathing pattern helps you calm down?', a: 'Slow breathing, e.g. 4 seconds in and 6 seconds out' },
      { q: 'Name one reliable way to lower stress hormones.', a: 'Regular physical exercise' }
    ]
  },

  // Hydration
  hydration: {
    topic: 'Hydration',
    facts: [
      'Your body is about 60% water, and your brain is around 73% water.',
      'Even mild dehydration can affect mood, memory and reaction time.',
      'You lose roughly 2-3 liters of water a day through breath, sweat and urine.',
      'Water and plain milk are the best everyday drinks; sugary drinks add calories without quenching dehydration.',
      'Thirst often arrives after you are already mildly dehydrated.'
    ],
    explanations: {
      'how': 'Water carries nutrients to cells, flushes waste, cushions joints and keeps your temperature steady through sweating.',
      'howmuch': 'Most people do well with about 6-8 glasses a day, more in heat or during sports. Your urine is a simple gauge: pale yellow means well hydrated, dark means drink up.',
      'keep': 'Keep a bottle on your desk, drink a glass when you wake up, swap one sugary drink a day for water, and eat water-rich foods like fruit and soup.'
    },
    quiz: [
      { q: 'What does urine look like when you are well hydrated?', a: 'Pale yellow' },
      { q: 'Roughly how much of the human body is water?', a: 'About 60%' },
      { q: 'Does milder dehydration affect concentration?', a: 'Yes - even mild dehydration can cloud mood and focus' }
    ]
  },

  // Recognizing Emergencies
  emergencies: {
    topic: 'Recognizing Emergencies',
    facts: [
      'Warning signs that need a fast emergency call: trouble breathing, chest pain or pressure, fainting, confusion or slurred speech, uncontrolled bleeding, severe burns and suspected stroke.',
      'For stroke remember F.A.S.T. - Face drooping, Arm weakness, Speech difficulty, Time to call.',
      'Anaphylaxis (severe allergy) can close airways within minutes; it is an emergency even if symptoms seem to ease.',
      'If someone is unresponsive but breathing normally, put them on their side in the recovery position.',
      'When in doubt about whether it is an emergency, calling for help is always the safer choice.'
    ],
    explanations: {
      'when': 'Treat it as an emergency when a problem is sudden, severe or getting worse fast - especially breathing, chest, head, bleeding or allergic symptoms.',
      'what': 'Stay calm, call your local emergency number (112, 911, 999 - depends on country), answer their questions, and do not hang up until told to. Unlock the door if responders may need to reach you, and stay with the person.',
      'keep': 'Learn the recovery position, keep a first-aid kit at home, save emergency numbers in your phone, and take a first-aid course with Nurse Riley\'s reading list.'
    },
    quiz: [
      { q: 'What does the T in F.A.S.T. stand for?', a: 'Time to call the emergency number' },
      { q: 'What do you do for an unresponsive person who is still breathing?', a: 'Put them in the recovery position' },
      { q: 'Is it better to call emergency services "just in case", or wait?', a: 'Calling is always the safer choice' }
    ]
  },

  // Nutrition basics (nutrients)
  nutritionBasics: {
    topic: 'Nutrition Basics',
    facts: [
      'Vitamins and minerals are the body\'s tool kit - you only need tiny amounts, but you need them daily.',
      'Fiber keeps digestion moving and feeds the good bacteria in your gut.',
      'Protein is made of building blocks called amino acids; your body uses 20 of them, and 9 must come from food.',
      'Vitamin D works with calcium to build bone - sunlight helps your skin make it.',
      'Iron carries oxygen in your blood; low iron is a common cause of tiredness.'
    ],
    explanations: {
      'what': 'Nutrients are the useful raw materials in food: carbohydrates and fats for energy, protein for building and repair, vitamins and minerals for running the chemistry, water and fiber for transport and drainage.',
      'why': 'Every food group covers part of that toolkit. Eating a mix - colorful vegetables, whole grains, protein sources, a little healthy fat - covers your daily needs.',
      'keep': 'Simple rules: half your plate vegetables or fruit, whole grains when you can, protein at most meals, water as your default drink.'
    },
    quiz: [
      { q: 'How many amino acids must come directly from food?', a: 'Nine (the essential amino acids)' },
      { q: 'Which vitamin do you make with help from sunlight?', a: 'Vitamin D' },
      { q: 'Is a lack of iron linked to tiredness?', a: 'Yes - iron carries oxygen in the blood' }
    ]
  },

  // Default responses
  default: {
    greetings: [
      "Hello! I'm here to help you learn about health and medical topics. Ask me about the heart, lungs, nutrition, first aid, or any health topic you're curious about!",
      "Hi there! I'm your medical learning companion. What would you like to learn about today?",
      "Welcome! I can teach you about your body, health, nutrition, and more. What interests you?"
    ],
    fallback: "That's a great question! I'm specialized in teaching about health and medical topics. Try asking me about:\n\n• Your body (heart, lungs, brain, digestive system)\n• Health & wellness (nutrition, exercise, sleep)\n• First aid (CPR, cuts, choking)\n• Common conditions (cold, allergies, headaches)\n\nOr select a lesson from the sidebar to get started!",
    encourage: [
      "That's a great question! Let me explain...",
      "Interesting! Here's what I know about that...",
      "Good question! Let me share some important information..."
    ]
  }
}

/* Sessions: remember the last quiz question per chat session so that
   "answer" / "reveal" returns THE question that was asked, not a random one. */
const quizBySession = new Map()

/* Progress, kept per browser session id. */
const progressBySession = new Map()

/* Chat endpoint */
app.post('/api/chat', (req, res) => {
  const { message, character, lesson, sessionId } = req.body
  const lowerMessage = String(message || '').toLowerCase()

  let response = ''
  let lessonCompleted = null

  // Check for greetings
  if (lowerMessage.match(/^(hi|hello|hey|hiya|greetings|howdy)/)) {
    const greetings = medicalKnowledge.default.greetings
    response = greetings[Math.floor(Math.random() * greetings.length)]
  }

  // Check for quiz requests
  else if (lowerMessage.includes('quiz') || lowerMessage.includes('test me')) {
    const knowledge = (lesson && medicalKnowledge[lesson]) || null
    if (knowledge && knowledge.quiz) {
      const q = knowledge.quiz[Math.floor(Math.random() * knowledge.quiz.length)]
      quizBySession.set(sessionId, { lesson, q })
      response = `**Quiz time** for *${knowledge.topic}*.\n\n**Question:** ${q.q}\n\nThink it over, then ask me for the answer.`
    } else {
      response = 'Pick a lesson from the sidebar first, then ask me for a quiz on it!'
    }
  }

  // Check for answer requests
  else if (lowerMessage.includes('answer') || lowerMessage.includes('reveal')) {
    const last = quizBySession.get(sessionId)
    if (last && medicalKnowledge[last.lesson]) {
      quizBySession.delete(sessionId)
      lessonCompleted = last.lesson
      response = `**Answer:** ${last.q.a}\n\n` + randomFrom(medicalKnowledge.default.encourage)
    } else {
      response = 'Ask me for a quiz first - then I can reveal an answer.'
    }
  }

  // Check for specific topics
  else if (lowerMessage.includes('heart') || lowerMessage.includes('circulation')) {
    response = generateResponse('heart', lowerMessage)
  }

  else if (lowerMessage.includes('lung') || lowerMessage.includes('breathing') || lowerMessage.includes('alveol')) {
    response = generateResponse('lungs', lowerMessage)
  }

  else if (lowerMessage.includes('digest') || lowerMessage.includes('stomach') || lowerMessage.includes('intestine')) {
    response = generateResponse('digestive', lowerMessage)
  }

  else if (lowerMessage.includes('brain') || lowerMessage.includes('nervous') || lowerMessage.includes('neuron')) {
    response = generateResponse('brain', lowerMessage)
  }

  else if (lowerMessage.includes('bone') || lowerMessage.includes('muscle')) {
    response = generateResponse('bones', lowerMessage)
  }

  else if (lowerMessage.includes('nutrition') && !lowerMessage.includes('eating')) {
    response = generateResponse('nutritionBasics', lowerMessage)
  }

  else if (lowerMessage.includes('nutrition') || lowerMessage.includes('diet') || lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('healthy eating')) {
    response = generateResponse('nutrition', lowerMessage)
  }

  else if (lowerMessage.includes('exercise') || lowerMessage.includes('fitness') || lowerMessage.includes('workout') || lowerMessage.includes('sport')) {
    response = generateResponse('exercise', lowerMessage)
  }

  else if (lowerMessage.includes('sleep') || lowerMessage.includes('rest') || lowerMessage.includes('tired')) {
    response = generateResponse('sleep', lowerMessage)
  }

  else if (lowerMessage.includes('stres') || lowerMessage.includes('anxiet') || lowerMessage.includes('calm') || lowerMessage.includes('overwhelm')) {
    response = generateResponse('stress', lowerMessage)
  }

  else if (lowerMessage.includes('water') || lowerMessage.includes('hydrat') || lowerMessage.includes('thirsty') || lowerMessage.includes('dehydrat')) {
    response = generateResponse('hydration', lowerMessage)
  }

  else if (lowerMessage.includes('emergency') || lowerMessage.includes('ambulance') || lowerMessage.includes('urgent') || lowerMessage.includes('911') || lowerMessage.includes('112')) {
    response = generateResponse('emergencies', lowerMessage)
  }

  else if (lowerMessage.includes('cpr') || lowerMessage.includes('resuscitation')) {
    response = generateResponse('cpr', lowerMessage)
  }

  else if (lowerMessage.includes('cut') || lowerMessage.includes('burn') || lowerMessage.includes('wound')) {
    response = generateResponse('cuts', lowerMessage)
  }

  else if (lowerMessage.includes('choke') || lowerMessage.includes('heimlich')) {
    response = generateResponse('choking', lowerMessage)
  }

  else if (lowerMessage.includes('cold') || lowerMessage.includes('flu') || lowerMessage.includes('influenza') || (lowerMessage.includes('sick') && !lowerMessage.includes('kids'))) {
    response = generateResponse('cold', lowerMessage)
  }

  else if (lowerMessage.includes('headache') || lowerMessage.includes('migraine')) {
    response = generateResponse('headaches', lowerMessage)
  }

  else if (lowerMessage.includes('allerg') || lowerMessage.includes('hay fever')) {
    response = generateResponse('allergies', lowerMessage)
  }

  // When a lesson is active, answer from that lesson before falling back
  else if (lesson && medicalKnowledge[lesson]) {
    response = generateResponse(lesson, lowerMessage)
  }

  // Fallback for unknown topics
  else {
    const fallback = medicalKnowledge.default.fallback
    const encouraging = randomFrom(medicalKnowledge.default.encourage)
    response = `${encouraging}\n\n${fallback}`
  }

  res.json({ response, lessonCompleted })
})

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function generateResponse(topicKey, message) {
  const topic = medicalKnowledge[topicKey]
  if (!topic) return medicalKnowledge.default.fallback

  const lowerMessage = message.toLowerCase()

  // Lesson openings ("let's start the lesson: ...") get a proper opener
  if (lowerMessage.includes('lesson:') || lowerMessage.includes('start') && lowerMessage.includes('lesson')) {
    const fact = topic.facts[0]
    return `**${topic.topic}** - good choice.\n\n**To begin:** ${fact}\n\n${firstExplanation(topic)}\n\nAsk me "how does it work", ask for a **fact**, or say **quiz** when you feel ready.`
  }

  // Check for specific question types
  if (lowerMessage.includes('how') || lowerMessage.includes('work') || lowerMessage.includes('function')) {
    const keys = Object.keys(topic.explanations || {})
    if (keys.length > 0) {
      const key = keys[Math.floor(Math.random() * keys.length)]
      return `**How it works**\n\n${topic.explanations[key]}`
    }
  }

  if (lowerMessage.includes('keep') || lowerMessage.includes('healthy') || lowerMessage.includes('tips') || lowerMessage.includes('advice')) {
    return `**Health tips**\n\n${topic.explanations.keep || 'Maintain a healthy lifestyle with proper diet, exercise, and regular check-ups.'}`
  }

  if (lowerMessage.includes('fact') || lowerMessage.includes('interesting') || lowerMessage.includes('know')) {
    return `**Did you know?**\n\n${randomFrom(topic.facts)}`
  }

  // Default: provide a fact and explanation
  const fact = randomFrom(topic.facts)
  return `**${topic.topic}**\n\n**Interesting fact:** ${fact}\n\n${firstExplanation(topic)}`
}

function firstExplanation(topic) {
  const keys = Object.keys(topic.explanations || {})
  return keys.length > 0 ? topic.explanations[keys[0]] : ''
}

/* Lesson catalog (icon = icon id rendered by the frontend, never an emoji) */
app.get('/api/lessons', (req, res) => {
  const lessons = {
    'Body Basics': [
      { id: 'heart', title: 'The Heart & Circulation', description: 'How blood moves you' },
      { id: 'lungs', title: 'How Lungs Work', description: 'Breathing explained' },
      { id: 'digestive', title: 'Digestive System', description: 'The food journey' },
      { id: 'brain', title: 'Brain & Nervous System', description: 'The control center' },
      { id: 'bones', title: 'Bones & Muscles', description: 'Your movement system' }
    ],
    'Health & Wellness': [
      { id: 'nutrition', title: 'Healthy Eating', description: 'Balanced basics' },
      { id: 'exercise', title: 'Exercise & Fitness', description: 'Stay active' },
      { id: 'sleep', title: 'Sleep Health', description: 'Better rest' },
      { id: 'stress', title: 'Stress Management', description: 'A calmer mind' },
      { id: 'hydration', title: 'Hydration', description: 'Water essentials' }
    ],
    'First Aid': [
      { id: 'cpr', title: 'CPR Basics', description: 'Be ready to help' },
      { id: 'cuts', title: 'Treating Cuts & Burns', description: 'Wound care' },
      { id: 'choking', title: 'Choking Response', description: 'Fast response' },
      { id: 'emergencies', title: 'Recognizing Emergencies', description: 'Know the signs' }
    ],
    'Common Conditions': [
      { id: 'cold', title: 'Cold & Flu', description: 'Seasonal illness' },
      { id: 'headaches', title: 'Headaches', description: 'Causes and relief' },
      { id: 'allergies', title: 'Allergies', description: 'Triggers and care' },
      { id: 'nutritionBasics', title: 'Nutrition Basics', description: 'What food gives you' }
    ]
  }
  res.json(lessons)
})

/* Single lesson details */
app.get('/api/lessons/:id', (req, res) => {
  const topic = medicalKnowledge[req.params.id]
  if (!topic) return res.status(404).json({ error: 'Lesson not found' })
  res.json({
    id: req.params.id,
    title: topic.topic,
    facts: topic.facts,
    quiz: topic.quiz
  })
})

/* Progress: save (POST) and read (GET) */
app.post('/api/progress', (req, res) => {
  const { sessionId, completed } = req.body || {}
  if (!sessionId || !Array.isArray(completed)) {
    return res.status(400).json({ error: 'sessionId and completed[] required' })
  }
  const clean = [...new Set(completed.filter((x) => typeof x === 'string' && medicalKnowledge[x]))]
  progressBySession.set(sessionId, clean)
  res.json({ ok: true, completed: clean })
})

app.get('/api/progress', (req, res) => {
  const completed = progressBySession.get(req.query.sessionId) || []
  res.json({ completed })
})

app.listen(PORT, () => {
  console.log(`MedBot API listening on http://localhost:${PORT}`)
})