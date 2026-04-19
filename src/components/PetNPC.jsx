import { useEffect, useState } from 'react';
//import {theme} from '/ThemeSettingsTab.jsx';

const EMOTES = {
  HAPPY: ["😗","😊","😆","😃","😋"],
  MID: ["😑","🙁","😐"],
  SAD: ["😱","😩","😰","😭"]
};

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// DIR 
const DIRECTIONS = [
  { dx: 1, dy: 0 },   
  { dx: -1, dy: 0 }, 
  { dx: 0, dy: 1 },   
  { dx: 0, dy: -1 },  
  { dx: 1, dy: 1 },   
  { dx: -1, dy: 1 },  
  { dx: 1, dy: -1 },  
  { dx: -1, dy: -1 }, 
];
export default function PetNPC({ image, treeY, theme }) {
    
   console.log(theme);//DEbug
  const MAP_SIZE = 400; //PIMP USAR METODO MELHOR DEPOIS PRA NAO GERAR BUGS
  const [pos, setPos] = useState({
    x: Math.random() * (MAP_SIZE - 80),
    y: Math.random() * (MAP_SIZE - 80)
  });

  const [state, setState] = useState('idle');
  const [dir, setDir] = useState(random(DIRECTIONS));
  const [emote, setEmote] = useState(null);

  const TreeHealth = 70;

  function getEmote() {
    if (TreeHealth > 60) return random(EMOTES.HAPPY);
    if (TreeHealth > 30) return random(EMOTES.MID);
    return random(EMOTES.SAD);
  }

  //  FLUXIGRAMA
  useEffect(() => {
    const interval = setInterval(() => {
        
      if (state === 'idle') {
        setState(Math.random() < 0.5 ? 'walk' : 'emote');
      } 
      else if (state === 'walk') {
        setState(Math.random() < 0.5 ? 'idle' : 'emote');
      } 
      else if (state === 'emote') {
        setState('walk');
        setEmote(getEmote());
        setDir(random(DIRECTIONS));
        setTimeout(() => setEmote(null), 1500);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [state]);

  useEffect(() => {
    if (state !== 'walk') return;
    const speed = 2;
    const move = setInterval(() => {
      setPos((prev) => {
        let nextX = prev.x + dir.dx * speed;
        let nextY = prev.y + dir.dy * speed;
        if (nextX < 0 || nextX > MAP_SIZE - 80) {
          setDir((d) => ({ ...d, dx: -d.dx }));
          nextX = prev.x;
        }
        if (nextY < 0 || nextY > MAP_SIZE - 80) {
          setDir((d) => ({ ...d, dy: -d.dy }));
          nextY = prev.y;
        }
        return { x: nextX, y: nextY };
      });
    }, 50);
    return () => clearInterval(move);
  }, [state, dir]);

  return (
    <div
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: 80,
        height: 80,
        pointerEvents: 'none',
        zIndex: pos.y > treeY ? 1 : 10,
      }}
    >
      {/* EMOTE */}
      {emote && (
        <div
          style={{
            position: 'absolute',
            top: -25,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 20,
          }}
        >
          {emote}
        </div>
      )}

      {/* PETIMG */}
      <img
  src={image}
  alt="pet"
  style={{
    width: '100%',
    height: '100%',
    transform: dir.dx < 0 ? 'scaleX(-1)' : 'scaleX(1)',
    transition: 'transform 0.2s, filter 0.3s',

    // FILTRO TEMA
    filter: `
    hue-rotate(${theme.hue || 0}deg)
    saturate(1.5)
    brightness(1.1)
    `
  }}
/>
    </div>
  );
}