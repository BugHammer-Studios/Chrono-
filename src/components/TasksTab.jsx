import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemIcon, ListItemText, Checkbox } from '@mui/material';

const STORAGE_KEY = 'chrono_tasks';

export default function TasksTab() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      setTasks([
        { id: 1, title: 'Estudar cronômetro', done: false },
        { id: 2, title: 'Fazer exercícios', done: false },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const title = newTask.trim();
    if (!title) return;
    setTasks((current) => [...current, { id: Date.now(), title, done: false }]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  };

  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Tarefas
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          label="Nova tarefa"
          variant="outlined"
          sx={{ flex: 1, minWidth: '200px' }}
        />
        <Button variant="contained" onClick={addTask} sx={{ minWidth: '120px' }}>
          Adicionar
        </Button>
      </Box>
      <List sx={{ bgcolor: 'background.paper', borderRadius: 2, height: 'calc(100% - 120px)', overflow: 'auto' }}>
        {tasks.map((task) => (
          <ListItem key={task.id} disablePadding>
            <ListItemIcon>
              <Checkbox edge="start" checked={task.done} onChange={() => toggleTask(task.id)} />
            </ListItemIcon>
            <ListItemText primary={task.title} sx={{ textDecoration: task.done ? 'line-through' : 'none' }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
