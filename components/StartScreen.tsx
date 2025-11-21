import React from 'react';
import { ANIMALS } from '../constants';
import Button from './Button';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-200 to-green-200 p-4 text-center overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute top-10 left-10 animate-bounce text-6xl opacity-50">☁️</div>
      <div className="absolute top-20 right-20 animate-bounce text-6xl opacity-50 delay-700">☁️</div>
      
      <div className="z-10 flex flex-col items-center gap-6 max-w-4xl w-full">
        <h1 className="text-6xl md:text-8xl font-black rainbow-text drop-shadow-md mb-2 tracking-tight">
          달려라! 동물 친구들
        </h1>
        <h2 className="text-3xl md:text-4xl text-blue-700 font-hand font-bold bg-white/60 px-6 py-2 rounded-full">
          누가누가 더 빠를까요?
        </h2>

        <div className="relative w-full h-64 my-8">
          {/* Character Showcase */}
          {ANIMALS.map((animal, index) => (
            <div 
              key={animal.id}
              className="absolute bottom-0 transition-all duration-500 hover:scale-110 cursor-pointer"
              style={{ 
                left: `${(index / (ANIMALS.length - 1)) * 80 + 5}%`,
                zIndex: index 
              }}
            >
              <div className="text-7xl md:text-9xl filter drop-shadow-xl animate-pulse" style={{ animationDelay: `${index * 0.2}s` }}>
                {animal.emoji}
              </div>
              <div className="bg-white/80 px-2 py-1 rounded-lg text-sm md:text-lg font-bold text-gray-700 mt-2 shadow-sm transform -rotate-6">
                {animal.name}
              </div>
            </div>
          ))}
        </div>

        <Button onClick={onStart} size="lg" className="animate-bounce mt-8 z-20">
          시작하기! 🏁
        </Button>
      </div>
      
      {/* Grass */}
      <div className="absolute bottom-0 w-full h-24 bg-green-400 rounded-t-[50%] scale-125 shadow-inner"></div>
    </div>
  );
};

export default StartScreen;