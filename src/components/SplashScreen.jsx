import { Box, Typography } from '@mui/material';
//PIMP PEDIR PRO LUIS FAZER SPLASH
export default function SplashScreen() {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'primary.main',
        color: 'white',
      }}
    >
      <Typography variant="h2" sx={{ letterSpacing: 4 }}>
        CHRONO
      </Typography>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Carregando o app...
      </Typography>
    </Box>
  );
}
