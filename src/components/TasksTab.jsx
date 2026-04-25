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
  Checkbox,
  IconButton,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const STORAGE_KEY = 'chrono_tasks';

export default function TasksTab() {
  const [tasks,   setTasks]   = useState([]);
  const [newTask, setNewTask] = useState('');

  // ─── load ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setTasks(saved ? JSON.parse(saved) : [
        { id: 1, title: 'Estudar por 30 minutos', done: false },
        { id: 2, title: 'Fazer exercícios',        done: false },
      ]);
    } catch {
      setTasks([]);
    }
  }, []);

  // ─── persist on change ────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // ─── actions ─────────────────────────────────────────────────────────────────
  const addTask = () => {
    const title = newTask.trim();
    if (!title) return;
    setTasks((prev) => [...prev, { id: Date.now(), title, done: false }]);
    setNewTask('');
  };

  const toggleTask = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTask = (id) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  // ─── render ──────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 800 }}>
        Tarefas
      </Typography>

      {/* ── Input ─────────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          label="Nova tarefa"
          fullWidth
          size="small"
        />
        <Button variant="contained" color="secondary" onClick={addTask} sx={{ fontWeight: 800, fontSize: '1.3rem', minWidth: 48 }}>
          +
        </Button>
      </Box>

      {/* ── List ──────────────────────────────────────────────────────────── */}
      <List sx={{ flex: 1, bgcolor: 'background.paper', borderRadius: 2, overflow: 'auto' }}>
        {tasks.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 5, color: 'rgba(255,255,255,0.25)' }}>
            <Typography sx={{ fontSize: 14 }}>Nenhuma tarefa. Adicione uma! ✏️</Typography>
          </Box>
        )}

        {tasks.map((task) => (
          <ListItem
            key={task.id}
            dense
            secondaryAction={
              <IconButton edge="end" size="small" onClick={() => deleteTask(task.id)} sx={{ color: 'rgba(255,255,255,0.25)' }}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: 'secondary.main' } }}
              />
            </ListItemIcon>
            <ListItemText
              primary={task.title}
              primaryTypographyProps={{
                sx: {
                  textDecoration: task.done ? 'line-through' : 'none',
                  color: task.done ? 'rgba(255,255,255,0.3)' : 'white',
                  fontSize: 14,
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}