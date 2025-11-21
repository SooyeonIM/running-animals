import React from 'react';
import { Animal } from '../types';
import Button from './Button';

interface ResultModalProps {
  isCorrect: boolean;
  selectedAnimal: Animal | null;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ isCorrect, selectedAnimal, onClose }) => {
  if (!selectedAnimal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border-8 ${isCorrect ? 'border-green-400' : 'border-red-400'} animate-bounce-in`}>
        <div className="text-8xl mb-4 filter drop-shadow-lg">
          {isCorrect ? selectedAnimal.emoji : '🤔'}
        </div>
        
        <h2 className={`text-3xl font-black mb-2 ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
          {isCorrect ? '딩동댕! 정답!' : '아쉬워요!'}
        </h2>
        
        <p className="text-gray-600 text-lg mb-6 font-medium">
          {isCorrect 
            ? `${selectedAnimal.name}가 가장 빨랐어요! +10점` 
            : '다시 한번 잘 생각해보세요. -1점'}
        </p>

        <Button onClick={onClose} variant={isCorrect ? 'success' : 'secondary'} className="w-full">
          {isCorrect ? '확인' : '다시 도전'}
        </Button>
      </div>
    </div>
  );
};

export default ResultModal;