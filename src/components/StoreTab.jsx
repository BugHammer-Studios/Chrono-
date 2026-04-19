import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';

//PRECISO DE ICONE DE MOEDA PIMP 
//PIMP EFEITO CASCATA HIERARQUICO PRA VENDA A COMPRA DE UM NESCESSARIAMENTE EXIGE QUE O ID PREVIO TENHA SIDO COMPRADO: EXCEPTION ROOT OMAI GAAH

//URR EM LATIM FICA FEIO OS NOME ENT EU TRADUZI PRA GREGO PQ URR GREGO E FOFERSON TLGD  
// Paciência → Ὑπομονή (Hypomonē)
//Disciplina → Πειθαρχία (Peitharchía)
//Prudência → Φρόνησις (Phrónēsis)
//Autocontrole → Ἐγκράτεια (Enkráteia)
//Tribo → Φυλή (Phylē)
//O Tabius é o Tabius >:V

const products = [
  { id: 1, name: 'Hypom', price: 0, image: '/pets/hypom.png', description: '".. "' },
  { id: 2, name: 'Peith', price: 3, image: '/pets/peith.png', description: '"... "' },
  { id: 3, name: 'Enk', price: 5, image: '/pets/enk.png', description: '.' },
  { id: 4, name: 'Phró', price: 10, image: '/pets/phro.png', description: '' },
  { id: 5, name: 'Tabius', price: 15, image: '/pets/tabius.png', description: '....' },
];

export default function StoreTab() {
  const [ownedPets, setOwnedPets] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('pets')) || [];
    setOwnedPets(saved);
  }, []);

  const highestBoughtId = ownedPets.length > 0 ? Math.max(...ownedPets) : 0;

  const buyProduct = (id) => {
    if (id === highestBoughtId + 1) {
      const updated = [...ownedPets, id];
      setOwnedPets(updated);
      localStorage.setItem('pets', JSON.stringify(updated));
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Loja de Bichinhos 🐾
      </Typography>

      <Grid container spacing={2}>
        {products
          .filter((p) => p.id <= highestBoughtId + 1)
          .map((product) => (
            <Grid item xs={12} sm={6} key={product.id}>
              <Card>
                <CardContent>
            
                  <Box
                    component="img"
                    src={product.image}
                    alt={product.name}
                    sx={{
                      width: '100%',
                      height: 140,
                      objectFit: 'contain',
                      mb: 1,
                    }}
                  />

                  <Typography variant="h6">{product.name}</Typography>
                  <Typography color="text.secondary">
                    💰 {product.price}
                  </Typography>
                  <Typography>{product.description}</Typography>
                </CardContent>

                <CardActions>
                  <Button
                    variant="contained"
                    onClick={() => buyProduct(product.id)}
                    disabled={product.id !== highestBoughtId + 1}
                  >
                    Comprar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}