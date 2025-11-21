import { Animal } from './types';

export const ANIMALS: Animal[] = [
  {
    id: 'cheetah',
    name: '치타',
    emoji: '🐆',
    baseSpeed: 190, // Increased for ~3200m pace
    color: 'bg-yellow-400',
    description: '자신감 넘치는',
    traits: 'fast',
  },
  {
    id: 'dog',
    name: '강아지',
    emoji: '🐕',
    baseSpeed: 180, // Increased significantly
    color: 'bg-orange-400',
    description: '명랑한',
    traits: 'steady',
  },
  {
    id: 'rabbit',
    name: '토끼',
    emoji: '🐇',
    baseSpeed: 170, // Increased
    color: 'bg-pink-300',
    description: '웃는 얼굴의',
    traits: 'lazy',
  },
  {
    id: 'turtle',
    name: '거북이',
    emoji: '🐢',
    baseSpeed: 60, 
    color: 'bg-green-500',
    description: '엉뚱한',
    traits: 'steady',
  },
  {
    id: 'snail',
    name: '달팽이',
    emoji: '🐌',
    baseSpeed: 20, 
    color: 'bg-blue-400',
    description: '열심히 기어가는',
    traits: 'steady',
  },
];

export const TOTAL_RACE_TIME = 20; // seconds

export const RACE_PHRASES = [
  "영차 영차!",
  "이제 뛰어 볼까?!",
  "내가 1등이야!",
  "조금만 더 힘내!",
  "슝~ 슝~",
  "비켜 비켜~",
  "잡아봐라~",
  "으랏차차!"
];

export const SFX_TEXTS = [
  "✨", "💨", "🔥", "🎵", "⚡️"
];

// Complex race logic for narrative
export const calculateRaceDistance = (animalId: string, time: number): number => {
  const t = Math.min(time, TOTAL_RACE_TIME); // Cap at 20s

  let distance = 0;

  switch (animalId) {
    case 'cheetah':
      // Goal: 3200m in 17s
      // 0-5s: Jog -> 120 * 5 = 600
      distance += Math.min(t, 5) * 120;
      // 5-10s: Sprint -> 300 * 5 = 1500 (Cum: 2100)
      if (t > 5) distance += (Math.min(t, 10) - 5) * 300;
      // 10-15s: Jog -> 120 * 5 = 600 (Cum: 2700)
      if (t > 10) distance += (Math.min(t, 15) - 10) * 120;
      // 15s+: Final Sprint -> Needs 500m in 2s (15-17s) -> Speed 250
      // 2700 + 2*250 = 3200 at 17s.
      if (t > 15) distance += (t - 15) * 250;
      break;
    
    case 'rabbit':
      // Goal: 3200m in 19s
      // 0-5s: Fast Start -> 250 * 5 = 1250
      distance += Math.min(t, 5) * 250;
      // 5-10s: Sleep (Stop)
      if (t > 5 && t <= 10) {
         // No distance added
      } else if (t > 10) {
         // 10-19s (9s): Needs 3200 - 1250 = 1950m
         // Speed = 1950 / 9 = ~216.7 -> Let's use 217
         distance += (t - 10) * 217;
      }
      break;

    case 'dog':
      // Goal: 3200m in 17.5s
      // Steady acceleration: d = v0*t + k*t^2
      // Let's use: 150 * t + 1.9 * t^2
      // t=17.5: 150*17.5 (2625) + 1.9*306.25 (581.8) = 3206.8 -> approx 3200
      distance = 150 * t + 1.9 * t * t;
      break;

    case 'turtle':
      // Steady -> 60 cm/s
      distance = 60 * t;
      break;
      
    case 'snail':
      // 0-8s: Crawl -> 15 cm/s
      distance += Math.min(t, 8) * 15;
      // 8-10s: Booster!! -> 250 cm/s
      if (t > 8) distance += (Math.min(t, 10) - 8) * 250;
      // 10s+: Crawl -> 15 cm/s
      if (t > 10) distance += (t - 10) * 15;
      break;
      
    default:
      distance = 0;
  }
  
  return Math.floor(distance);
};

// Reverse calculation helper
export const calculateTimeToReachDistance = (animalId: string, targetDist: number): number | null => {
  // Brute force check
  for (let t = 0.1; t <= TOTAL_RACE_TIME; t += 0.1) {
    if (calculateRaceDistance(animalId, t) >= targetDist) {
      return t;
    }
  }
  return null; // Did not finish in 20s
};