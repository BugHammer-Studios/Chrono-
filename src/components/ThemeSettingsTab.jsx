import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  Button,
  Modal,
  Typography,
  Switch,
  FormControlLabel,
  Stack
} from '@mui/material';

export default function ThemeSettingsTab({
  CORES,
  themeIndex,
  onSelectTheme,
  notificationsEnabled,
  onToggleNotifications
}) {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <Stack spacing={3}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            p: 2,
            boxShadow: 2
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Aparência
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{ borderRadius: 2, py: 1.2 }}
          >
            Alterar tema
          </Button>
        </Box>

        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            p: 2,
            boxShadow: 2
          }}
        >
          <Typography variant="subtitle1">
            Notificações
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={notificationsEnabled}
                onChange={(e) => onToggleNotifications(e.target.checked)}
              />
            }
            label="Ativar notificações"
          />
        </Box>
      </Stack>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'background.paper',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Escolher tema
          </Typography>

          <Grid container spacing={2}>
            {CORES.map((cor, index) => (
              <Grid item xs={3} key={index}>
                <Card
                  component="button"
                  onClick={() => {
                    onSelectTheme(index);
                    setOpen(false);
                  }}
                  sx={{
                    width: '100%',
                    aspectRatio: '1',
                    bgcolor: cor.primary,
                    borderRadius: 2,
                    border:
                      themeIndex === index
                        ? '3px solid #fff'
                        : '2px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    p: 0,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
}