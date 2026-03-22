import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { delay: 1, duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-mebi-accent flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={textVariants}
        className="max-w-4xl"
      >
        <div className="mb-6 mx-auto w-24 h-24 bg-mebi-blue rounded-full flex items-center justify-center shadow-lg">
           <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z"></path>
           </svg>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-mebi-blue leading-tight mb-8">
          Florya Tevfik Ercan Anadolu Lisesi
          <span className="block mt-4 text-mebi-blue">Tuna Erdem Hanoi Kuleleri Projesi</span>
          <span className="block mt-2 font-light text-xl md:text-2xl text-gray-600">İnternet Sitesine Hoş Geldiniz</span>
        </h1>
      </motion.div>

      <motion.button
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        onClick={() => navigate('/game')}
        className="mt-8 px-10 py-4 bg-mebi-blue text-white font-semibold rounded-full shadow-xl hover:bg-mebi-light transition-colors text-lg flex items-center gap-2"
      >
        Devam Et
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </motion.button>
    </div>
  );
};

export default Home;
