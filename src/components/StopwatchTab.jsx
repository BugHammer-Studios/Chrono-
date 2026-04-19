import { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';

export default function StopwatchTab() {
  const [minutes, setMinutes] = useState(1);
  const [time, setTime] = useState(60000);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTime(minutes * 60000);
  }, [minutes]);

  useEffect(() => {
    let interval = null;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 10) {
            setIsRunning(false);
            return 0;
          }
          return prevTime - 10;
        });
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const start = () => {
    if (time === 0) {
      setTime(minutes * 60000);
    }
    setIsRunning(true);
  };

  const stop = () => setIsRunning(false);

  const reset = () => {
    setTime(minutes * 60000);
    setIsRunning(false);
  };

  const formatTime = (timeValue) => {
    const minutesValue = Math.floor(timeValue / 60000);
    const seconds = Math.floor((timeValue % 60000) / 1000);
    const milliseconds = Math.floor((timeValue % 1000) / 10);
    return `${minutesValue.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <TextField
        type="number"
        value={minutes}
        onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value, 10) || 0))}
        label="Minutos"
        variant="outlined"
        sx={{ mb: 3, width: '120px' }}
        inputProps={{ min: 0 }}
      />
      <Typography variant="h1" sx={{ mb: 4, fontSize: '4rem' }}>
        {formatTime(time)}
      </Typography>
      <Box>
        <Button variant="contained" onClick={start} disabled={isRunning || time === 0} sx={{ mr: 2, fontSize: '1.1rem' }}>
          Start
        </Button>
        <Button variant="contained" onClick={stop} disabled={!isRunning} sx={{ mr: 2, fontSize: '1.1rem' }}>
          Stop
        </Button>
        <Button variant="contained" onClick={reset} sx={{ fontSize: '1.1rem' }}>
          Reset
        </Button>
      </Box>
    </Box>
  );
}
