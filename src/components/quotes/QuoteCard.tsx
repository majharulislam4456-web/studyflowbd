import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Trash2, Quote } from 'lucide-react';
import type { Quote as QuoteType } from '@/types/study';

interface QuoteCardProps {
  quote: QuoteType;
  onDelete: (id: string) => void;
  featured?: boolean;
}

export function QuoteCard({ quote, onDelete, featured = false }: QuoteCardProps) {
  return (
    <div className={cn(
      "glass-card p-6 transition-smooth hover:shadow-lg group animate-fade-in relative overflow-hidden",
      featured && "bg-gradient-to-br from-primary/5 to-accent/5"
    )}>
      {/* Decorative quote icon */}
      <Quote className={cn(
        "absolute -top-2 -left-2 w-16 h-16 opacity-5",
        featured && "opacity-10"
      )} />
      
      <div className="relative">
        <p className={cn(
          "text-lg leading-relaxed",
          quote.isBengali ? "font-bengali" : "",
          featured && "text-xl font-medium"
        )}>
          "{quote.text}"
        </p>
        
        {quote.author && (
          <p className={cn(
            "mt-4 text-sm text-muted-foreground",
            quote.isBengali ? "font-bengali" : ""
          )}>
            — {quote.author}
          </p>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onDelete(quote.id)}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
