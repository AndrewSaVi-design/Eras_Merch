import Papa from 'papaparse';
import HomeClient from './HomeClient';

async function getDatos() {
  // URLs de tus hojas de Google Sheets
  const LINK_ARTISTAS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=1184641699&single=true&output=csv";
  const LINK_PRODUCTOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=0&single=true&output=csv";

  // Descarga los datos con revalidación de 60 segundos
  const [resArt, resProd] = await Promise.all([
    fetch(LINK_ARTISTAS, { next: { revalidate: 60 } }),
    fetch(LINK_PRODUCTOS, { next: { revalidate: 60 } })
  ]);

  const textArt = await resArt.text();
  const textProd = await resProd.text();

  // Procesamos Artistas
  const artistasRaw = Papa.parse(textArt, { header: true }).data;
  const artistas = artistasRaw
    .filter(a => a.id && a.nombre) // Filtra filas vacías
    .map(item => ({
      id: item.id,
      nombre: item.nombre,
      foto: item.foto,
      fotoBackground: item.fotoBackground || null
    }));

  // Procesamos Productos
  const productosRaw = Papa.parse(textProd, { header: true }).data;
  const productos = productosRaw
    .filter(p => p.id && p.nombre) // Filtra filas vacías
    .map(item => ({
      id: parseInt(item.id),
      artista: item.artista,
      nombre: item.nombre,
      precio: parseFloat(item.precio) || 0,
      // Convertimos el texto "S,M,L" en una lista real
      tallas: item.tallas ? item.tallas.split(',').map(t => t.trim()) : [],
      imagenes: item.imagen2?.trim() 
        ? [item.imagen1?.trim(), item.imagen2?.trim()] 
        : [item.imagen1?.trim()]
    }));

  return { artistas, productos };
}

export default async function Page() {
  const { artistas, productos } = await getDatos();
  return <HomeClient artistas={artistas} productos={productos} />;
}