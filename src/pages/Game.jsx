import React, { useState, useEffect } from 'react';
import GameBoard from '../components/GameBoard';
import Leaderboard from '../components/Leaderboard';
import InfoSection from '../components/InfoSection';

const Game = () => {
  const [diskCount, setDiskCount] = useState(3);
  const [isSolving, setIsSolving] = useState(false);
  const [usedSolver, setUsedSolver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);

  // Timer logic
  useEffect(() => {
    let timer;
    if (!gameWon && !isSolving && !usedSolver && moveCount > 0) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameWon, isSolving, usedSolver, moveCount]);

  const handleReset = () => {
    setMoveCount(0);
    setElapsedTime(0);
    setGameWon(false);
    setIsSolving(false);
    setUsedSolver(false);
    setResetTrigger(prev => prev + 1);
  };

  const handleDiskChange = (e) => {
    const val = parseInt(e.target.value);
    setDiskCount(val);
    handleReset();
  };

  return (
    <div className="min-h-screen bg-mebi-accent p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">

        <div className="flex-[2] bg-white p-6 rounded-2xl shadow-xl border border-gray-100 relative min-h-[600px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-mebi-blue">Oyun Alanı</h2>
            <div className="flex items-center gap-4">
              <label className="text-gray-700 font-medium">
                Disk Sayısı:
                <select
                  value={diskCount}
                  onChange={handleDiskChange}
                  disabled={isSolving || (moveCount > 0 && !gameWon) || usedSolver}
                  className="ml-2 border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-mebi-light"
                >
                  {[3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Sıfırla
              </button>
            </div>
          </div>

          <div className="flex justify-between text-lg text-gray-600 mb-4 px-4">
            <div>
              <span className="font-bold">Hamle:</span> {moveCount}
              <span className="text-sm font-medium text-emerald-600 ml-2">(Hedef: {Math.pow(2, diskCount) - 1})</span>
            </div>
            <div>
              <span className="font-bold">Süre:</span> {elapsedTime} sn
              {usedSolver && <span className="text-red-500 text-sm ml-2 font-medium">(Manuel değil)</span>}
            </div>
          </div>

          <GameBoard
            diskCount={diskCount}
            isSolving={isSolving}
            setIsSolving={setIsSolving}
            gameWon={gameWon}
            setGameWon={setGameWon}
            moveCount={moveCount}
            setMoveCount={setMoveCount}
            onReset={handleReset}
            setUsedSolver={setUsedSolver}
            resetTrigger={resetTrigger}
          />
        </div>

        <div className="w-full lg:w-96 flex flex-col gap-8">
          <Leaderboard
            diskCount={diskCount}
            gameWon={gameWon}
            elapsedTime={elapsedTime}
            isSolving={isSolving}
            usedSolver={usedSolver}
          />
        </div>
      </div>

      <div className="w-full max-w-6xl mt-8">
        <InfoSection />
      </div>

      {/* Footer / Github Link */}
      <footer className="w-full max-w-6xl mt-8 mb-4 text-center flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 font-medium">Bu proje açık kaynak kodludur, kodları inceleyebilir veya geliştirebilirsiniz.</p>
        <a
          href="https://github.com/terdemm/hanoi-kulesi"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-700 transition-colors shadow-xl active:scale-95"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Bana Tıkla
        </a>
      </footer>

      <div className="fixed bottom-4 left-6 md:right-6 md:left-auto text-sm font-semibold text-gray-400 opacity-60 cursor-default pointer-events-none select-none z-50">
        hanoi.tunaerdem.site
      </div>
      <div className="fixed top-4 right-6 text-sm font-semibold text-gray-400 opacity-60 cursor-default pointer-events-none select-none z-50 hidden md:block">
        hanoi.tunaerdem.site
      </div>
    </div>
  );
};

export default Game;
