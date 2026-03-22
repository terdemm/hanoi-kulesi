import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { hasProfanity, cleanNickname } from '../utils/filter';
import { Trophy, Clock, User, AlertCircle } from 'lucide-react';

const Leaderboard = ({ diskCount, gameWon, elapsedTime, isSolving, usedSolver }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      if (!db.app) { 
        setLoading(false);
        return;
      }
      
      // Removed orderBy and limit from query to avoid Firestore Composite Index errors
      // We will sort and limit in memory using JavaScript!
      const q = query(
        collection(db, 'leaderboard'),
        where('diskCount', '==', diskCount)
      );
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort inherently by time ascending, then slice to top 5
      const sorted = data.sort((a, b) => a.time - b.time).slice(0, 5);
      
      setLeaders(sorted);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
    setSubmitted(false); // Reset submit form when disk changes
  }, [diskCount]);

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (isSolving || usedSolver) {
      setErrorMsg('Otomatik çözüm kullanılarak skor kaydedilemez.');
      return;
    }

    if (!nickname.trim()) {
      setErrorMsg('Lütfen takma ad giriniz.');
      return;
    }

    // Basic length check
    if (nickname.length < 3 || nickname.length > 15) {
      setErrorMsg('Takma ad 3-15 karakter arasında olmalıdır.');
      return;
    }

    if (hasProfanity(nickname)) {
       setErrorMsg('Uygunsuz kelime algılandı!');
       return;
    }

    setSubmitting(true);
    try {
      const cleanName = cleanNickname(nickname);
      await addDoc(collection(db, 'leaderboard'), {
        nickname: cleanName,
        time: elapsedTime,
        diskCount: diskCount,
        timestamp: new Date()
      });
      setSubmitted(true);
      fetchLeaderboard(); // Yeniden tabloyu çek
    } catch (error) {
      console.error('Error adding document: ', error);
      setErrorMsg('Skor kaydedilirken hata oluştu.');
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full flex flex-col h-full border border-gray-100 min-h-[400px]">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
         <Trophy className="text-amber-500 w-8 h-8" />
         <h2 className="text-xl font-bold text-mebi-blue">En İyiler ({diskCount} Disk)</h2>
      </div>

      {loading ? (
        <div className="flex justify-center flex-1 py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mebi-blue"></div>
        </div>
      ) : (
        <div className="flex-1">
          {leaders.length === 0 ? (
            <p className="text-gray-500 text-center py-4 italic">Henüz skor yok. İlk sen ol!</p>
          ) : (
            <ul className="space-y-3">
              {leaders.map((leader, index) => (
                <li key={leader.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-sm transition-transform hover:scale-105">
                   <div className="flex items-center gap-3">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm shadow-md
                        ${index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-slate-400' : index === 2 ? 'bg-amber-600' : 'bg-mebi-blue'}
                      `}>
                        {index + 1}
                      </span>
                      <span className="font-semibold text-gray-800 break-all">{leader.nickname}</span>
                   </div>
                   <div className="flex items-center text-sm font-bold text-mebi-light bg-white px-3 py-1.5 rounded-lg shadow-inner border border-gray-200 gap-1.5 ml-2">
                      <Clock className="w-4 h-4"/>
                      {leader.time} sn
                   </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Submission Form when game is won manually */}
      {gameWon && !isSolving && (
        <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200">
          {usedSolver ? (
            <div className="text-center p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
               <span className="font-bold flex items-center justify-center gap-2 mb-1">
                 <AlertCircle className="w-5 h-5"/>
                 Otomatik Çözüm Kullanıldı
               </span>
               <p className="text-sm">Skor kaydedebilmek için oyunu kendi yeteneklerinizle çözmelisiniz.</p>
            </div>
          ) : !submitted ? (
            <form onSubmit={handleSubmitScore} className="flex flex-col gap-3 relative">
              <h3 className="font-bold text-emerald-600 flex items-center gap-2 mb-2">
                🎉 Tebrikler! {elapsedTime} saniyede bitirdin!
              </h3>
              {errorMsg && (
                <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg flex items-center gap-2 border border-red-300 font-medium">
                  <AlertCircle size={18}/> {errorMsg}
                </div>
              )}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <User size={18} />
                </span>
                <input 
                  type="text" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Takma Adınız"
                  className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-mebi-light focus:outline-none transition-colors"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="bg-mebi-blue text-white py-3 rounded-xl font-bold hover:bg-mebi-light transition-colors disabled:opacity-50 mt-1 shadow-lg active:scale-95 flex justify-center items-center gap-2"
              >
                {submitting ? 'Gönderiliyor...' : 'Skoru Kaydet'}
              </button>
            </form>
          ) : (
            <div className="text-center p-4 bg-emerald-50 text-emerald-700 rounded-xl border-2 border-emerald-200 shadow-inner">
              <span className="font-bold flex justify-center items-center gap-2 mb-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Skor Kaydedildi!
              </span>
              Tekrar oynamak için sıfırlayın.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
