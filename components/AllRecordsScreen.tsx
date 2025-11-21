import React, { useState, useEffect } from 'react';
import { ANIMALS } from '../constants';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import ResultModal from './ResultModal';
import { Animal } from '../types';

interface AllRecordsScreenProps {
  onBack: () => void;
  onScoreUpdate: (points: number) => void;
}

interface RandomRecord {
  animal: Animal;
  distance: number; // m (treated as raw units)
  time: number; // s
  speed: number; // m/s (calculated or implied)
}

const MAX_VISUAL_DIST = 3300; // Adjusted scale for updated speeds

const AllRecordsScreen: React.FC<AllRecordsScreenProps> = ({ onBack, onScoreUpdate }) => {
  const [records, setRecords] = useState<RandomRecord[]>([]);
  const [modalState, setModalState] = useState<{show: boolean, isCorrect: boolean, animal: Animal | null}>({
    show: false, isCorrect: false, animal: null
  });

  const generateRecords = () => {
    const newRecords: RandomRecord[] = ANIMALS.map(animal => {
      // For "All Records", we want to test the concept of Speed = Distance / Time.
      // We will assign random speeds (close to base) and random times, then calculate distance.
      // This ensures the winner isn't always the Cheetah (who has highest base speed).
      
      const randomSpeedFactor = 0.5 + Math.random() * 1.0; // 0.5x to 1.5x variance
      const calculatedSpeed = Math.floor(animal.baseSpeed * randomSpeedFactor);
      
      // Pick a random time
      const times = [5, 8, 10, 12, 15, 20];
      const time = times[Math.floor(Math.random() * times.length)];
      
      const distance = calculatedSpeed * time;

      return {
        animal,
        time,
        distance,
        speed: calculatedSpeed
      };
    });
    setRecords(newRecords);
  };

  useEffect(() => {
    generateRecords();
  }, []);

  const handleAnimalClick = (record: RandomRecord) => {
    // Find max speed
    const maxSpeed = Math.max(...records.map(r => r.speed));
    const isCorrect = record.speed === maxSpeed;
    
    onScoreUpdate(isCorrect ? 10 : -1);
    setModalState({
        show: true,
        isCorrect,
        animal: record.animal
    });
  };

  const handleCloseModal = () => {
    setModalState(prev => ({...prev, show: false}));
    if (modalState.isCorrect) {
        onBack();
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col font-hand">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 justify-between border-b-4 border-purple-200 z-20">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="text-gray-600 w-8 h-8" />
            </button>
            <div>
                <h2 className="text-3xl font-bold text-purple-700">📊 전체 기록 보기</h2>
                <p className="text-gray-500">시간과 거리가 모두 달라요! 누가 가장 빨랐을까요?</p>
            </div>
        </div>
        <button onClick={generateRecords} className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold hover:bg-purple-200 transition-colors shadow-sm border-2 border-purple-200">
            <RefreshCw size={20} /> 새로운 문제
        </button>
      </div>

      {/* Playground Track View */}
      <div className="flex-1 bg-green-100 relative overflow-hidden flex flex-col justify-center p-4 gap-3">
        
        {/* Start Line */}
        <div className="absolute top-0 bottom-0 left-[5%] w-2 bg-white border-r-2 border-dashed border-gray-300 z-0">
             <div className="absolute top-2 left-2 text-gray-400 font-bold">출발</div>
        </div>

        {/* Decorational Grid Lines */}
        <div className="absolute top-0 bottom-0 left-[33%] w-px bg-purple-200/50 z-0"></div>
        <div className="absolute top-0 bottom-0 left-[66%] w-px bg-purple-200/50 z-0"></div>

        {records.map((record) => {
            // Visual %
            const visualPercent = Math.min((record.distance / MAX_VISUAL_DIST) * 90, 90); 

            return (
                <div key={record.animal.id} className="relative h-28 w-full bg-white/40 rounded-l-full rounded-r-3xl border-b-4 border-purple-300 flex items-center shadow-sm group cursor-pointer" onClick={() => handleAnimalClick(record)}>
                    {/* Name Label */}
                    <div className="absolute left-4 text-purple-900 font-bold text-xl w-24 truncate z-0 bg-white/50 px-2 rounded">{record.animal.name}</div>
                    
                    {/* Animal + Bubble Wrapper */}
                    <div 
                        className="absolute flex flex-col items-center z-10 transition-all duration-500 ease-out"
                        style={{ 
                            left: `${visualPercent}%`,
                            marginLeft: '5%' // Start offset
                        }}
                    >
                        {/* Result Bubble */}
                        <div className="absolute -top-24 bg-white border-4 border-purple-500 text-gray-800 px-3 py-2 rounded-2xl rounded-bl-none shadow-lg whitespace-nowrap z-20 animate-bounce-in origin-bottom-left">
                            <div className="text-center border-b border-gray-200 pb-1 mb-1">
                                <span className="text-xs text-gray-500 mr-1">이동 시간</span>
                                <span className="text-xl font-black text-purple-600">{record.time}초</span>
                            </div>
                             <div className="text-center">
                                <span className="text-xs text-gray-500 mr-1">이동 거리</span>
                                <span className="text-lg font-bold text-gray-700">{record.distance}m</span>
                            </div>
                        </div>

                        {/* Big Emoji */}
                        <div className="text-8xl transform scale-x-[-1] filter drop-shadow-lg group-hover:scale-110 transition-transform">
                            {record.animal.emoji}
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

export default AllRecordsScreen;