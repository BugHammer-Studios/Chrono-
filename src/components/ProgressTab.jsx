import { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const FOCUS_TOTAL_KEY = 'chrono_focus_total_ms';

//pLACEHOLDER FOR NOW
const MILESTONES = [
  { id: 1, icon: '🚀', label: 'Início',   minutes: 0,    desc: 'Você começou!' },
  { id: 2, icon: '🏠', label: 'Casa',     minutes: 15,   desc: '15 min de foco' },
  { id: 3, icon: '🔥', label: 'Chama',    minutes: 30,   desc: '30 min de foco' },
  { id: 4, icon: '📚', label: 'Livro',    minutes: 60,   desc: '1h de foco' },
  { id: 5, icon: '🏆', label: 'Troféu',   minutes: 120,  desc: '2h de foco' },
  { id: 6, icon: '💎', label: 'Cristal',  minutes: 300,  desc: '5h de foco' },
  { id: 7, icon: '👑', label: 'Coroa',    minutes: 600,  desc: '10h de foco' },
  { id: 8, icon: '⚡', label: 'Lenda',    minutes: 1200, desc: '20h de foco' },
];

// PLACEHOLDER FOR NOW  
const ZIGZAG = [0, 60, 0, -60, 0, 60, 0, -60];

function formatTotal(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function ProgressTab({ primaryColor = '#22c55e' }) {
  const [totalMs, setTotalMs] = useState(
    () => parseInt(localStorage.getItem(FOCUS_TOTAL_KEY) || '0', 10)
  );

  // LISTENER generico
  useEffect(() => {
    const handler = () =>
      setTotalMs(parseInt(localStorage.getItem(FOCUS_TOTAL_KEY) || '0', 10));
    window.addEventListener('focusTimeUpdated', handler);
    return () => window.removeEventListener('focusTimeUpdated', handler);
  }, []);

  const totalMin = totalMs / 60000;

  const milestones = MILESTONES.map((m, i) => ({
    ...m,
    unlocked: totalMin >= m.minutes,
    isCurrent:
      totalMin >= m.minutes &&
      (i === MILESTONES.length - 1 || totalMin < MILESTONES[i + 1].minutes),
  }));

  const nextMilestone = milestones.find((m) => !m.unlocked);
  const progressPct   = nextMilestone
    ? Math.min(100, (totalMin / nextMilestone.minutes) * 100)
    : 100;

  // RESERVE RENDER FOR ANIMATION 
  const reversed = [...milestones].reverse();

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', pb: 4 }}>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 800 }}>
        Progresso
      </Typography>

      {/* ── Stats card ─────────────────────────────────────────────────────── */}
      <Box sx={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 3, p: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        mb: 1.5,
      }}>
        <Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, mb: 0.5 }}>
            Tempo total de foco
          </Typography>
          <Typography sx={{ fontSize: 28, fontWeight: 900 }}>
            {formatTotal(totalMs)}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 38 }}>🧠</Typography>
      </Box>

      {/* ─ GET milesTONE //PIMP ONLY PLACEHOLDER BY NOW   ─────────────────────────────────────── */}
      {nextMilestone ? (
        <Box sx={{ background: 'rgba(255,255,255,0.04)', borderRadius: 2.5, p: 1.5, mb: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
              Próximo: {nextMilestone.icon} {nextMilestone.label}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
              {Math.floor(totalMin)}/{nextMilestone.minutes} min
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPct}
            sx={{
              height: 8, borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.08)',
              '& .MuiLinearProgress-bar': { bgcolor: primaryColor, borderRadius: 4 },
            }}
          />
        </Box>
      ) : (
        <Typography sx={{ color: primaryColor, fontWeight: 800, textAlign: 'center', mb: 2 }}>
          🎉 Todos os marcos desbloqueados!
        </Typography>
      )}

      {/* ── Milestone path //PIMP FIX FIRST ENCOUNTER -> GENERATE LERP BASED ANIMATION FROM SCROLL Y  ──────────────────── */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {reversed.map((m, idx) => {
          const origIdx      = MILESTONES.length - 1 - idx;
          const myOffset     = ZIGZAG[origIdx % ZIGZAG.length];
          const nextOrigIdx  = origIdx - 1;
          const nextOffset   = nextOrigIdx >= 0 ? ZIGZAG[nextOrigIdx % ZIGZAG.length] : 0;
          const connOffset   = (myOffset + nextOffset) / 2;
          const hasNext      = idx < reversed.length - 1;
          const nextUnlocked = hasNext && reversed[idx + 1].unlocked;

          return (
            <Box key={m.id} sx={{ width: '100%' }}>

              {/* Node */}
              <Box sx={{ ml: `calc(50% + ${myOffset}px - 36px)`, width: 72, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 72, height: 72,
                    borderRadius: '50%',
                    background: m.unlocked ? primaryColor : 'rgba(255,255,255,0.06)',
                    border: m.isCurrent
                      ? '4px solid white'
                      : m.unlocked
                        ? `3px solid ${primaryColor}88`
                        : '3px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28,
                    opacity: m.unlocked ? 1 : 0.45,
                    boxShadow: m.isCurrent ? `0 0 28px ${primaryColor}55` : 'none',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{ filter: m.unlocked ? 'none' : 'grayscale(1)' }}>
                    {m.icon}
                  </span>

                  {/* OVERLAY LOCK  */}
                  {!m.unlocked && (
                    <Box sx={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14,
                    }}>
                      🔒
                    </Box>
                  )}
                </Box>

                <Typography sx={{
                  fontSize: 11, fontWeight: 700, mt: 0.5,
                  color: m.unlocked ? 'white' : 'rgba(255,255,255,0.3)',
                }}>
                  {m.label}
                </Typography>
                <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', mb: 0.5 }}>
                  {m.minutes === 0
                    ? 'Início'
                    : m.minutes >= 60
                      ? `${m.minutes / 60}h`
                      : `${m.minutes}m`}
                </Typography>
              </Box>

              {/* CONNECTOR */}
              {hasNext && (
                <Box sx={{
                  ml: `calc(50% + ${connOffset}px - 2px)`,
                  width: 4, height: 44,
                  background: m.unlocked && nextUnlocked
                    ? primaryColor
                    : 'rgba(255,255,255,0.08)',
                  borderRadius: 2,
                  opacity: 0.75,
                }} />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}