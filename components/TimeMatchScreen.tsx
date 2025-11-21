import React, { useState } from 'react';
import { ANIMALS, calculateRaceDistance } from '../constants';
import { ArrowLeft } from 'lucide-react';
import ResultModal from './ResultModal';
import { Animal } from '../types';

interface TimeMatchScreenProps {
  onBack: () => void;
  onScoreUpdate: (points: number) => void;
}

const TIMES = [5, 10, 15, 20];
// The virtual max distance for scaling (Cheetah 20s = approx 3250)
const MAX_VISUAL_DIST = 3300;

const TimeMatchScreen: React.FC<TimeMatchScreenProps> = ({ onBack, onScoreUpdate }) => {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [modalState, setModalState] = useState<{show: boolean, isCorrect: boolean, animal: Animal | null}>({
    show: false, isCorrect: false, animal: null
  });

  // Determine winner based on distance calculation for selected time
  const getWinnerId = (time: number) => {
    let maxDist = -1;
    let winner = '';
    ANIMALS.forEach(a => {
        const d = calculateRaceDistance(a.id, time);
        if (d > maxDist) {
            maxDist = d;
            winner = a.id;
        }
    });
    return winner;
  };

  const handleAnimalClick = (animal: Animal) => {
    if (!selectedTime) return;
    const winnerId = getWinnerId(selectedTime);
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
        // Return to selection mode instead of exiting
        setSelectedTime(null);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col font-hand">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 border-b-4 border-green-200 z-20">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="text-gray-600 w-8 h-8" />
        </button>
        <div>
            <h2 className="text-3xl font-bold text-blue-600">⏱️ 시간 맞추기</h2>
            <p className="text-gray-500">시간이 같을 때, 누가 가장 멀리 갔을까요?</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-blue-50 p-4 flex justify-center gap-4 shadow-inner">
          {TIMES.map(time => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`px-6 py-3 rounded-2xl font-bold text-2xl transition-all transform hover:scale-105 ${
                selectedTime === time 
                ? 'bg-blue-500 text-white shadow-[0_4px_0_#1e40af] translate-y-0' 
                : 'bg-white text-blue-400 border-2 border-blue-200 shadow-[0_4px_0_#bfdbfe] hover:bg-blue-50'
              }`}
            >
              {time}초
            </button>
          ))}
      </div>

      {/* Playground Track View */}
      <div className="flex-1 bg-green-100 relative overflow-hidden flex flex-col justify-center p-4 gap-3">
        
        {/* Start Line */}
        <div className="absolute top-0 bottom-0 left-[5%] w-2 bg-white border-r-2 border-dashed border-gray-300 z-0">
             <div className="absolute top-2 left-2 text-gray-400 font-bold">출발</div>
        </div>

        {/* Distance Markers (Decorational) */}
        <div className="absolute top-0 bottom-0 left-[25%] w-px bg-green-200 z-0"></div>
        <div className="absolute top-0 bottom-0 left-[50%] w-px bg-green-200 z-0"></div>
        <div className="absolute top-0 bottom-0 left-[75%] w-px bg-green-200 z-0"></div>

        {!selectedTime ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-20 backdrop-blur-[1px]">
                <div className="bg-white p-6 rounded-3xl shadow-xl text-center animate-bounce">
                    <div className="text-6xl mb-2">👆</div>
                    <h3 className="text-2xl font-bold text-blue-600">위에서 시간을 선택해주세요!</h3>
                </div>
            </div>
        ) : null}

        {ANIMALS.map((animal) => {
            // Calculate position based on shared physics logic
            let distance = 0;
            if (selectedTime) {
                distance = calculateRaceDistance(animal.id, selectedTime);
            }
            
            // Visual % (max 90% width to stay on screen)
            const visualPercent = Math.min((distance / MAX_VISUAL_DIST) * 90, 90); 

            return (
                <div key={animal.id} className="relative h-28 w-full bg-white/40 rounded-l-full rounded-r-3xl border-b-4 border-green-300 flex items-center shadow-sm group cursor-pointer" onClick={() => handleAnimalClick(animal)}>
                    {/* Name Label */}
                    <div className="absolute left-4 text-green-800 font-bold text-xl w-24 truncate z-0 bg-white/50 px-2 rounded">{animal.name}</div>
                    
                    {/* Animal + Bubble Wrapper */}
                    <div 
                        className="absolute flex flex-col items-center z-10 transition-all duration-1000 ease-out"
                        style={{ 
                            left: selectedTime ? `${visualPercent}%` : '0%',
                            marginLeft: '5%' // Start offset
                        }}
                    >
                        {/* Result Bubble (Only shown if time is selected) */}
                        {selectedTime && (
                            <div className="absolute -top-20 bg-white border-4 border-blue-500 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none shadow-lg whitespace-nowrap z-20 animate-bounce-in origin-bottom-left">
                                <span className="text-xs text-gray-500 block">이동한 거리</span>
                                <span className="text-3xl font-black text-blue-600">{distance}m</span>
                            </div>
                        )}

                        {/* Big Emoji */}
                        <div className="text-8xl transform scale-x-[-1] filter drop-shadow-lg group-hover:scale-110 transition-transform">
                            {animal.emoji}
                        </div>
                    </div>
                </div>
            );
        })}
      </div>

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

export default TimeMatchScreen;