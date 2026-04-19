import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import PetNPC from './PetNPC';

const products = [
  { id: 1, image: 'src/components/Assets/bururin.png'},
  { id: 2, image: 'src/components/Assets/bururin.png' },
  { id: 3, image: 'src/components/Assets/bururin.png' },
  { id: 4, image: 'src/components/Assets/bururin.png' },
  { id: 5, image: 'src/components/Assets/tabius.png' },
];

export default function TabThree() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('pets')) || [];
    setPets(saved);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* MAP SET */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotateX(60deg) rotateZ(45deg)',
          width: 700,
          height: 700,
        }}
      >
        {/* AZUL */}
        <Box
          sx={{
            position: 'absolute',
            width: '150%',
            height: '150%',
            bgcolor: '#5656a8',
            zIndex: -10,
            top: -100,
            left: -100,
          }}
        />
        {/* Marrom */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            bgcolor: '#6b3e26',
            top: 20,
            left: 20,
          }}
        />

        {/* VERDE */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            bgcolor: 'green',
          }}
        />
      </Box>

      {/*ARVERE*/}
      <Box
        component="img"
        src="src/components/Assets/Arvore.webp"
        alt="tree"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          
         transform: 'translate(-50%, -95%)', // NAO TIRA É PRA FICAR A PARTIR DA BASE
          width: 150,
          height: 400,

          zIndex: 200,
          pointerEvents: 'none',
        }}
      />

      {/* NPCs */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          height: 400,
          pointerEvents: 'none',
        }}
      >
        {pets.map((id) => {
          const pet = products.find((p) => p.id === id);
          if (!pet) return null;

          return <PetNPC key={id} image={pet.image} />;
        })}
      </Box>
    </Box>
  );
}