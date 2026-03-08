import { useState } from 'react';
import { Plus, Check, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { getRandomMessage } from '@/utils/congratulations';
import { cn } from '@/lib/utils';
import { playComplete, playCelebration, playDelete } from '@/utils/sounds';

export interface DailyTask {
  id: string;
  user_id: string;
  title: string;
  title_bn?: string | null;
  last_completed_date?: string | null;
  created_at: string;
  updated_at: string;
}

interface DailyTaskListProps {
  dailyTasks: DailyTask[];
  addDailyTask: (task: Omit<DailyTask, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateDailyTask: (id: string, updates: Partial<DailyTask>) => Promise<void>;
  deleteDailyTask: (id: string) => Promise<void>;
}

export function DailyTaskList({
  dailyTasks,
  addDailyTask,
  updateDailyTask,
  deleteDailyTask,
}: DailyTaskListProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [newTask, setNewTask] = useState('');
  const [newTaskBn, setNewTaskBn] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const isCompletedToday = (task: DailyTask) => {
    return task.last_completed_date === today;
  };

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    
    await addDailyTask({
      title: newTask,
      title_bn: newTaskBn || null,
      last_completed_date: null,
    });
    
    setNewTask('');
    setNewTaskBn('');
    setIsAdding(false);
  };

  const handleToggle = async (task: DailyTask) => {
    const wasCompleted = isCompletedToday(task);
    
    if (wasCompleted) {
      await updateDailyTask(task.id, { last_completed_date: null });
    } else {
      await updateDailyTask(task.id, { last_completed_date: today });
      
      // Show congratulation message
      const message = getRandomMessage('dailyTaskComplete', language);
      toast({ 
        title: message,
        duration: 3000,
      });
      
      // Check if all daily tasks are now complete
      const otherTasks = dailyTasks.filter(t => t.id !== task.id);
      const allOthersComplete = otherTasks.every(t => isCompletedToday(t));
      
      if (allOthersComplete && dailyTasks.length > 1) {
        setTimeout(() => {
          const allDoneMessage = getRandomMessage('allDailyTasksComplete', language);
          toast({ 
            title: allDoneMessage,
            duration: 5000,
          });
        }, 1500);
      }
    }
  };

  const completedCount = dailyTasks.filter(isCompletedToday).length;
  const totalCount = dailyTasks.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground flex items-center gap-2 font-bengali">
          <RotateCcw className="w-4 h-4 text-primary" />
          {language === 'bn' ? 'প্রতিদিনের কাজ' : 'Daily Tasks'}
        </h3>
        {totalCount > 0 && (
          <span className="text-xs text-muted-foreground font-bengali">
            {completedCount}/{totalCount} {language === 'bn' ? 'সম্পন্ন' : 'done'}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {dailyTasks.map((task) => {
          const completed = isCompletedToday(task);
          const displayTitle = language === 'bn' && task.title_bn ? task.title_bn : task.title;
          
          return (
            <div
              key={task.id}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg transition-all duration-200",
                "hover:bg-muted/50 group",
                completed && "bg-success/10"
              )}
            >
              <Checkbox
                checked={completed}
                onCheckedChange={() => handleToggle(task)}
                className={cn(
                  "transition-all",
                  completed && "bg-success border-success"
                )}
              />
              <span
                className={cn(
                  "flex-1 text-sm font-bengali transition-all",
                  completed && "text-muted-foreground line-through"
                )}
              >
                {displayTitle}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteDailyTask(task.id)}
              >
                <Trash2 className="w-3 h-3 text-destructive" />
              </Button>
            </div>
          );
        })}

        {dailyTasks.length === 0 && !isAdding && (
          <p className="text-sm text-muted-foreground text-center py-4 font-bengali">
            {language === 'bn' ? 'প্রতিদিনের কাজ যোগ করুন' : 'Add daily tasks'}
          </p>
        )}

        {isAdding ? (
          <div className="space-y-2 p-2 bg-muted/30 rounded-lg animate-scale-in">
            <Input
              placeholder={language === 'bn' ? 'কাজের শিরোনাম (ইংরেজি)' : 'Task title (English)'}
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            />
            <Input
              placeholder={language === 'bn' ? 'কাজের শিরোনাম (বাংলা)' : 'Task title (Bengali)'}
              value={newTaskBn}
              onChange={(e) => setNewTaskBn(e.target.value)}
              className="text-sm font-bengali"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} className="flex-1">
                <Check className="w-3 h-3 mr-1" />
                {language === 'bn' ? 'যোগ করুন' : 'Add'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="font-bengali">
              {language === 'bn' ? 'নতুন কাজ যোগ করুন' : 'Add new task'}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
