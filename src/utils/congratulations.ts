 export const congratulationMessages = {
   todoComplete: [
     { en: "🎉 Great job! Task completed!", bn: "🎉 চমৎকার! কাজ শেষ!" },
     { en: "✅ Well done! Keep it up!", bn: "✅ সাবাস! চালিয়ে যাও!" },
     { en: "💪 Task crushed! You're on fire!", bn: "💪 কাজ শেষ! তুমি দুর্দান্ত!" },
     { en: "🌟 Excellent work!", bn: "🌟 অসাধারণ কাজ!" },
     { en: "👏 One step closer to your goals!", bn: "👏 লক্ষ্যের আরও কাছে!" },
   ],
   allTodosComplete: [
     { en: "🏆 Amazing! All tasks completed for today!", bn: "🏆 অসাধারণ! আজকের সব কাজ শেষ!" },
     { en: "🎊 Perfect day! You finished everything!", bn: "🎊 নিখুঁত দিন! সব শেষ করেছ!" },
     { en: "🌈 Incredible! Nothing left on your list!", bn: "🌈 অবিশ্বাস্য! তালিকা খালি!" },
     { en: "⭐ Superstar! All done!", bn: "⭐ সুপারস্টার! সব শেষ!" },
     { en: "🚀 You're unstoppable today!", bn: "🚀 তুমি আজ অপ্রতিরোধ্য!" },
   ],
   goalComplete: [
     { en: "🎯 Goal achieved! You did it!", bn: "🎯 লক্ষ্য অর্জিত! তুমি পারলে!" },
     { en: "🏅 Mission accomplished!", bn: "🏅 মিশন সম্পন্ন!" },
     { en: "🎖️ Congratulations on reaching your goal!", bn: "🎖️ লক্ষ্যে পৌঁছানোর জন্য অভিনন্দন!" },
     { en: "💫 You're a champion!", bn: "💫 তুমি একজন চ্যাম্পিয়ন!" },
     { en: "🥇 Victory! Goal completed!", bn: "🥇 বিজয়! লক্ষ্য সম্পন্ন!" },
   ],
   chapterComplete: [
     { en: "📚 Chapter done! Great progress!", bn: "📚 অধ্যায় শেষ! দারুণ অগ্রগতি!" },
     { en: "📖 Another chapter conquered!", bn: "📖 আরেকটি অধ্যায় জয়!" },
     { en: "🎓 Keep learning! You're doing great!", bn: "🎓 শিখে যাও! তুমি দারুণ করছ!" },
     { en: "📕 One more chapter in the bag!", bn: "📕 আরেকটি অধ্যায় পকেটে!" },
     { en: "✨ Excellent! Progress made!", bn: "✨ চমৎকার! অগ্রগতি হয়েছে!" },
   ],
   subjectComplete: [
     { en: "🎉 Subject completed! You mastered it!", bn: "🎉 বিষয় সম্পূর্ণ! তুমি আয়ত্ত করেছ!" },
     { en: "🏆 Full subject done! Amazing!", bn: "🏆 পুরো বিষয় শেষ! অসাধারণ!" },
     { en: "🌟 100%! You're a subject master!", bn: "🌟 ১০০%! তুমি বিষয়ের মাস্টার!" },
   ],
   studySession: [
     { en: "⏰ Study session logged!", bn: "⏰ স্টাডি সেশন লগ হয়েছে!" },
     { en: "📝 Great study session!", bn: "📝 দারুণ স্টাডি সেশন!" },
     { en: "💪 Keep up the hard work!", bn: "💪 কঠোর পরিশ্রম চালিয়ে যাও!" },
   ],
 };
 
 export function getRandomMessage(type: keyof typeof congratulationMessages, language: 'en' | 'bn' = 'bn'): string {
   const messages = congratulationMessages[type];
   const randomIndex = Math.floor(Math.random() * messages.length);
   return messages[randomIndex][language];
 }