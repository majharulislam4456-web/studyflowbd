import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'bn';

interface Translations {
  [key: string]: {
    en: string;
    bn: string;
  };
}

export const translations: Translations = {
  // Navigation
  dashboard: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  syllabus: { en: 'Syllabus', bn: 'সিলেবাস' },
  pomodoro: { en: 'Pomodoro', bn: 'পমোডোরো' },
  goals: { en: 'Goals', bn: 'লক্ষ্য' },
  logger: { en: 'Study Log', bn: 'স্টাডি লগ' },
  quotes: { en: 'Quotes', bn: 'উক্তি' },
  analytics: { en: 'Analytics', bn: 'বিশ্লেষণ' },
  profile: { en: 'Profile', bn: 'প্রোফাইল' },
  
  // Common Actions
  save: { en: 'Save', bn: 'সংরক্ষণ' },
  cancel: { en: 'Cancel', bn: 'বাতিল' },
  delete: { en: 'Delete', bn: 'মুছুন' },
  edit: { en: 'Edit', bn: 'সম্পাদনা' },
  add: { en: 'Add', bn: 'যোগ করুন' },
  search: { en: 'Search', bn: 'খুঁজুন' },
  loading: { en: 'Loading...', bn: 'লোড হচ্ছে...' },
  
  // Auth
  login: { en: 'Login', bn: 'লগইন' },
  signup: { en: 'Sign Up', bn: 'সাইন আপ' },
  logout: { en: 'Logout', bn: 'লগআউট' },
  email: { en: 'Email', bn: 'ইমেইল' },
  password: { en: 'Password', bn: 'পাসওয়ার্ড' },
  name: { en: 'Name', bn: 'নাম' },
  welcomeBack: { en: 'Welcome Back!', bn: 'স্বাগতম!' },
  createAccount: { en: 'Create Account', bn: 'অ্যাকাউন্ট তৈরি করুন' },
  continueWithGoogle: { en: 'Continue with Google', bn: 'গুগল দিয়ে লগইন' },
  or: { en: 'Or', bn: 'অথবা' },
  dontHaveAccount: { en: "Don't have an account?", bn: 'অ্যাকাউন্ট নেই?' },
  alreadyHaveAccount: { en: 'Already have an account?', bn: 'অ্যাকাউন্ট আছে?' },
  
  // Dashboard
  todayStudyTime: { en: "Today's Study Time", bn: 'আজকের পড়ার সময়' },
  weekStudyTime: { en: 'This Week', bn: 'এই সপ্তাহ' },
  completedGoals: { en: 'Completed Goals', bn: 'সম্পন্ন লক্ষ্য' },
  subjects: { en: 'Subjects', bn: 'বিষয়' },
  specialTasks: { en: 'Special Tasks', bn: 'বিশেষ কাজ' },
  noSpecialTasks: { en: 'No special tasks', bn: 'কোন বিশেষ কাজ নেই' },
  dailyTasks: { en: 'Daily Tasks', bn: 'প্রতিদিনের কাজ' },
  noDailyTasks: { en: 'Add daily tasks', bn: 'প্রতিদিনের কাজ যোগ করুন' },
  
  // Syllabus
  addSubject: { en: 'Add Subject', bn: 'বিষয় যোগ করুন' },
  subjectName: { en: 'Subject Name', bn: 'বিষয়ের নাম' },
  totalChapters: { en: 'Total Chapters', bn: 'মোট অধ্যায়' },
  completedChapters: { en: 'Completed Chapters', bn: 'সম্পন্ন অধ্যায়' },
  progress: { en: 'Progress', bn: 'অগ্রগতি' },
  
  // Goals
  addGoal: { en: 'Add Goal', bn: 'লক্ষ্য যোগ করুন' },
  goalTitle: { en: 'Goal Title', bn: 'লক্ষ্যের শিরোনাম' },
  mission: { en: 'Mission (30 days)', bn: 'মিশন (৩০ দিন)' },
  weekly: { en: 'Weekly (7 days)', bn: 'সাপ্তাহিক (৭ দিন)' },
  shortTerm: { en: 'Short Term (3 days)', bn: 'স্বল্পমেয়াদী (৩ দিন)' },
  daysRemaining: { en: 'Days Remaining', bn: 'বাকি দিন' },
  
  // Todo
  todoList: { en: 'To-Do List', bn: 'করণীয় তালিকা' },
  addTask: { en: 'Add Task', bn: 'কাজ যোগ করুন' },
  taskTitle: { en: 'Task Title', bn: 'কাজের শিরোনাম' },
  dueDate: { en: 'Due Date', bn: 'নির্ধারিত তারিখ' },
  priority: { en: 'Priority', bn: 'অগ্রাধিকার' },
  low: { en: 'Low', bn: 'কম' },
  medium: { en: 'Medium', bn: 'মাঝারি' },
  high: { en: 'High', bn: 'উচ্চ' },
  completed: { en: 'Completed', bn: 'সম্পন্ন' },
  pending: { en: 'Pending', bn: 'অপেক্ষমাণ' },
  
  // Pomodoro
  focusTime: { en: 'Focus Time', bn: 'ফোকাস টাইম' },
  breakTime: { en: 'Break Time', bn: 'বিরতি' },
  startTimer: { en: 'Start Timer', bn: 'টাইমার শুরু' },
  pauseTimer: { en: 'Pause Timer', bn: 'টাইমার থামান' },
  resetTimer: { en: 'Reset Timer', bn: 'টাইমার রিসেট' },
  
  // Profile
  settings: { en: 'Settings', bn: 'সেটিংস' },
  language: { en: 'Language', bn: 'ভাষা' },
  english: { en: 'English', bn: 'ইংরেজি' },
  bengali: { en: 'Bengali', bn: 'বাংলা' },
  theme: { en: 'Theme', bn: 'থিম' },
  themeColor: { en: 'Theme Color', bn: 'থিম রঙ' },
  darkMode: { en: 'Dark Mode', bn: 'ডার্ক মোড' },
  lightMode: { en: 'Light Mode', bn: 'লাইট মোড' },
  avatar: { en: 'Avatar', bn: 'অবতার' },
  uploadPhoto: { en: 'Upload Photo', bn: 'ছবি আপলোড' },
  chooseAvatar: { en: 'Choose Avatar', bn: 'অবতার নির্বাচন' },
  aboutApp: { en: 'About App', bn: 'অ্যাপ সম্পর্কে' },
  version: { en: 'Version', bn: 'ভার্সন' },
  createdBy: { en: 'Created by', bn: 'তৈরি করেছেন' },
  security: { en: 'Security', bn: 'নিরাপত্তা' },
  changePassword: { en: 'Change Password', bn: 'পাসওয়ার্ড পরিবর্তন' },
  twoFactorAuth: { en: 'Two-Factor Auth', bn: 'টু-ফ্যাক্টর অথ' },
  
  // Analytics
  dailyTrends: { en: 'Daily Trends', bn: 'দৈনিক প্রবণতা' },
  weeklyComparison: { en: 'Weekly Comparison', bn: 'সাপ্তাহিক তুলনা' },
  subjectDistribution: { en: 'Subject Distribution', bn: 'বিষয় বিতরণ' },
  studyMinutes: { en: 'Study Minutes', bn: 'পড়ার সময় (মিনিট)' },
  
  // Quotes
  addQuote: { en: 'Add Quote', bn: 'উক্তি যোগ করুন' },
  quoteText: { en: 'Quote Text', bn: 'উক্তির লেখা' },
  author: { en: 'Author', bn: 'লেখক' },
  
  // Messages
  success: { en: 'Success', bn: 'সফল' },
  error: { en: 'Error', bn: 'ত্রুটি' },
  saved: { en: 'Saved successfully', bn: 'সফলভাবে সংরক্ষিত' },
  deleted: { en: 'Deleted successfully', bn: 'সফলভাবে মুছে ফেলা হয়েছে' },
  
  // Avatars
  student: { en: 'Student', bn: 'শিক্ষার্থী' },
  teacher: { en: 'Teacher', bn: 'শিক্ষক' },
  doctor: { en: 'Doctor', bn: 'ডাক্তার' },
  engineer: { en: 'Engineer', bn: 'ইঞ্জিনিয়ার' },
  scientist: { en: 'Scientist', bn: 'বিজ্ঞানী' },
  artist: { en: 'Artist', bn: 'শিল্পী' },
  developer: { en: 'Developer', bn: 'ডেভেলপার' },
  entrepreneur: { en: 'Entrepreneur', bn: 'উদ্যোক্তা' },
  
  // New Profession Avatars
  bcsCadre: { en: 'BCS Cadre', bn: 'বিসিএস ক্যাডার' },
  lawyer: { en: 'Lawyer', bn: 'আইনজীবী' },
  banker: { en: 'Banker', bn: 'ব্যাংকার' },
  judge: { en: 'Judge', bn: 'বিচারক' },
  pilot: { en: 'Pilot', bn: 'পাইলট' },
  nurse: { en: 'Nurse', bn: 'নার্স' },
  accountant: { en: 'Accountant', bn: 'হিসাবরক্ষক' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('bn');

  useEffect(() => {
    const saved = localStorage.getItem('studyflow-language') as Language;
    if (saved && (saved === 'en' || saved === 'bn')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('studyflow-language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
