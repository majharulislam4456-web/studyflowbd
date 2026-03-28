import { useState } from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import { QuoteCard } from '@/components/quotes/QuoteCard';
import { AddQuoteDialog } from '@/components/quotes/AddQuoteDialog';
import { EditQuoteDialog } from '@/components/quotes/EditQuoteDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Quote } from '@/hooks/useSupabaseData';

interface QuotesViewProps {
  quotes: Quote[];
  addQuote: (quote: Omit<Quote, 'id' | 'user_id' | 'created_at'>) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
}

const defaultBengaliQuotes = [
  { text: 'পরিশ্রম সৌভাগ্যের প্রসূতি।', author: 'বাংলা প্রবাদ' },
  { text: 'যে জ্ঞান অর্জন করে না, সে অন্ধকারে থাকে।', author: 'আল-হাদিস' },
  { text: 'সফলতা কোনো দুর্ঘটনা নয়। এটি কঠোর পরিশ্রম, অধ্যবসায় এবং শেখার ফল।', author: 'পেলে' },
  { text: 'তুমি যদি সূর্যের মতো উজ্জ্বল হতে চাও, তবে প্রথমে সূর্যের মতো পুড়তে শেখো।', author: 'এ.পি.জে আবদুল কালাম' },
  { text: 'শিক্ষা হলো সবচেয়ে শক্তিশালী অস্ত্র যা দিয়ে তুমি পৃথিবী বদলাতে পারো।', author: 'নেলসন ম্যান্ডেলা' },
  { text: 'আজকের পরিশ্রম আগামীকালের সাফল্য।', author: 'বাংলা প্রবাদ' },
  { text: 'ব্যর্থতা মানে হেরে যাওয়া নয়, এটি শেখার একটি সুযোগ।', author: 'স্বামী বিবেকানন্দ' },
  { text: 'একটু একটু করে পড়ো, কিন্তু প্রতিদিন পড়ো। ধারাবাহিকতাই সাফল্যের চাবিকাঠি।', author: 'সংগৃহীত' },
  { text: 'তুমি যা ভাবো, তাই হয়ে ওঠো। তাই বড় ভাবো!', author: 'স্বামী বিবেকানন্দ' },
  { text: 'কষ্ট করে যে পড়ে, সুখ তার কাছে আসে।', author: 'বাংলা প্রবাদ' },
  { text: 'পড়াশোনা একমাত্র বিনিয়োগ যেখানে লোকসান হয় না।', author: 'বেনজামিন ফ্র্যাংকলিন' },
  { text: 'স্বপ্ন সেটা নয় যা তুমি ঘুমিয়ে দেখো, স্বপ্ন সেটা যা তোমাকে ঘুমাতে দেয় না।', author: 'এ.পি.জে আবদুল কালাম' },
  { text: 'আজ না পড়লে কাল পরীক্ষায় কাঁদতে হবে।', author: 'সংগৃহীত' },
  { text: 'যত বেশি ঘাম ঝরাবে ট্রেনিংয়ে, তত কম রক্ত ঝরবে যুদ্ধে।', author: 'সংগৃহীত' },
  { text: 'জ্ঞান অর্জনের জন্য দূর দেশেও যেতে হয়।', author: 'আল-হাদিস' },
  { text: 'তুমি হাজার মাইলের যাত্রা শুরু করো একটি পদক্ষেপে।', author: 'লাও জু' },
  { text: 'ধৈর্য ধরো, সফলতা আসবেই। প্রকৃতিও রাতারাতি ফুল ফোটায় না।', author: 'সংগৃহীত' },
  { text: 'যে ব্যক্তি চেষ্টা করে, পৃথিবী তার পথ ছেড়ে দেয়।', author: 'রালফ ওয়াল্ডো এমার্সন' },
  { text: 'তোমার সময় সীমিত, তাই অন্যের জীবন যাপন করে সময় নষ্ট করো না।', author: 'স্টিভ জবস' },
  { text: 'আজকের কঠিন পড়াশোনাই আগামীর সহজ জীবন।', author: 'সংগৃহীত' },
];

export function QuotesView({
  quotes,
  addQuote,
  updateQuote,
  deleteQuote,
}: QuotesViewProps) {
  const { language } = useLanguage();
  const [editQuote, setEditQuote] = useState<Quote | null>(null);
  
  const bengaliQuotes = quotes.filter(q => q.is_bengali);
  const englishQuotes = quotes.filter(q => !q.is_bengali);
  const isBn = language === 'bn';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            {isBn ? 'অনুপ্রেরণা' : 'Motivation'}
          </h1>
          <p className="text-muted-foreground mt-1 font-bengali">
            {isBn ? 'প্রতিদিনের অনুপ্রেরণামূলক উক্তি' : 'Daily motivational quotes'}
          </p>
        </div>
        <AddQuoteDialog onAdd={addQuote} />
      </div>

      {/* Default Bengali Motivational Quotes */}
      {quotes.length === 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-foreground font-bengali">
            <BookOpen className="w-5 h-5 text-primary" />
            {isBn ? '📚 অনুপ্রেরণামূলক উক্তি' : '📚 Motivational Quotes'}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {defaultBengaliQuotes.map((q, index) => (
              <div key={index} className={`stagger-${(index % 5) + 1}`}>
                <div className="glass-card p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <p className="text-foreground font-bengali leading-relaxed italic">"{q.text}"</p>
                  <p className="text-sm text-primary mt-3 font-bengali font-medium">— {q.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bengali Quotes */}
      {bengaliQuotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground font-bengali">বাংলা উক্তি</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bengaliQuotes.map((quote, index) => (
              <div key={quote.id} className={`stagger-${(index % 5) + 1}`}>
                <QuoteCard quote={quote} onDelete={deleteQuote} onEdit={setEditQuote} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* English Quotes */}
      {englishQuotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">English Quotes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {englishQuotes.map((quote, index) => (
              <div key={quote.id} className={`stagger-${(index % 5) + 1}`}>
                <QuoteCard quote={quote} onDelete={deleteQuote} onEdit={setEditQuote} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <EditQuoteDialog
        quote={editQuote}
        open={!!editQuote}
        onOpenChange={(open) => !open && setEditQuote(null)}
        onSave={updateQuote}
      />
    </div>
  );
}
