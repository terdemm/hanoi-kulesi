// Turkish Profanity and Insult Filter (Genişletilmiş Liste)
const badWords = [
  'amk', 'aq', 'sik', 'siktir', 'oç', 'orospu', 'pic', 'piç', 'yarak', 'yarrak', 'pezevenk', 'göt', 'meme', 'fuck', 'shit',
  'amına', 'amk', 'amq', 'pic', 'piç', 'gavat', 'kahpe', 'sürtük', 'yavşak', 'yavsak', 'ibne', 'ipne', 'puşt', 'pust',
  'sikik', 'sikiş', 'sürtük', 'yarag', 'yarrag', 'yarra', 'amcık', 'amcik', 'meme', 'taşşak', 'tassak', 'tasak', 'döl',
  'zina', 'fahişe', 'fahise', 'oruspu', 'orspu', 'am feryadı', 'am başı', 'sokuk', 'sokam', 'sokar', 'gotveren', 'götveren',
  'am', 'amı', 'amin', 'amina', 'aminakoyim', 'amkoyim', 'amqoyim', 
  // Custom permutations for evasion tactics
  'orsb', 'orsbu', 'orosb', 'orosp', '0rsp', '0rsb', 'oc'
];

export const cleanNickname = (name) => {
  let clean = name;
  badWords.forEach(word => {
    // Kelimenin sadece kendisini veya ek almış halini yakalamak için esnek regex
    const regex = new RegExp(`(${word})`, 'gi');
    clean = clean.replace(regex, '***');
  });
  return clean;
};

export const hasProfanity = (name) => {
  // Bütün boşlukları, özel karakterleri, ve noktalama işaretlerini tamamen siler
  // "o. -r s  b  u" -> "orsbu" konumuna gelir.
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9ğüşıöç]/g, ''); 
  
  return badWords.some(word => {
    return normalizedName.includes(word);
  });
};
