import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox
} from '@mui/material';

const STORAGE_KEY = 'chrono_tasks';

export default function TasksTab() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTasks(JSON.parse(saved));
      } else {
        setTasks([
          { id: 1, title: 'Estudar cronômetro', done: false },
          { id: 2, title: 'Fazer exercícios', done: false }
        ]);
      }
    } catch {
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const title = newTask.trim();
    if (!title) return;

    setTasks((current) => [
      ...current,
      { id: Date.now(), title, done: false }
    ]);

    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  return (
    <Box
      sx={{
        height: '100%',
        p: 2,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Tarefas
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          label="Nova tarefa"
          fullWidth
          size="small"
        />

        <Button variant="contained" onClick={addTask}>
          +
        </Button>
      </Box>

      <List
        sx={{
          flex: 1,
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'auto'
        }}
      >
        {tasks.map((task) => (
          <ListItem key={task.id} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              />
            </ListItemIcon>

            <ListItemText
              primary={task.title}
              sx={{
                textDecoration: task.done ? 'line-through' : 'none'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}