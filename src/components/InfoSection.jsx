import React from 'react';
import { BookOpen, Calculator, ScrollText } from 'lucide-react';

const InfoSection = () => {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 flex flex-col md:flex-row gap-8 mb-8">
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3 text-mebi-blue mb-2">
            <ScrollText className="w-8 h-8" />
            <h3 className="text-xl font-bold">Oyunun Tarihçesi ve Efsanesi</h3>
        </div>
        <p className="text-gray-700 leading-relaxed text-left text-justify">
          Hanoi Kuleleri, 1883 yılında Fransız matematikçi Édouard Lucas tarafından icat edilmiştir. 
          Efsaneye göre, Hindistan'daki Kashi Vishwanath tapınağında büyük bir oda vardır ve 
          içinde Brahman rahipleri bulunur. Bu rahipler, Hindu inanışına göre yaratılışın başlangıcından beri devasa bir Hanoi Kulesi bulmacasını çözmeye çalışırlar. Tapınaktaki bu kulede 64 adet altın disk bulunmaktadır.
        </p>
        <p className="text-gray-700 leading-relaxed text-left text-justify">
          Rahipler her saniye bir disk hareket ettirdiklerinde, bulmacayı çözmeleri için geçmesi gereken süre evrenin ömründen çok daha uzundur. Kule tamamen taşındığında dünyanın sonunun geleceğine inanılır.
        </p>
      </div>

      <div className="w-px bg-gray-200 hidden md:block"></div>

      <div className="flex-1 space-y-4 flex flex-col justify-center">
        <div className="flex items-center gap-3 text-mebi-blue mb-2">
            <Calculator className="w-8 h-8" />
            <h3 className="text-xl font-bold">Matematiksel Formül</h3>
        </div>
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 text-center">
          <p className="text-gray-600 mb-4">
            Bir Hanoi Kulesi bulmacasını çözmek için yapılması gereken <strong className="text-mebi-blue">minimum hamle sayısı</strong> matematikte şu formülle hesaplanır:
          </p>
          <div className="text-4xl font-black text-mebi-light flex items-center justify-center gap-2 drop-shadow-sm">
             2<sup className="text-xl -mt-4">n</sup> - 1
          </div>
          <p className="text-sm text-gray-500 mt-2">n = Disk Sayısı</p>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
