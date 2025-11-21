import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import RaceScreen from './components/RaceScreen';
import ChoiceScreen from './components/ChoiceScreen';
import TimeMatchScreen from './components/TimeMatchScreen';
import DistanceMatchScreen from './components/DistanceMatchScreen';
import AllRecordsScreen from './components/AllRecordsScreen';
import { AppScreen } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('START');
  const [score, setScore] = useState(0);

  const handleStart = () => setCurrentScreen('RACE');
  const handleRaceFinish = () => setCurrentScreen('MENU');
  const handleModeSelect = (mode: 'TIME_MATCH' | 'DISTANCE_MATCH' | 'ALL_RECORDS') => setCurrentScreen(mode);
  const handleBackToMenu = () => setCurrentScreen('MENU');
  
  const handleScoreUpdate = (points: number) => {
    setScore(prev => Math.max(0, prev + points));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'START':
        return <StartScreen onStart={handleStart} />;
      case 'RACE':
        return <RaceScreen onFinish={handleRaceFinish} />;
      case 'MENU':
        return <ChoiceScreen onSelect={handleModeSelect} score={score} />;
      case 'TIME_MATCH':
        return <TimeMatchScreen onBack={handleBackToMenu} onScoreUpdate={handleScoreUpdate} />;
      case 'DISTANCE_MATCH':
        return <DistanceMatchScreen onBack={handleBackToMenu} onScoreUpdate={handleScoreUpdate} />;
      case 'ALL_RECORDS':
        return <AllRecordsScreen onBack={handleBackToMenu} onScoreUpdate={handleScoreUpdate} />;
      default:
        return <StartScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="font-sans text-gray-800 select-none">
      {renderScreen()}
    </div>
  );
};

export default App;