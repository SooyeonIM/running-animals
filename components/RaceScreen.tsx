import React, { useEffect, useRef, useState } from 'react';
import { ANIMALS, TOTAL_RACE_TIME, calculateRaceDistance } from '../constants';
import Button from './Button';

interface RaceScreenProps {
  onFinish: () => void;
}

const RaceScreen: React.FC<RaceScreenProps> = ({ onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStatus, setGameStatus] = useState<'READY' | 'RUNNING' | 'FINISHED'>('READY');
  const [positions, setPositions] = useState<Record<string, number>>(
    ANIMALS.reduce((acc, animal) => ({ ...acc, [animal.id]: 0 }), {})
  );
  // Track bubbles and sfx per animal
  const [bubbles, setBubbles] = useState<Record<string, string>>({});
  const [sfx, setSfx] = useState<Record<string, string>>({});

  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const eventTriggeredRef = useRef<Record<string, boolean>>({});

  // Start Sequence
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (gameStatus === 'READY') {
      timer = setTimeout(() => {
        setGameStatus('RUNNING');
        startTimeRef.current = Date.now();
      }, 2000); // 2 seconds "Ready..."
    }
    return () => clearTimeout(timer);
  }, [gameStatus]);

  const triggerEvent = (id: string, text: string, type: 'bubble' | 'sfx' = 'bubble') => {
      if (type === 'bubble') {
        setBubbles(prev => ({ ...prev, [id]: text }));
        setTimeout(() => setBubbles(prev => { const n = {...prev}; delete n[id]; return n; }), 1500);
      } else {
        setSfx(prev => ({ ...prev, [id]: text }));
        setTimeout(() => setSfx(prev => { const n = {...prev}; delete n[id]; return n; }), 1000);
      }
  };

  // Race Loop
  const animate = (time: number) => {
    if (gameStatus !== 'RUNNING' || !startTimeRef.current) return;

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    setTimeLeft(elapsed);

    if (elapsed >= TOTAL_RACE_TIME) {
      setGameStatus('FINISHED');
      return;
    }

    // Scripted Narrative Events
    const triggers = eventTriggeredRef.current;

    // Rabbit: Sleep at 5s, Wake at 10s (Updated logic)
    if (elapsed > 5 && !triggers['rabbit_sleep']) {
        triggerEvent('rabbit', '쿨쿨...💤');
        triggers['rabbit_sleep'] = true;
    }
    if (elapsed > 10 && !triggers['rabbit_wake']) {
        triggerEvent('rabbit', '헉! 늦었다!! 💦');
        triggerEvent('rabbit', '💨', 'sfx');
        triggers['rabbit_wake'] = true;
    }

    // Cheetah: Sprint at 5s, Jog at 10s, Sprint at 15s
    if (elapsed > 5 && !triggers['cheetah_sprint1']) {
        triggerEvent('cheetah', '이제 달려볼까!! 🔥');
        triggerEvent('cheetah', '⚡️', 'sfx');
        triggers['cheetah_sprint1'] = true;
    }
    if (elapsed > 10 && !triggers['cheetah_jog']) {
        triggerEvent('cheetah', '잠깐 쉬어가야지~ 🎵');
        triggers['cheetah_jog'] = true;
    }
    if (elapsed > 15 && !triggers['cheetah_sprint2']) {
        triggerEvent('cheetah', '마지막 스퍼트!! 🚀');
        triggerEvent('cheetah', '🔥', 'sfx');
        triggers['cheetah_sprint2'] = true;
    }

    // Snail: Booster at 8s
    if (elapsed > 8 && !triggers['snail_boost']) {
        triggerEvent('snail', '초강력 부스터!! 🌪️');
        triggerEvent('snail', '✨', 'sfx');
        triggers['snail_boost'] = true;
    }

    // Dog: Steady encouragement
    if (elapsed > 14 && !triggers['dog_lead']) {
        triggerEvent('dog', '내가 1등이다!! 🐶');
        triggers['dog_lead'] = true;
    }


    setPositions((prev) => {
      const newPositions = { ...prev };
      // Max race distance approx 3300 to match new scales
      const MAX_DIST = 3300;

      ANIMALS.forEach((animal) => {
        const dist = calculateRaceDistance(animal.id, elapsed);
        // Convert to percentage (max 90% of screen)
        newPositions[animal.id] = Math.min((dist / MAX_DIST) * 90, 90);
      });
      
      return newPositions;
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (gameStatus === 'RUNNING') {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus]);

  return (
    <div className="min-h-screen flex flex-col bg-green-100 relative overflow-hidden font-hand">
      {/* Top Info Bar */}
      <div className="bg-white/90 p-4 flex justify-between items-center shadow-md z-20 border-b-4 border-green-200">
        <h2 className="text-3xl font-bold text-green-800">🏁 달리기 대회</h2>
        <div className="text-4xl font-black text-blue-600 drop-shadow-sm">
          {gameStatus === 'READY' ? '준비...' : 
           gameStatus === 'FINISHED' ? '도착!' : 
           `${Math.min(timeLeft, TOTAL_RACE_TIME).toFixed(1)}초`}
        </div>
      </div>

      {/* Track */}
      <div className="flex-1 flex flex-col justify-center gap-2 p-4 relative">
         {/* Finish Line */}
         <div className="absolute top-0 bottom-0 right-[5%] w-4 bg-red-500/20 border-l-4 border-dashed border-red-500 z-0">
            <div className="absolute top-0 -left-12 bg-red-500 text-white text-lg px-2 py-1 rounded font-bold animate-bounce">골인!</div>
         </div>

        {ANIMALS.map((animal) => (
          <div key={animal.id} className="relative h-32 w-full bg-white/40 rounded-l-full rounded-r-3xl border-b-4 border-green-300 flex items-center shadow-sm">
            {/* Lane Marker */}
            <div className="absolute left-4 text-green-700 font-bold text-xl w-24 truncate z-0">{animal.name}</div>
            
            <div 
              className="absolute transition-transform duration-75 will-change-transform flex flex-col items-center z-10"
              style={{ 
                left: '0%',
                // Use transform for smoother animation than left
                transform: `translateX(0)` 
              }}
            >
               {/* Position using marginLeft to avoid complex transform overlap issues in simple layout */}
               <div 
                 style={{ marginLeft: `${positions[animal.id]}vw` }} 
                 className="relative flex flex-col items-center"
               >
                  {/* Speech Bubble */}
                  {bubbles[animal.id] && (
                    <div className="absolute -top-20 left-10 bg-white border-4 border-black text-black px-4 py-2 rounded-2xl rounded-bl-none text-xl font-bold shadow-xl whitespace-nowrap animate-bounce z-30">
                      {bubbles[animal.id]}
                    </div>
                  )}
                  
                  {/* SFX */}
                  {sfx[animal.id] && (
                     <div className="absolute top-0 -right-12 text-5xl animate-ping z-20">
                        {sfx[animal.id]}
                     </div>
                  )}

                  {/* Big Emoji Character */}
                  {/* Added animate-run class when running */}
                  <div className={`text-9xl transform scale-x-[-1] filter drop-shadow-xl cursor-pointer leading-none ${gameStatus === 'RUNNING' ? 'animate-run' : ''}`}>
                    {animal.emoji}
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Result Overlay */}
      {gameStatus === 'FINISHED' && (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-lg w-[90%] border-4 border-yellow-400 animate-fade-in-up">
            <div className="text-8xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">경기 종료!</h2>
            <p className="text-2xl text-gray-600 mb-8">
              와, 정말 치열한 경기였어요!<br/>
              도대체 누가 가장 빨랐을까요?
            </p>
            <Button onClick={onFinish} size="lg" variant="secondary" className="w-full text-2xl">
              다음 단계로 👉
            </Button>
          </div>
        </div>
      )}

      {/* Ready Overlay */}
      {gameStatus === 'READY' && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="text-[10rem] font-black text-yellow-400 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] animate-pulse">
            준비!
          </div>
        </div>
      )}
    </div>
  );
};

export default RaceScreen;