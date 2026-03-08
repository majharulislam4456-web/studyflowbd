import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
 import { Plus, Trash2, Calendar, Flag, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { getRandomMessage } from '@/utils/congratulations';
import { playComplete, playCelebration, playDelete, playSuccess } from '@/utils/sounds';

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  title_bn?: string | null;
  is_completed: boolean;
  due_date?: string | null;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

interface TodoListProps {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  compact?: boolean;
}

export function TodoList({ todos, addTodo, updateTodo, deleteTodo, compact = false }: TodoListProps) {
  const { t, language } = useLanguage();
   const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

   const handleToggleTodo = async (todo: Todo, checked: boolean) => {
     await updateTodo(todo.id, { is_completed: checked });
     
     if (checked) {
       // Show congratulation for completing a task
       const message = getRandomMessage('todoComplete', language);
       toast({ 
         title: message,
         duration: 3000,
       });
       
       // Check if all today's todos are complete
       const todayTodos = todos.filter(t => {
         if (!t.due_date) return false;
         const today = new Date().toISOString().split('T')[0];
         return t.due_date === today;
       });
       
       const allComplete = todayTodos.length > 0 && 
         todayTodos.filter(t => t.id !== todo.id).every(t => t.is_completed);
       
       if (allComplete) {
         setTimeout(() => {
           const allDoneMessage = getRandomMessage('allTodosComplete', language);
           toast({ 
             title: allDoneMessage,
             duration: 5000,
           });
         }, 1500);
       }
     }
   };
 
  const handleSubmit = async () => {
    if (!title.trim()) return;
    
    await addTodo({
      title: title.trim(),
      title_bn: titleBn.trim() || null,
      is_completed: false,
      due_date: dueDate || null,
      priority,
    });
    
    setTitle('');
    setTitleBn('');
    setDueDate('');
    setPriority('medium');
    setIsOpen(false);
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-destructive bg-destructive/10';
      case 'medium': return 'text-amber-600 bg-amber-500/10';
      case 'low': return 'text-green-600 bg-green-500/10';
      default: return '';
    }
  };

  const todayTodos = todos.filter(todo => {
    if (!todo.due_date) return false;
    const today = new Date().toISOString().split('T')[0];
    return todo.due_date === today;
  });

  const displayTodos = compact ? todayTodos : todos;

  if (compact) {
    return (
      <div className="space-y-2">
        <h3 className="font-semibold font-bengali flex items-center gap-2">
          <Flag className="w-4 h-4 text-primary" />
          {t('specialTasks')}
        </h3>
        {displayTodos.length === 0 ? (
          <p className="text-sm text-muted-foreground font-bengali">{t('noSpecialTasks')}</p>
        ) : (
          <div className="space-y-1">
            {displayTodos.slice(0, 5).map(todo => (
              <div 
                key={todo.id} 
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg bg-muted/50",
                   todo.is_completed && "opacity-50",
                   "transition-all hover:scale-[1.02]"
                )}
              >
                <Checkbox
                  checked={todo.is_completed}
                   onCheckedChange={(checked) => handleToggleTodo(todo, !!checked)}
                />
                <span className={cn(
                  "text-sm flex-1",
                  todo.is_completed && "line-through"
                )}>
                  {language === 'bn' && todo.title_bn ? todo.title_bn : todo.title}
                </span>
                <span className={cn("text-xs px-1.5 py-0.5 rounded", getPriorityColor(todo.priority))}>
                  {t(todo.priority)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-bengali">{t('todoList')}</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="gradient">
              <Plus className="w-4 h-4 mr-1" />
              {t('addTask')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-bengali">{t('addTask')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t('taskTitle')} (English)</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bengali">{t('taskTitle')} (বাংলা)</Label>
                <Input
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  placeholder="কাজের শিরোনাম লিখুন"
                  className="font-bengali"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('dueDate')}</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('priority')}</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as 'low' | 'medium' | 'high')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('low')}</SelectItem>
                    <SelectItem value="medium">{t('medium')}</SelectItem>
                    <SelectItem value="high">{t('high')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {t('add')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {todos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="font-bengali">{t('noTasksToday')}</p>
          </div>
        ) : (
          todos.map(todo => (
            <div
              key={todo.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl bg-card border border-border transition-all",
                 todo.is_completed && "opacity-60",
                 "hover:shadow-md hover:scale-[1.01] animate-fade-in"
              )}
            >
              <Checkbox
                checked={todo.is_completed}
                 onCheckedChange={(checked) => handleToggleTodo(todo, !!checked)}
              />
              <div className="flex-1">
                <p className={cn(
                  "font-medium",
                  todo.is_completed && "line-through"
                )}>
                  {language === 'bn' && todo.title_bn ? todo.title_bn : todo.title}
                </p>
                {todo.due_date && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(todo.due_date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}
                  </p>
                )}
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-xs",
                getPriorityColor(todo.priority)
              )}>
                <Flag className="w-3 h-3" />
                {t(todo.priority)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
