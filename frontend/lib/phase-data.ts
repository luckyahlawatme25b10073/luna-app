// src/lib/phase-data.ts
export type PhaseId = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface PhaseInfo {
  id: PhaseId;
  name: string;
  description: string;
  hormoneInfo: string;
  tips: string[];
  foods: string[];
  exercises: string[];
  emotions: string[];
  color: string;
  icon: string; // Lucide icon name
  emoji: string; // Emoji for display
  boyfriendTips: string[]; // Tips for what the boyfriend can do to support
}

export const PHASE_DATA: Record<PhaseId, PhaseInfo> = {
  menstrual: {
    id: 'menstrual',
    name: 'Menstrual',
    description: 'Your body sheds the uterine lining. Hormones are at their lowest.',
    hormoneInfo: 'Estrogen and progesterone are at their lowest levels.',
    tips: [
      'Rest and prioritize self-care',
      'Try gentle yoga or walking',
      'Use heat therapy for cramps',
      'Stay hydrated and eat iron-rich foods'
    ],
    foods: [
      'Leafy greens (spinach, kale)',
      'Lean red meat',
      'Legumes (lentils, beans)',
      'Seeds (pumpkin, flax)',
      'Dark chocolate'
    ],
    exercises: [
      'Gentle walking',
      'Restorative yoga',
      'Light stretching',
      'Breathing exercises'
    ],
    emotions: [
      'Introspective',
      'Reflective',
      'Seek comfort',
      'Need for rest'
    ],
    color: '#F8BBD0',
    icon: 'droplet',
    emoji: '🩸',
    boyfriendTips: [
      'Offer a warm heating pad or hot water bottle for cramps',
      'Bring her favorite comfort food or herbal tea',
      'Give her space to rest without feeling guilty',
      'Give a gentle back or foot massage',
      'Just listen without trying to fix anything'
    ]
  },
  follicular: {
    id: 'follicular',
    name: 'Follicular',
    description: 'Your body prepares to release an egg. Energy and creativity increase.',
    hormoneInfo: 'Estrogen rises, stimulating follicle growth.',
    tips: [
      'Great time for new projects and planning',
      'Try more intense workouts',
      'Focus on protein-rich foods',
      'Try something new and creative'
    ],
    foods: [
      'Fresh vegetables',
      'Lean proteins (fish, chicken)',
      'Whole grains',
      'Seeds (flax, pumpkin)',
      'Fermented foods (sauerkraut, kimchi)'
    ],
    exercises: [
      'Strength training',
      'HIIT workouts',
      'Running or cycling',
      'Dance cardio'
    ],
    emotions: [
      'Energetic',
      'Optimistic',
      'Creative',
      'Motivated'
    ],
    color: '#F48FB1',
    icon: 'trending-up',
    emoji: '🌸',
    boyfriendTips: [
      'Join her for a workout or active date',
      'Encourage her creative projects and ideas',
      'Plan a fun outing or adventure together',
      'Compliment her on her energy and enthusiasm',
      'Help brainstorm and plan future goals'
    ]
  },
  ovulatory: {
    id: 'ovulatory',
    name: 'Ovulatory',
    description: 'Your body releases an egg. Peak fertility and energy.',
    hormoneInfo: 'Estrogen peaks, triggering LH surge and ovulation.',
    tips: [
      'Peak energy for social activities',
      'Great time for important meetings',
      'Stay hydrated',
      'Consider light cardio'
    ],
    foods: [
      'Antioxidant-rich foods (berries, grapes)',
      'Light, energizing meals',
      'Plenty of water',
      'Foods high in zinc (pumpkin seeds, spinach)',
      'Essential fatty acids (avocado, nuts)'
    ],
    exercises: [
      'Group fitness classes',
      'Outdoor activities',
      'Swimming',
      'Cycling'
    ],
    emotions: [
      'Confident',
      'Social',
      'Outgoing',
      'Flirtatious'
    ],
    color: '#A8C5A0',
    icon: 'zap',
    emoji: '🌕',
    boyfriendTips: [
      'Plan a romantic date night',
      'Compliment her appearance and confidence',
      'Initiate physical affection if she\'s receptive',
      'Take her out dancing or to a social event',
      'Express appreciation for her vitality and passion'
    ]
  },
  luteal: {
    id: 'luteal',
    name: 'Luteal',
    description: 'Your body prepares for pregnancy or the next cycle. Focus on self-care.',
    hormoneInfo: 'Progesterone rises to maintain uterine lining.',
    tips: [
      'Practice stress reduction techniques',
      'Eat complex carbohydrates',
      'Limit caffeine and alcohol',
      'Get extra rest if needed'
    ],
    foods: [
      'Complex carbs (sweet potato, quinoa)',
      'Healthy fats (avocado, nuts)',
      'Magnesium-rich foods (bananas, dark chocolate)',
      'B-vitamin rich foods (eggs, leafy greens)',
      'Calcium-rich foods (yogurt, almonds)'
    ],
    exercises: [
      'Pilates',
      'Yoga',
      'Walking',
      'Light strength training'
    ],
    emotions: [
      'Reflective',
      'Sensitive',
      'Anxious',
      'Nostalgic'
    ],
    color: '#E91E63',
    icon: 'moon',
    emoji: '🌙',
    boyfriendTips: [
      'Give her extra hugs and physical comfort',
      'Help with chores to reduce her stress load',
      'Encourage relaxation activities like baths or meditation',
      'Be patient with mood swings - they\'re hormonal, not personal',
      'Prepare a healthy, comforting meal for her'
    ]
  }
};