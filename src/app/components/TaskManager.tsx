import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, Target } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  focusMinutes: number;
  completed: boolean;
}

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onEditTask: (id: string, task: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  activeTaskId: string | null;
  onSetActiveTask: (id: string | null) => void;
}

export function TaskManager({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  activeTaskId,
  onSetActiveTask,
}: TaskManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      if (editingId) {
        onEditTask(editingId, formData);
        setEditingId(null);
      } else {
        onAddTask({
          ...formData,
          focusMinutes: 0,
          completed: false,
        });
      }
      setFormData({ title: '', description: '' });
      setShowAddForm(false);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setFormData({ title: task.title, description: task.description });
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', description: '' });
    setShowAddForm(false);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-white">Task Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl">
          <h3 className="text-white mb-4">{editingId ? 'Edit Task' : 'New Task'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm block mb-2">Task Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 transition-all"
                required
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm block mb-2">Description (optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add task details..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20 transition-all resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                {editingId ? 'Update' : 'Add'} Task
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-gray-400 mb-2">No tasks yet</p>
            <p className="text-gray-500 text-sm">Create your first task to start tracking your focus time</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white/5 backdrop-blur-xl border rounded-xl p-6 transition-all hover:shadow-xl ${
                activeTaskId === task.id
                  ? 'border-purple-500/50 shadow-lg shadow-purple-500/20'
                  : 'border-white/10 hover:border-white/20'
              } ${task.completed ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => onEditTask(task.id, { completed: !task.completed })}
                  className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent'
                      : 'border-white/30 hover:border-blue-500'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4 text-white" />}
                </button>

                {/* Task Content */}
                <div className="flex-1">
                  <h3 className={`text-white mb-2 ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-gray-400 text-sm mb-3">{task.description}</p>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-gray-400">
                        Focus time: <span className="text-blue-400">{formatTime(task.focusMinutes)}</span>
                      </span>
                    </div>
                    {activeTaskId === task.id && (
                      <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-xs">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!task.completed && (
                    <button
                      onClick={() => onSetActiveTask(activeTaskId === task.id ? null : task.id)}
                      className={`p-2 rounded-lg transition-all ${
                        activeTaskId === task.id
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                      title={activeTaskId === task.id ? 'Deactivate' : 'Set as active'}
                    >
                      <Target className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(task)}
                    className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 bg-white/5 rounded-lg hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
