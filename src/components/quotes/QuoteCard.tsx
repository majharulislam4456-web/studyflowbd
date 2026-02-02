import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Trash2, Quote, Pencil } from 'lucide-react';
import type { Quote as QuoteType } from '@/hooks/useSupabaseData';

interface QuoteCardProps {
  quote: QuoteType;
  onDelete: (id: string) => void;
  onEdit: (quote: QuoteType) => void;
  featured?: boolean;
}

export function QuoteCard({ quote, onDelete, onEdit, featured = false }: QuoteCardProps) {
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
          quote.is_bengali ? "font-bengali" : "",
          featured && "text-xl font-medium"
        )}>
          "{quote.text}"
        </p>
        
        {quote.author && (
          <p className={cn(
            "mt-4 text-sm text-muted-foreground",
            quote.is_bengali ? "font-bengali" : ""
          )}>
            — {quote.author}
          </p>
        )}
      </div>

      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onEdit(quote)}
          className="text-muted-foreground hover:text-primary"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(quote.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
