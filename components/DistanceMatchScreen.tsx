import React, { useState, useEffect, useRef } from 'react';
import { ANIMALS, calculateRaceDistance, TOTAL_RACE_TIME } from '../constants';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import ResultModal from './ResultModal';
import { Animal } from '../types';

interface DistanceMatchScreenProps {
  onBack: () => void;
  onScoreUpdate: (points: number) => void;
}

// Distance options in Meters (as raw values) - Changed 2500 to 3200
const DISTANCES = [500, 1500, 2000, 3200]; 
// Fixed track scale to represent "Whole Stadium" (slightly larger than max distance)
const MAX_VISUAL_DIST = 3300; 

const DistanceMatchScreen: React.FC<DistanceMatchScreenProps> = ({ onBack, onScoreUpdate }) => {
  const [selectedDist, setSelectedDist] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'SELECT' | 'RUNNING' | 'FINISHED'>('SELECT');
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const [modalState, setModalState] = useState<{show: boolean, isCorrect: boolean, animal: Animal | null}>({
    show: false, isCorrect: false, animal: null
  });

  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();

  // Start immediately when distance is selected
  const handleDistSelect = (dist: number) => {
    setSelectedDist(dist);
    setGameState('RUNNING');
    setElapsedTime(0);
    startTimeRef.current = Date.now();
  };

  const handleReset = () => {
    setGameState('SELECT');
    setSelectedDist(null);
    setElapsedTime(0);
  };

  // Race Loop
  const animate = () => {
    if (gameState !== 'RUNNING' || !startTimeRef.current) return;

    const realElapsed = (Date.now() - startTimeRef.current) / 1000;
    // Apply 1.5x speed multiplier (0.5배 더 빠르게)
    const speedMultiplier = 1.5;
    const simElapsed = realElapsed * speedMultiplier;

    setElapsedTime(simElapsed);

    // End condition: Max time reached
    if (simElapsed >= TOTAL_RACE_TIME) {
      setElapsedTime(TOTAL_RACE_TIME);
      setGameState('FINISHED');
      return;
    }
    
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (gameState === 'RUNNING') {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);


  const getWinnerId = (dist: number) => {
    let minTime = 9999;
    let winner = '';

    ANIMALS.forEach(a => {
        let t = 0;
        let reached = false;
        // Simple scan
        for(let time=0; time<=20; time+=0.1) {
            if (calculateRaceDistance(a.id, time) >= dist) {
                t = time;
                reached = true;
                break;
            }
        }

        if (reached && t < minTime) {
            minTime = t;
            winner = a.id;
        }
    });
    return winner;
  };

  const handleAnimalClick = (animal: Animal) => {
    if (gameState !== 'FINISHED' || !selectedDist) return;
    
    const winnerId = getWinnerId(selectedDist);
    const isCorrect = animal.id === winnerId;
    
    onScoreUpdate(isCorrect ? 10 : -1);
    setModalState({
        show: true,
        isCorrect,
        animal
    });
  };

  const handleCloseModal = () => {
    setModalState(prev => ({...prev, show: false}));
    if (modalState.isCorrect) {
        handleReset();
    }
  };

  // Fixed Grid Markers for the Whole Stadium
  const renderFixedGridLines = () => {
    // Added 3200 to the markers
    const markers = [500, 1000, 1500, 2000, 2500, 3200];
    return markers.map(dist => {
      const leftPct = (dist / MAX_VISUAL_DIST) * 90; // Map to screen width %
      return (
        <div 
          key={dist} 
          className="absolute top-0 bottom-0 border-l border-dashed border-gray-300 z-0 flex flex-col justify-end pb-1 pointer-events-none"
          style={{ left: `${5 + leftPct}%` }} // 5% start offset
        >
          <span className="text-[10px] text-gray-400 pl-1 transform rotate-0">
              {`${dist}m`}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col font-hand">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 border-b-4 border-green-200 z-20">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="text-gray-600 w-8 h-8" />
        </button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-green-700">📏 거리 맞추기</h2>
          <p className="text-gray-500">거리가 같을 때, 누가 가장 빨리 도착할까요?</p>
        </div>
        {gameState !== 'SELECT' && (
            <button onClick={handleReset} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500">
                <RotateCcw size={24} />
            </button>
        )}
      </div>

      {/* Controls */}
      <div className="bg-green-50 p-4 flex justify-center gap-4 shadow-inner flex-wrap z-10">
          {DISTANCES.map(dist => (
            <button
              key={dist}
              onClick={() => handleDistSelect(dist)}
              disabled={gameState === 'RUNNING'}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-2xl font-bold text-lg md:text-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 ${
                selectedDist === dist 
                ? 'bg-green-500 text-white shadow-[0_4px_0_#15803d] translate-y-0' 
                : 'bg-white text-green-600 border-2 border-green-200 shadow-[0_4px_0_#bbf7d0] hover:bg-green-50'
              }`}
            >
              {`${dist}m`}
            </button>
          ))}
      </div>

      {/* Playground Track View - Whole Stadium Scale */}
      <div className="flex-1 bg-green-100 relative overflow-hidden flex flex-col justify-center p-4 gap-3">
        
        {/* Start Line */}
        <div className="absolute top-0 bottom-0 left-[5%] w-2 bg-white border-r-2 border-dashed border-gray-300 z-0">
           <div className="absolute top-2 left-2 text-gray-400 font-bold">출발</div>
        </div>

        {/* Fixed Background Grid (Whole Stadium) */}
        {renderFixedGridLines()}

        {/* Active Finish Line (Moves based on selection) */}
        {selectedDist && (
            <div 
                className="absolute top-0 bottom-0 w-4 bg-red-500/20 border-l-4 border-dashed border-red-500 z-0 transition-all duration-500 ease-out"
                style={{ left: `${5 + (selectedDist / MAX_VISUAL_DIST) * 90}%` }}
            >
                <div className="absolute top-0 -left-16 bg-red-500 text-white px-2 py-1 rounded font-bold animate-bounce whitespace-nowrap min-w-[80px] text-center shadow-md">
                    {`${selectedDist}m`}
                </div>
            </div>
        )}

        {/* Overlay: Select Prompt */}
        {!selectedDist && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-20 backdrop-blur-[1px]">
                <div className="bg-white p-6 rounded-3xl shadow-xl text-center animate-bounce">
                    <div className="text-6xl mb-2">👆</div>
                    <h3 className="text-2xl font-bold text-green-600">위에서 거리를 선택해주세요!</h3>
                </div>
            </div>
        )}

        {ANIMALS.map((animal) => {
            // Physics Logic
            let visualPercent = 0;
            let displayTime = '';
            let hasFinished = false;

            // Calculate current distance regardless of selection to show movement
            // But clamp visual to finish line if selected
            
            const currentDist = calculateRaceDistance(animal.id, elapsedTime);
            
            if (selectedDist) {
                // Check if reached target
                if (currentDist >= selectedDist) {
                    hasFinished = true;
                    // Lock at finish line
                    visualPercent = (selectedDist / MAX_VISUAL_DIST) * 90; 
                    
                    // Find exact finish time for display
                    let t = 0;
                    for(let time=0; time<=20; time+=0.1) {
                        if (calculateRaceDistance(animal.id, time) >= selectedDist) {
                            t = time;
                            break;
                        }
                    }
                    displayTime = `${t.toFixed(1)}초`;
                } else {
                    // Running
                    visualPercent = (currentDist / MAX_VISUAL_DIST) * 90;
                    
                    if (gameState === 'FINISHED') {
                        displayTime = '도착 전';
                    }
                }
            } else {
                // Idle state (0 pos)
                visualPercent = 0;
            }

            return (
                <div 
                  key={animal.id} 
                  className={`relative h-28 w-full bg-white/40 rounded-l-full rounded-r-3xl border-b-4 border-green-300 flex items-center shadow-sm group ${gameState === 'FINISHED' ? 'cursor-pointer hover:bg-white/60' : ''}`} 
                  onClick={() => handleAnimalClick(animal)}
                >
                     {/* Name Label */}
                     <div className="absolute left-4 text-green-800 font-bold text-xl w-24 truncate z-0 bg-white/50 px-2 rounded shadow-sm">{animal.name}</div>
                    
                    {/* Animal + Bubble Wrapper */}
                    <div 
                        className="absolute flex flex-col items-center z-10 will-change-transform"
                        style={{ 
                            // Use transform for smoother animation
                            transform: `translateX(0)`,
                            left: `${5 + visualPercent}%`, // 5% start offset
                            transition: gameState === 'RUNNING' ? 'none' : 'left 0.5s ease-out'
                        }}
                    >
                         {/* Result Bubble */}
                         {(hasFinished || (gameState === 'FINISHED' && selectedDist)) && (
                            <div className="absolute -top-20 bg-white border-4 border-green-500 text-gray-800 px-3 py-2 rounded-2xl rounded-bl-none shadow-lg whitespace-nowrap z-20 animate-bounce-in origin-bottom-left">
                                <span className="text-xs text-gray-500 block">걸린 시간</span>
                                <span className={`font-black ${hasFinished ? 'text-3xl text-green-600' : 'text-xl text-gray-400'}`}>
                                    {displayTime}
                                </span>
                            </div>
                        )}

                        {/* Big Emoji - With Animation Class */}
                        <div className={`text-8xl transform scale-x-[-1] filter drop-shadow-lg transition-transform ${gameState === 'FINISHED' ? 'group-hover:scale-110' : ''} ${(gameState === 'RUNNING' && !hasFinished && selectedDist) ? 'animate-run' : ''}`}>
                            {animal.emoji}
                        </div>
                    </div>
                </div>
            );
        })}
      </div>

      {/* Hint Toast */}
      {gameState === 'FINISHED' && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full animate-fade-in-up pointer-events-none z-30">
            가장 빨리 도착한 동물을 선택하세요!
        </div>
      )}

      {modalState.show && (
        <ResultModal 
          isCorrect={modalState.isCorrect}
          selectedAnimal={modalState.animal}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default DistanceMatchScreen;