import { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
//PRECISO DE ICONE DE MOEDA PIMP 
//PIMP EFEITO CASCATA HIERARQUICO PRA VENDA A COMPRA DE UM NESCESSARIAMENTE EXIGE QUE O ID PREVIO TENHA SIDO COMPRADO: EXCEPTION ROOT OMAI GAAH



//URR EM LATIM FICA FEIO OS NOME ENT EU TRADUZI PRA GREGO PQ URR GREGO E FOFERSON TLGD  Paciência → Ὑπομονή (Hypomonē)
//Disciplina → Πειθαρχία (Peitharchía)
//Prudência → Φρόνησις (Phrónēsis)
//Autocontrole → Ἐγκράτεια (Enkráteia)
//Tribo → Φυλή (Phylē)
//O Tabius é o Tabius >:V
const products = [
    
  { id: 1, name: 'Hypom', price: '0', description: '"Reconhecer que tudo tem um ponto de partida é um começo "' }, //Ou sla o tempo é o melhor remedio type shit
  { id: 2, name: 'Peith', price: '3', description: '"Manter o Foco pode ser Dificil no inicio, mas com o tempo "' }, //BOTAR HIDE UNTIL self.id = highestIdBought + 1 >:V
  { id: 3, name: 'Enk', price: '5', description: 'A chave ' },
  { id: 4, name: 'Phró', price: '10', description: '' },
  { id: 5, name: 'Tabius', price: '15', description: 'Aumente seu cronômetro com temas especiais.' },
];

export default function StoreTab() {
  const [cartCount, setCartCount] = useState(0);

  const buyProduct = () => {
    setCartCount((count) => count + 1);
  };

  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Loja
      </Typography>
      <Typography sx={{ mb: 3 }}>Compre recursos fictícios para personalizar seu app.</Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  {product.price}
                </Typography>
                <Typography>{product.description}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="contained" onClick={buyProduct}>
                  Comprar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography sx={{ mt: 3 }}>Itens no carrinho: {cartCount}</Typography>
    </Box>
  );
}
