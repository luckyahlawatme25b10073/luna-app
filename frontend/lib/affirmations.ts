// src/lib/affirmations.ts
export const AFFIRMATIONS = [
  "My body is wise and knows exactly what it needs.",
  "I honor my cycle and honor myself.",
  "Each phase of my cycle brings unique strengths and wisdom.",
  "I am worthy of rest and nourishment, especially during my period.",
  "My femininity is a source of power, not weakness.",
  "I trust my intuition and listen to my body's wisdom.",
  "I release what no longer serves me with each cycle.",
  "I am aligned with the natural rhythms of my body.",
  "My cycle is a gift that connects me to my creative power.",
  "I treat myself with kindness and compassion in every phase.",
  "My sensitivity is a superpower that connects me to others.",
  "I celebrate my body's ability to create and sustain life.",
  "I am worthy of love and care, exactly as I am.",
  "Each phase of my cycle serves a purpose in my wellbeing.",
  "I release tension and embrace the flow of my cycle.",
  "My body's wisdom guides me to make healthy choices.",
  "I am patient with myself as I move through each phase.",
  "I honor my need for rest during my menstrual phase.",
  "I welcome the energy and creativity of my follicular phase.",
  "I embrace my confidence and sociability during ovulation.",
  "I nurture myself with compassion during my luteal phase.",
  "My cycle reflects my inner strength and resilience.",
  "I am grateful for my body's monthly renewal process.",
  "I trust the timing of my body's natural cycles.",
  "I release judgment and embrace acceptance of my cycle.",
  "My menstrual blood is sacred and cleansing.",
  "I am in tune with the lunar cycles and my own cycle."
];

export const getDailyAffirmation = () => {
  // Use a date-based index so server and client pick the same affirmation
  // (Math.random() causes hydration mismatches in Next.js)
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % AFFIRMATIONS.length;
  return AFFIRMATIONS[index];
};

export const getAffirmationsForPhase = (phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal') => {
  const phaseAffirmations: Record<
    'menstrual' | 'follicular' | 'ovulatory' | 'luteal',
    string[]
  > = {
    menstrual: [
      "I honor my need for rest and renewal during my period.",
      "My body is cleansing and renewing itself - this is sacred.",
      "I release what no longer serves me with each menstrual cycle.",
      "I treat myself with gentle kindness during my bleed.",
      "My period is a time of powerful release and renewal."
    ],
    follicular: [
      "I embrace new beginnings and fresh energy.",
      "My creativity flows freely during this phase.",
      "I am open to new possibilities and opportunities.",
      "My energy is building and I welcome it with joy.",
      "I plant seeds of intention that will grow throughout my cycle."
    ],
    ovulatory: [
      "I radiate confidence and vitality during ovulation.",
      "My magnetic energy attracts positivity and joy.",
      "I embrace my sensuality and feminine power.",
      "I communicate clearly and connect deeply with others.",
      "I celebrate my body's incredible ability to create life."
    ],
    luteal: [
      "I nurture myself with compassion and patience.",
      "I honor my sensitivity as a sign of deep awareness.",
      "I release tension and embrace gentle self-care.",
      "I trust my intuition during this reflective phase.",
      "I prepare myself for renewal with loving kindness."
    ]
  };

  return phaseAffirmations[phase] || [];
};