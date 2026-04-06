import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { playSuccess } from '@/utils/sounds';
import type { Todo } from '@/components/todo/TodoList';

interface QuickAddTodoProps {
  addTodo: (todo: Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

function isBengaliText(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}

export function QuickAddTodo({ addTodo }: QuickAddTodoProps) {
  const { t, language } = useLanguage();
  const [quickInput, setQuickInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickAdd = async () => {
    const text = quickInput.trim();
    if (!text || isAdding) return;

    setIsAdding(true);
    const isBn = isBengaliText(text);
    const today = new Date().toISOString().split('T')[0];

    playSuccess();
    await addTodo({
      title: isBn ? text : text,
      title_bn: isBn ? text : null,
      is_completed: false,
      due_date: today,
      priority: 'medium',
    });

    setQuickInput('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleQuickAdd();
    }
  };

  return (
    <div className="relative group">
      <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <Input
        value={quickInput}
        onChange={(e) => setQuickInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={language === 'bn' ? '⚡ দ্রুত কাজ যোগ করুন (Enter চাপুন)' : '⚡ Quick add task (press Enter)'}
        className="pl-9 h-11 bg-muted/30 border-dashed border-border/60 focus:border-primary/50 focus:bg-background transition-all"
        disabled={isAdding}
      />
    </div>
  );
}
