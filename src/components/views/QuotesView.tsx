import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { QuoteCard } from '@/components/quotes/QuoteCard';
import { AddQuoteDialog } from '@/components/quotes/AddQuoteDialog';
import { EditQuoteDialog } from '@/components/quotes/EditQuoteDialog';
import type { Quote } from '@/hooks/useSupabaseData';

interface QuotesViewProps {
  quotes: Quote[];
  addQuote: (quote: Omit<Quote, 'id' | 'user_id' | 'created_at'>) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
}

export function QuotesView({
  quotes,
  addQuote,
  updateQuote,
  deleteQuote,
}: QuotesViewProps) {
  const [editQuote, setEditQuote] = useState<Quote | null>(null);
  
  const bengaliQuotes = quotes.filter(q => q.is_bengali);
  const englishQuotes = quotes.filter(q => !q.is_bengali);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            Motivation
          </h1>
          <p className="text-muted-foreground mt-1 font-bengali">
            অনুপ্রেরণা - প্রতিদিনের অনুপ্রেরণামূলক উক্তি
          </p>
        </div>
        <AddQuoteDialog onAdd={addQuote} />
      </div>

      {/* Bengali Quotes */}
      {bengaliQuotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground font-bengali">
            বাংলা উক্তি
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bengaliQuotes.map((quote, index) => (
              <div key={quote.id} className={`stagger-${(index % 5) + 1}`}>
                <QuoteCard 
                  quote={quote} 
                  onDelete={deleteQuote} 
                  onEdit={setEditQuote}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* English Quotes */}
      {englishQuotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            English Quotes
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {englishQuotes.map((quote, index) => (
              <div key={quote.id} className={`stagger-${(index % 5) + 1}`}>
                <QuoteCard 
                  quote={quote} 
                  onDelete={deleteQuote}
                  onEdit={setEditQuote}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {quotes.length === 0 && (
        <div className="text-center py-16">
          <Sparkles className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No quotes yet / <span className="font-bengali">এখনো কোনো উক্তি নেই</span>
          </h3>
          <p className="text-muted-foreground">
            Add your favorite motivational quotes / <span className="font-bengali">আপনার প্রিয় অনুপ্রেরণামূলক উক্তি যোগ করুন</span>
          </p>
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
