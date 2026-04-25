import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  Stack,
  IconButton,
} from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';

const PRESETS = [
  { label: '15m', minutes: 15 },
  { label: '20m', minutes: 20 },
  { label: '30m', minutes: 30 },
  { label: '50m', minutes: 50 },
  { label: '1h',  minutes: 60 },
];

const FOCUS_TOTAL_KEY = 'chrono_focus_total_ms';

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime(ms) {
  const h   = Math.floor(ms / 3600000);
  const m   = Math.floor((ms % 3600000) / 60000);
  const s   = Math.floor((ms % 60000) / 1000);
  const cs  = Math.floor((ms % 1000) / 10);
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)};`//.${pad(cs)}`;
}

export default function StopwatchTab() {
  const [presetIdx,    setPresetIdx]    = useState(2);          // 30m default
  const [totalMs,     setTotalMs]      = useState(30 * 60000);
  const [timeLeft,     setTimeLeft]    = useState(30 * 60000);
  const [isRunning,    setIsRunning]    = useState(false);
  const [done,       setDone]        = useState(false);
  const [customOpen,   setCustomOpen]   = useState(false);
  const [cH,          setCH]           = useState(0);
  const [cM,          setCM]         = useState(25);
  const [cS,           setCS]           = useState(0);

  // PIMP Part Save (pra nao salvar cada segundo )
  const savedMs     = useRef(0);
  const startedAt   = useRef(null);

  // ─── persist total focused time ───────────────────────────────────────────────
  const addFocusTime = (ms) => {
    if (ms <= 500) return;
    const prev = parseInt(localStorage.getItem(FOCUS_TOTAL_KEY) || '0', 10);
    localStorage.setItem(FOCUS_TOTAL_KEY, String(prev + ms));
    window.dispatchEvent(new Event('focusTimeUpdated'));
  };

  // ─── timer tick (não alterar)─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 10) {
          clearInterval(interval);
          const elapsed = Date.now() - startedAt.current;
          const toAdd   = Math.min(elapsed, totalMs - savedMs.current);
          addFocusTime(toAdd);
          savedMs.current = 0;
          startedAt.current = null;
          setIsRunning(false);
          setDone(true);
          return 0;
        }
        return prev - 10;
      });
    }, 10);
    return () => clearInterval(interval);
  }, [isRunning]);

  // ─── controls ────────────────────────────────────────────────────────────────
  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(totalMs);
      setDone(false);
      savedMs.current = 0;
    }
    startedAt.current = Date.now();
    setIsRunning(true);
  };

  const handlePause = () => {
    if (!isRunning) return;
    const elapsed = Date.now() - startedAt.current;
    const toAdd   = Math.min(elapsed, totalMs - savedMs.current);
    addFocusTime(toAdd);
    savedMs.current += toAdd;
    startedAt.current = null;
    setIsRunning(false);
  };

  const handleReset = () => {
    if (isRunning) {
      const elapsed = Date.now() - startedAt.current;
      const toAdd   = Math.min(elapsed, totalMs - savedMs.current);
      addFocusTime(toAdd);
    }
    startedAt.current = null;
    savedMs.current   = 0;
    setIsRunning(false);
    setDone(false);
    setTimeLeft(totalMs);
  };

  const applyPreset = (idx) => {
    if (isRunning) handlePause();
    savedMs.current = 0;
    const ms = PRESETS[idx].minutes * 60000;
    setPresetIdx(idx);
    setTotalMs(ms);
    setTimeLeft(ms);
    setDone(false);
  };

  const applyCustom = () => {
    const ms = (cH * 3600 + cM * 60 + cS) * 1000;
    if (ms <= 0) { setCustomOpen(false); return; }
    if (isRunning) handlePause();
    savedMs.current = 0;
    setPresetIdx(-1);
    setTotalMs(ms);
    setTimeLeft(ms);
    setDone(false);
    setCustomOpen(false);
  };

  // ─── derived ─────────────────────────────────────────────────────────────────
  const progress  = totalMs > 0 ? (totalMs - timeLeft) / totalMs : 0;
  const R         = 100;
  const C         = 2 * Math.PI * R; // colocar uma animação de Ampilheta dps??

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', overflowY: 'auto', pb: 2 }}>

      {/* ── Presets ─────────────────────────────────────────────────────────── */}
      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
        {PRESETS.map((pr, i) => (
          <Button
            key={i}
            size="small"
            onClick={() => applyPreset(i)}
            sx={{
              borderRadius: 20,
              px: 2,
              fontWeight: 700,
              background: presetIdx === i ? 'secondary.main' : 'rgba(255,255,255,0.08)',
              bgcolor: presetIdx === i ? 'secondary.main' : 'rgba(255,255,255,0.08)',
              color: 'white',
              '&:hover': { opacity: 0.85 },
            }}
          >
            {pr.label}
          </Button>
        ))}
        <Button
          size="small"
          onClick={() => setCustomOpen(true)}
          sx={{
            borderRadius: 20,
            px: 2,
            fontWeight: 700,
            border: presetIdx === -1 ? '2px solid' : '1px solid rgba(255,255,255,0.2)',
            borderColor: presetIdx === -1 ? 'secondary.main' : 'rgba(255,255,255,0.2)',
            color: 'white',
            bgcolor: presetIdx === -1 ? 'rgba(6,182,212,0.15)' : 'transparent',
          }}
        >
          ⚙ Custom
        </Button>
      </Stack>

      {/* ── Ring timer ──────────────────────────────────────────────────────── */}
      <Box sx={{ position: 'relative', mb: 3 }}>
        <svg width={240} height={240} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={120} cy={120} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={12} />
          <circle
            cx={120} cy={120} r={R}
            fill="none"
            stroke={done ? '#22c55e' : '#22c55e'}
            strokeWidth={12}
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
        </svg>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', textAlign: 'center',
        }}>
          <Typography sx={{ fontSize: '2.6rem', fontWeight: 800, letterSpacing: -2, fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(timeLeft)}
          </Typography>
          {done && (
            <Typography sx={{ color: '#22c55e', fontSize: 12, fontWeight: 700, mt: 0.5 }}>
              ✓ Sessão completa!
            </Typography>
          )}
          {isRunning && (
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, mt: 0.5 }}>
              Em foco…
            </Typography>
          )}
        </Box>
      </Box>

      {/* ── Buttons ─────────────────────────────────────────────────────────── */}
      <Stack direction="row" spacing={1.5}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleStart}
          disabled={isRunning || (timeLeft === 0 && done)}
          sx={{ px: 4, fontWeight: 800, fontSize: '1rem' }}
        >
          Iniciar
        </Button>
        <Button
          variant="outlined"
          onClick={handlePause}
          disabled={!isRunning}
          sx={{ fontWeight: 800, fontSize: '1rem', color: 'white', borderColor: 'rgba(255,255,255,0.25)' }}
        >
          Pausar
        </Button>
        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'white', borderColor: 'rgba(255,255,255,0.25)', minWidth: 48 }}
        >
          ↺
        </Button>
      </Stack>

      {/* ── Custom Time Modal ───────────────────────────────────────────────── */}
      <Modal open={customOpen} onClose={() => setCustomOpen(false)}>
        <Box sx={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          bgcolor: 'rgba(18,18,18,0.97)',
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          p: 3, backdropFilter: 'blur(20px)',
        }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Tempo Customizado</Typography>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
            {[
              { label: 'Hora',    value: cH, set: (v) => setCH(Math.min(23, Math.max(0, v))), max: 23 },
              { label: 'Minuto',  value: cM, set: (v) => setCM(Math.min(59, Math.max(0, v))), max: 59 },
              { label: 'Segundo', value: cS, set: (v) => setCS(Math.min(59, Math.max(0, v))), max: 59 },
            ].map(({ label, value, set, max }) => (
              <Box key={label} sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', mb: 0.5, fontWeight: 600 }}>
                  {label}
                </Typography>
                <input
                  type="number"
                  value={value}
                  min={0}
                  max={max}
                  onChange={(e) => set(parseInt(e.target.value, 10) || 0)}
                  style={{
                    width: 76, padding: '12px 0', textAlign: 'center',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: 13, color: 'white',
                    fontSize: 26, fontWeight: 800, fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
              </Box>
            ))}
          </Stack>

          <Stack direction="row" spacing={1.5}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setCustomOpen(false)}
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', fontWeight: 700 }}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={applyCustom}
              sx={{ fontWeight: 800 }}
            >
              Confirmar
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}