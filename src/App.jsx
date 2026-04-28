import { useState, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
  Modal,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
  IconButton,
  CssBaseline,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { keyframes } from '@mui/system';

import TimerIcon       from '@mui/icons-material/Timer';
import CheckBoxIcon    from '@mui/icons-material/CheckBox';
import SettingsIcon    from '@mui/icons-material/Settings';
import BarChartIcon    from '@mui/icons-material/BarChart';



import CORES from '../CORES.json';
import StopwatchTab from './components/StopwatchTab';
import TasksTab     from './components/TasksTab';
import ProgressTab  from './components/ProgressTab';
import TabThree     from './components/TabThree';      

const pulse = keyframes`
  0%   { transform: scale(0.9); opacity: 0.6; }
  50%  { transform: scale(1);   opacity: 1;   }
  100% { transform: scale(0.9); opacity: 0.6; }
`;

function SplashScreen() {
  return (
    <Box sx={{
      height: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column',
      background: '#0a0a0a', color: 'white',
    }}>
      <Box sx={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
        animation: `${pulse} 1.6s infinite ease-in-out`, mb: 3,
      }} />
      <Typography variant="h6" sx={{ opacity: 0.8 }}>Carregando...</Typography>
    </Box>
  );
}

function TabPanel({ children, value, index }) {
  return (
    <div style={{ height: '100%', display: value === index ? 'block' : 'none' }}>
      <Box sx={{ p: 2, height: '100%' }}>{children}</Box>
    </div>
  );
}
export default function App() {
  const [value,         setValue]         = useState(0);
  const [themeIndex,    setThemeIndex]    = useState(0);
  const [showSplash,    setShowSplash]    = useState(true);
  const [settingsOpen,  setSettingsOpen]  = useState(false);
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    document.body.style.margin    = 0;
    document.body.style.background = '#0a0a0a';
    document.documentElement.style.background = '#0a0a0a';

    // ── LOAD ───────────────────────────────────────
    const savedTheme = localStorage.getItem('chrono_theme_index');
    if (savedTheme !== null) setThemeIndex(parseInt(savedTheme, 10));

    const savedNotif = localStorage.getItem('chrono_notifications');
    if (savedNotif !== null) setNotifications(savedNotif === 'true');

    const savedTab = localStorage.getItem('chrono_active_tab');
    if (savedTab !== null) setValue(parseInt(savedTab, 10));

    const timer = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  // ──  notifications ──────────────────────────────────────────────────//PIMP LER SOBRE LIBRARY DE NOTFICIAÇÕES
  useEffect(() => {
    localStorage.setItem('chrono_notifications', notifications);
  }, [notifications]);

  // ──  active tab ────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('chrono_active_tab', value);
  }, [value]);

  const handleThemeSelect = (index) => {
    setThemeIndex(index);
    localStorage.setItem('chrono_theme_index', index);
  };

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary:    { main: CORES[themeIndex]?.primary   ?? '#0f172a' },
      secondary:  { main: CORES[themeIndex]?.secondary ?? '#22c55e' },
      background: { default: '#0a0a0a', paper: 'rgba(255,255,255,0.05)' },
    },
    shape:      { borderRadius: 14 },
    typography: { fontFamily: 'Inter, system-ui, sans-serif' },
  });

  if (showSplash) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SplashScreen />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{
        width: '100%', height: '100vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        background: `
          radial-gradient(circle at 20% 20%, ${CORES[themeIndex]?.primary}33, transparent),
          radial-gradient(circle at 80% 80%, ${CORES[themeIndex]?.secondary}22, transparent),
          #0a0a0a
        `,
      }}>

        {/* ── SETTINGS BUTTON + POS ───────────────────────────────────── */}
        <Box sx={{ position: 'fixed', top: 12, right: 12, zIndex: 20 }}>
          <IconButton
            onClick={() => setSettingsOpen(true)}
            sx={{
              backdropFilter: 'blur(10px)',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              color: 'white',
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <SwipeableViews
            index={value}
            onChangeIndex={setValue}
            enableMouseEvents
            style={{ height: '100%' }}
          >
            {/* 0 — Cronometro */}
            <TabPanel value={value} index={0}>
              <StopwatchTab />
            </TabPanel>

            {/* 1 — Tarefas */}
            <TabPanel value={value} index={1}>
              <TasksTab />
            </TabPanel>

            {/* 2 — PROGRESS */}
            <TabPanel value={value} index={2}>
              <ProgressTab primaryColor={CORES[themeIndex]?.secondary ?? '#22c55e'} />
            </TabPanel>

            {/* 3 — ISLAND ?*/}
            <TabPanel value={value} index={3}>
              <TabThree theme={CORES[themeIndex]} />
            </TabPanel>
          </SwipeableViews>
        </Box>

        {/* ── Bottom navigation ─────────────────────────────────────────────── */}
        <Paper
          sx={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            backdropFilter: 'blur(10px)',
            background: 'rgba(0,0,0,0.6)',
          }}
          elevation={8}
        >
          <BottomNavigation value={value} onChange={(e, v) => setValue(v)} showLabels>
            <BottomNavigationAction label="Cronômetro" icon={<TimerIcon />} />
            <BottomNavigationAction label="Tarefas"    icon={<CheckBoxIcon />} />
            <BottomNavigationAction label="Progresso"  icon={<BarChartIcon />} />
            <BottomNavigationAction label="Ilha"    icon={<SettingsIcon />} />
          </BottomNavigation>
        </Paper>

        {/* ── Settings modal ────────────────────────────────────────────────── */}
        <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)}>
          <Box sx={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            bgcolor: 'rgba(20,20,20,0.95)',
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            p: 3, backdropFilter: 'blur(20px)',
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Configurações</Typography>

            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Tema</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {CORES.map((cor, index) => (
                    <Box
                      key={index}
                      onClick={() => handleThemeSelect(index)}
                      sx={{
                        width: 36, height: 36, borderRadius: 1.5,
                        bgcolor: cor.primary, cursor: 'pointer',
                        border: themeIndex === index
                          ? '3px solid white'
                          : '2px solid rgba(255,255,255,0.2)',
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                }
                label="Notificações"
              />
            </Stack>
          </Box>
        </Modal>

      </Box>
    </ThemeProvider>
  );
}