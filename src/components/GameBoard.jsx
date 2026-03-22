import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const GameBoard = ({ diskCount, isSolving, setIsSolving, gameWon, setGameWon, moveCount, setMoveCount, onReset, setUsedSolver, resetTrigger }) => {
  const [towers, setTowers] = useState({
    A: [],
    B: [],
    C: [],
  });
  const [solveSpeed, setSolveSpeed] = useState(300);
  
  // Initialize game
  useEffect(() => {
    const initialDisks = Array.from({ length: diskCount }, (_, i) => ({
      id: `disk-${i}`,
      size: diskCount - i, // Top element gets size 1
      width: `${20 + ((diskCount - i) / diskCount) * 80}%`
    })).reverse(); // Reverse so top disk is at index 0
    
    setTowers({
      A: initialDisks,
      B: [],
      C: [],
    });
  }, [diskCount, resetTrigger]);

  // Check win condition
  useEffect(() => {
    if (towers.C.length === diskCount && moveCount > 0 && !isSolving) {
      setGameWon(true);
    }
  }, [towers.C, diskCount, moveCount, isSolving, setGameWon]);

  // Native HTML5 Drag & Drop
  const handleDragStart = (e, towerId, diskIndex) => {
    if (isSolving || gameWon) {
      e.preventDefault();
      return;
    }
    // Sadece en üstteki disk (index === 0) çekilebilir
    if (diskIndex !== 0) {
      e.preventDefault();
      return; 
    }
    e.dataTransfer.setData('sourceTower', towerId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, destTowerId) => {
    e.preventDefault();
    const sourceTowerId = e.dataTransfer.getData('sourceTower');
    
    if (!sourceTowerId || sourceTowerId === destTowerId || isSolving || gameWon) return;

    const sourceTower = [...towers[sourceTowerId]];
    const destTower = [...towers[destTowerId]];

    if (sourceTower.length === 0) return;

    const diskToMove = sourceTower[0]; // Sürüklenen disk
    const destTopDisk = destTower[0];

    // Geçersiz hamle
    if (destTopDisk && diskToMove.size > destTopDisk.size) {
      return; 
    }

    // Taşıma işlemini gerçekleştir
    sourceTower.shift();
    destTower.unshift(diskToMove);

    setTowers({
      ...towers,
      [sourceTowerId]: sourceTower,
      [destTowerId]: destTower
    });
    
    setMoveCount(prev => prev + 1);
  };

  const solveGame = async () => {
    setIsSolving(true);
    setUsedSolver(true);
    setGameWon(false);
    
    // Re-initialize for solver
    const initialDisks = Array.from({ length: diskCount }, (_, i) => ({
       id: `disk-${i}`,
       size: diskCount - i, 
       width: `${20 + ((diskCount - i) / diskCount) * 80}%`
    })).reverse(); 

    let tempTowers = { A: initialDisks, B: [], C: [] };
    setTowers(tempTowers);
    setMoveCount(0);
    
    const moves = [];
    const hanoi = (n, from, to, aux) => {
      if (n === 0) return;
      hanoi(n - 1, from, aux, to);
      moves.push({ from, to });
      hanoi(n - 1, aux, to, from);
    };

    hanoi(diskCount, 'A', 'C', 'B');

    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    
    for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        
        let newTowers = { ...tempTowers };
        const disk = newTowers[move.from].shift();
        newTowers[move.to].unshift(disk);
        
        tempTowers = { ...newTowers };
        setTowers(tempTowers);
        setMoveCount(prev => prev + 1);
        
        await delay(solveSpeed); // Animation delay variable
    }
    
    setIsSolving(false);
  };

  return (
    <div className="flex flex-col flex-1 bg-slate-50 p-4 md:p-6 rounded-xl border-dashed border-2 border-slate-200">
      
      <div className="flex flex-1 justify-around items-end relative pb-6 border-b-8 border-mebi-blue rounded-b min-h-[400px]">
        {Object.entries(towers).map(([id, disks]) => (
          <div 
            key={id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, id)}
            className="flex flex-col items-center justify-end w-1/3 relative transition-colors h-full"
          >
            {/* Kulenin Çubuğu */}
            <div className="absolute bottom-0 w-3 h-[85%] bg-amber-700/80 rounded-t-xl z-0 shadow-inner translate-y-[2px]"></div>
            
            {/* Diskler */}
            {disks.map((disk, index) => {
                const isTop = index === 0;
                
                return (
                  <motion.div
                    layout
                    layoutId={disk.id}
                    key={disk.id}
                    draggable={isTop && !isSolving && !gameWon}
                    onDragStart={(e) => handleDragStart(e, id, index)}
                    className={`h-7 md:h-10 rounded-full border border-gray-800 flex items-center justify-center shadow-md z-10 my-[1px]
                      ${isTop && !isSolving && !gameWon ? 'cursor-grab hover:brightness-110 active:cursor-grabbing hover:scale-[1.02] transition-transform' : 'cursor-not-allowed'}
                    `}
                    style={{ 
                      width: disk.width,
                      background: `linear-gradient(135deg, hsl(${disk.size * 35}, 70%, 55%), hsl(${disk.size * 35}, 80%, 45%))`,
                    }}
                  >
                    {diskCount <= 8 && <span className="text-white text-xs md:text-sm font-bold shadow-black drop-shadow-md select-none pointer-events-none">{disk.size}</span>}
                  </motion.div>
                );
            })}
            <div className="absolute -bottom-8 font-bold text-gray-500">{id === 'A' ? 'Başlangıç' : id === 'B' ? 'Yardımcı' : 'Hedef'}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 flex justify-center items-center gap-4 pb-4">
        <select 
          value={solveSpeed} 
          onChange={(e) => setSolveSpeed(Number(e.target.value))}
          disabled={isSolving}
          className="border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-mebi-light"
        >
          <option value={800}>Yavaş Hız</option>
          <option value={300}>Normal Hız</option>
          <option value={50}>Hızlı Çözüm</option>
        </select>

        <button
          onClick={solveGame}
          disabled={isSolving}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all
            ${isSolving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:scale-105 active:scale-95'}`}
        >
          {isSolving ? 'Çözülüyor...' : 'Otomatik Çöz'}
          {!isSolving && (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
        </button>
      </div>

    </div>
  );
};

export default GameBoard;
