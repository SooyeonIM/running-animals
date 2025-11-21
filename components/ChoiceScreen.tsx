import React from 'react';
import Button from './Button';
import { Clock, Ruler, List } from 'lucide-react';

interface ChoiceScreenProps {
  onSelect: (mode: 'TIME_MATCH' | 'DISTANCE_MATCH' | 'ALL_RECORDS') => void;
  score: number;
}

const ChoiceScreen: React.FC<ChoiceScreenProps> = ({ onSelect, score }) => {
  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center p-6">
      <div className="w-full max-w-md flex justify-end mb-4">
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border-2 border-yellow-200 font-bold text-yellow-700 text-xl">
          ⭐ 내 점수: {score}점
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-black text-center mb-10 text-gray-800 mt-8">
        🤔 어떻게 비교해볼까?
      </h1>

      <div className="grid gap-6 w-full max-w-md">
        <button 
          onClick={() => onSelect('TIME_MATCH')}
          className="group bg-white p-6 rounded-3xl shadow-lg border-b-8 border-blue-200 active:border-b-0 active:translate-y-2 transition-all flex items-center gap-6 hover:bg-blue-50"
        >
          <div className="bg-blue-100 p-4 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
            <Clock size={40} />
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-bold text-gray-800">시간 맞추기</h3>
            <p className="text-gray-500 text-sm">시간을 똑같이 하고 거리를 비교해요!</p>
          </div>
        </button>

        <button 
          onClick={() => onSelect('DISTANCE_MATCH')}
          className="group bg-white p-6 rounded-3xl shadow-lg border-b-8 border-green-200 active:border-b-0 active:translate-y-2 transition-all flex items-center gap-6 hover:bg-green-50"
        >
          <div className="bg-green-100 p-4 rounded-2xl text-green-600 group-hover:scale-110 transition-transform">
            <Ruler size={40} />
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-bold text-gray-800">거리 맞추기</h3>
            <p className="text-gray-500 text-sm">거리를 똑같이 하고 시간을 비교해요!</p>
          </div>
        </button>

        <button 
          onClick={() => onSelect('ALL_RECORDS')}
          className="group bg-white p-6 rounded-3xl shadow-lg border-b-8 border-purple-200 active:border-b-0 active:translate-y-2 transition-all flex items-center gap-6 hover:bg-purple-50"
        >
          <div className="bg-purple-100 p-4 rounded-2xl text-purple-600 group-hover:scale-110 transition-transform">
            <List size={40} />
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-bold text-gray-800">전체 기록 보기</h3>
            <p className="text-gray-500 text-sm">시간과 거리를 모두 보고 판단해요!</p>
          </div>
        </button>
      </div>

      <div className="mt-12 text-center text-gray-400 font-hand text-xl">
        정확하게 비교하려면 조건 하나를 통일해야 해요!
      </div>
    </div>
  );
};

export default ChoiceScreen;