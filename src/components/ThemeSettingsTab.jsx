import { Box, Grid, Card } from '@mui/material';

export default function ThemeSettingsTab({ CORES, themeIndex, onSelectTheme }) {
  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <Grid container spacing={2}>
        {CORES.map((cor, index) => (
          <Grid item xs={4} sm={3} key={index}>
            <Card
              component="button"
              onClick={() => onSelectTheme(index)}
              sx={{
                width: '100%',
                height: 80,
                bgcolor: cor.primary,
                borderRadius: 2, border: themeIndex === index ? '4px solid rgba(255,255,255,0.9)' : '2px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
                minWidth: 0,
                p: 0,
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
