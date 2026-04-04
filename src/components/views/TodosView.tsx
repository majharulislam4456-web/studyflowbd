import { ListTodo } from 'lucide-react';
import { TodoList, type Todo } from '@/components/todo/TodoList';
import { useLanguage } from '@/contexts/LanguageContext';

interface TodosViewProps {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export function TodosView({ todos, addTodo, updateTodo, deleteTodo }: TodosViewProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <div className="p-2 rounded-xl bg-primary/10">
              <ListTodo className="w-5 h-5 text-primary" />
            </div>
            {isBn ? 'করণীয় তালিকা' : 'To-Do List'}
          </h1>
          <p className="page-subtitle">
            {isBn ? 'আপনার দৈনিক কাজ পরিচালনা করুন' : 'Manage your daily tasks'}
          </p>
        </div>
      </div>

      <div className="glass-card p-6 max-w-2xl">
        <TodoList
          todos={todos}
          addTodo={addTodo}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
        />
      </div>
    </div>
  );
}
