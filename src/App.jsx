import { useState, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TimerIcon from '@mui/icons-material/Timer';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import SettingsIcon from '@mui/icons-material/Settings';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PaletteIcon from '@mui/icons-material/Palette';
import CORES from '../CORES.json';
import StopwatchTab from './components/StopwatchTab';
import TasksTab from './components/TasksTab';
import TabThree from './components/TabThree';
import StoreTab from './components/StoreTab';
import ThemeSettingsTab from './components/ThemeSettingsTab';
import SplashScreen from './components/SplashScreen';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {value === index && (
        <Box sx={{ p: 2, width: '100%', textAlign: 'center', height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [value, setValue] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('chrono_theme_index');
    if (savedTheme !== null) {
      setThemeIndex(parseInt(savedTheme, 10));
    }

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  const handleThemeSelect = (index) => {
    setThemeIndex(index);
    localStorage.setItem('chrono_theme_index', index);
  };

  const theme = createTheme({ //CHANGE THEME 
    palette: {
      primary: {
        main: CORES[themeIndex]?.primary ?? '#000000',
      },
      secondary: {
        main: CORES[themeIndex]?.secondary ?? '#fffdfe',
      },
    },
  });

  const temaAtual = CORES[themeIndex];
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  if (showSplash) {
    return (
      <ThemeProvider theme={theme}>
        <SplashScreen />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <SwipeableViews
            index={value}
            onChangeIndex={handleChangeIndex}
            enableMouseEvents
            style={{ height: '100%' }}
            containerStyle={{ height: '100%' }}
          >
            <TabPanel value={value} index={0}>
              <StopwatchTab />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <TasksTab />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <TabThree theme={temaAtual} />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <StoreTab />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <ThemeSettingsTab CORES={CORES} themeIndex={themeIndex} onSelectTheme={handleThemeSelect} />
            </TabPanel>
          </SwipeableViews>
        </Box>

        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
         zIndex: 12,
            width: 72,
          height: 72,
            borderRadius: '50%',
            bgcolor: 'secondary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 6,
            cursor: 'pointer',
            color: 'white',
          }}
          onClick={() => setValue(2)}
        >
          <SettingsIcon sx={{ fontSize: 34 }} />
        </Box>

        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: 'primary.main' }} elevation={8}>
          <BottomNavigation value={value} onChange={handleChange} showLabels sx={{ bgcolor: 'primary.main', minHeight: 74 }}>
            <BottomNavigationAction
              label="Cronômetro"
              icon={<TimerIcon />}
              sx={{ color: 'white', '&.Mui-selected': { color: 'secondary.main' } }}
            />
            <BottomNavigationAction
              label="Tarefas"
              icon={<CheckBoxIcon />}
              sx={{ color: 'white', '&.Mui-selected': { color: 'secondary.main' } }}
            />
            <BottomNavigationAction
              label="Gabubus"
              icon={<SettingsIcon />}
              sx={{ color: 'white', '&.Mui-selected': { color: 'secondary.main' } }}
            />
            <BottomNavigationAction
              label="Loja"
              icon={<StorefrontIcon />}
              sx={{ color: 'white', '&.Mui-selected': { color: 'secondary.main' } }}
            />
            <BottomNavigationAction
              label="Tema"
              icon={<PaletteIcon />}
              sx={{ color: 'white', '&.Mui-selected': { color: 'secondary.main' } }}
            />
          </BottomNavigation>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;
