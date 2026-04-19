import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export default function TabThree() {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          width: 140,
          height: 140,
          borderRadius: '50%',
          bgcolor: 'secondary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 6,
          mb: 3,
        }}
      >
        <StarIcon sx={{ fontSize: 56 }} />
      </Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Aba Especial
      </Typography>
      <Typography>Ícone em destaque, com estilo circular que transborda a barra de navegação.</Typography>
    </Box>
  );
}
