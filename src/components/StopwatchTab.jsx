import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  Stack,
  IconButton,
  Slider,
} from '@mui/material';
import SettingsIcon    from '@mui/icons-material/Settings';

// Constantes para os tipos de sessão
const SESSION_TYPES = {
  WORK: 'Trabalho',
  SHORT_BREAK: 'Intervalo Curto',
};

const FOCUS_TOTAL_KEY = 'chrono_focus_total_ms';
const CONFIG_KEY = 'chrono_pomodoro_config';

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

function loadConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG_KEY));
    return {
      workTime:       saved?.workTime       ?? 25,
      shortBreakTime: saved?.shortBreakTime ?? 5,
      totalCycles:    saved?.totalCycles    ?? 2,
    };
  } catch {
    return { workTime: 25, shortBreakTime: 5, totalCycles: 2 };
  }
}

export default function PomodoroTab() {
  // Configurações de tempo (em minutos) — carregadas do localStorage
  const [workTime,       setWorkTime]       = useState(() => loadConfig().workTime);
  const [shortBreakTime, setShortBreakTime] = useState(() => loadConfig().shortBreakTime);
  const [totalCycles,    setTotalCycles]    = useState(() => loadConfig().totalCycles);

  // Estado do Timer
  const [timeLeft,  setTimeLeft]  = useState(() => loadConfig().workTime * 60000);
  const [totalMs,   setTotalMs]   = useState(() => loadConfig().workTime * 60000);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone,    setIsDone]    = useState(false);

  // Estado do Ciclo
  const [currentCycle, setCurrentCycle] = useState(1);
  const [sessionType,  setSessionType]  = useState(SESSION_TYPES.WORK);

  // UI
  const [configOpen, setConfigOpen] = useState(false);

  const intervalRef = useRef(null);
  const startedAt   = useRef(null);
  const savedMs     = useRef(0);

  // Persistência de tempo focado
  const addFocusTime = (ms) => {
    if (ms <= 500) return;
    const prev = parseInt(localStorage.getItem(FOCUS_TOTAL_KEY) || '0', 10);
    localStorage.setItem(FOCUS_TOTAL_KEY, String(prev + ms));
    window.dispatchEvent(new Event('focusTimeUpdated'));
  };

  // Lógica do Timer
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(intervalRef.current);
          handleSessionEnd();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, sessionType, currentCycle]);

  const handleSessionEnd = () => {
    setIsRunning(false);

    // Registrar tempo se for sessão de trabalho
    if (sessionType === SESSION_TYPES.WORK) {
      const elapsed = Date.now() - startedAt.current;
      addFocusTime(Math.min(elapsed, totalMs - savedMs.current));
    }

    // Lógica de transição de ciclo
    if (sessionType === SESSION_TYPES.WORK) {
      setSessionType(SESSION_TYPES.SHORT_BREAK);
      const ms = shortBreakTime * 60000;
      setTotalMs(ms);
      setTimeLeft(ms);
    } else {
      if (currentCycle < totalCycles) {
        setSessionType(SESSION_TYPES.WORK);
        setCurrentCycle((prev) => prev + 1);
        const ms = workTime * 60000;
        setTotalMs(ms);
        setTimeLeft(ms);
      } else {
        setIsDone(true);
      }
    }
  };

  // Controles
  const handleStart = () => {
    if (isRunning) return;
    startedAt.current = Date.now();
    setIsRunning(true);
    setIsDone(false);
  };

  const handlePause = () => {
    if (!isRunning) return;
    if (sessionType === SESSION_TYPES.WORK) {
      const elapsed = Date.now() - startedAt.current;
      const toAdd = Math.min(elapsed, totalMs - savedMs.current);
      addFocusTime(toAdd);
      savedMs.current += toAdd;
    }
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setCurrentCycle(1);
    setSessionType(SESSION_TYPES.WORK);
    const ms = workTime * 60000;
    setTotalMs(ms);
    setTimeLeft(ms);
    setIsDone(false);
    savedMs.current = 0;
  };

  // Botões de ajuste (+5, +10)
  const addMinutes = (mins) => {
    const msToAdd = mins * 60000;
    setTotalMs((prev) => prev + msToAdd);
    setTimeLeft((prev) => prev + msToAdd);
  };

  // Adicionar ciclo extra
  const addExtraCycle = () => {
    setTotalCycles((prev) => prev + 1);
    setIsDone(false);
    setSessionType(SESSION_TYPES.WORK);
    setCurrentCycle((prev) => prev + 1);
    const ms = workTime * 60000;
    setTotalMs(ms);
    setTimeLeft(ms);
    handleStart();
  };

  // Salvar configs e reiniciar
  const applyConfig = () => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify({ workTime, shortBreakTime, totalCycles }));
    handleReset();
    setConfigOpen(false);
  };

  const progress = totalMs > 0 ? (totalMs - timeLeft) / totalMs : 0;
  const R = 100;
  const C = 2 * Math.PI * R;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', overflowY: 'auto', pb: 4, px: 2 }}>

      {/* Header — só o título, sem ícone de config aqui */}
      <Stack direction="row" justifyContent="flex-start" alignItems="center" sx={{ width: '100%', mb: 2 }}>

      </Stack>

      <Typography sx={{ mb: 1, color: 'secondary.main', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
        {sessionType}
      </Typography>

      {/* Ring Timer */}
      {/* LIMP Ciclo encima do botao de config */}
      
      <Box sx={{ position: 'relative', mb: 4 }}>
        <svg width={260} height={260} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={130} cy={130} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={12} />
          <circle
            cx={130} cy={130} r={R}
            fill="none"
            stroke={sessionType === SESSION_TYPES.WORK ? '#ef4444' : '#22c55e'}
            strokeWidth={12}
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', textAlign: 'center',
        }}>
          <Typography sx={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: -2, fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(timeLeft)}
          </Typography>
          {isRunning && (
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
              {sessionType === SESSION_TYPES.WORK ? 'Focando...' : 'Relaxe um pouco'}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Botões de Ajuste Rápido */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          onClick={() => addMinutes(5)}
          sx={{ borderRadius: 4, borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
        >
          +5 min
        </Button>
        <Button
          variant="outlined"
          onClick={() => addMinutes(10)}
          sx={{ borderRadius: 4, borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
        >
          +10 min
        </Button>
      </Stack>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Ciclo {currentCycle} / {totalCycles}
      </Typography>

      {/* Botão de Configuração — abaixo dos +5/+10 */}
      <IconButton
        onClick={() => setConfigOpen(true)}
        sx={{
          mb: 3,
          color: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 2,
          px: 3,
          gap: 1,
          fontSize: 13,
        }}
      >
        ⚙️
      </IconButton>

      {/* Controles Principais */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        {!isRunning ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleStart}
            sx={{ px: 6, py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: '1.1rem' }}
          >
            {isDone ? 'Reiniciar' : 'Iniciar'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handlePause}
            sx={{ px: 6, py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: '1.1rem', bgcolor: 'rgba(255,255,255,0.1)' }}
          >
            Pausar
          </Button>
        )}
        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{ px: 3, borderRadius: 3, borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
        >
          ↺
        </Button>
      </Stack>

      {/* Botão Ciclo Extra */}
      {isDone && (
        <Button
          variant="contained"
          color="success"
          onClick={addExtraCycle}
          sx={{ mb: 2, fontWeight: 700, borderRadius: 2 }}
        >
          + 1 Ciclo Extra
        </Button>
      )}

      {/* Modal de Configuração */}
      <Modal open={configOpen} onClose={() => setConfigOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%', maxWidth: 400,
          bgcolor: '#1a1a1a', borderRadius: 4, p: 4,
          boxShadow: 24, border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 800, textAlign: 'center' }}>Configurações</Typography>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom sx={{ fontWeight: 600 }}>Trabalho: {workTime} min</Typography>
            <Slider
              value={workTime}
              onChange={(_, v) => setWorkTime(v)}
              min={1} max={60}
              color="secondary"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom sx={{ fontWeight: 600 }}>Intervalo: {shortBreakTime} min</Typography>
            <Slider
              value={shortBreakTime}
              onChange={(_, v) => setShortBreakTime(v)}
              min={1} max={30}
              color="success"
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography gutterBottom sx={{ fontWeight: 600 }}>Total de Ciclos: {totalCycles}</Typography>
            <Slider
              value={totalCycles}
              onChange={(_, v) => setTotalCycles(v)}
              min={1} max={10}
              marks step={1}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={applyConfig}
            sx={{ py: 1.5, fontWeight: 800, borderRadius: 2 }}
          >
            Salvar e Reiniciar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}