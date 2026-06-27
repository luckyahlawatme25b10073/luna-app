export interface PhaseInfo {
  id: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  name: string;
  description: string;
  hormoneInfo: string;
  tips: string[];
  foods: string[];
  exercises: string[];
  emotions: string[];
  color: string;
}

export const PHASE_DATA: Record<'menstrual' | 'follicular' | 'ovulatory' | 'luteal', PhaseInfo> = {
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
    color: '#F8BBD0' // pink-primary
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
    color: '#F48FB1' // pink-secondary
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
    color: '#A8C5A0' // green-accent
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
    color: '#E91E63' // deeper pink for luteal
  }
};