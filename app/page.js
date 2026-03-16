import Papa from 'papaparse';
import HomeClient from './HomeClient';

async function getDatos() {
  const LINK_ARTISTAS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=1184641699&single=true&output=csv";
  const LINK_PRODUCTOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=0&single=true&output=csv";

  const [resArt, resProd] = await Promise.all([
    fetch(LINK_ARTISTAS, { next: { revalidate: 60 } }),
    fetch(LINK_PRODUCTOS, { next: { revalidate: 60 } })
  ]);

  const textArt = await resArt.text();
  const textProd = await resProd.text();

  const artistas = Papa.parse(textArt, { header: true }).data.filter(a => a.id);
  const productosRaw = Papa.parse(textProd, { header: true }).data.filter(p => p.id);

  const productos = productosRaw.map(item => ({
    id: parseInt(item.id),
    artista: item.artista,
    nombre: item.nombre,
    precio: parseFloat(item.precio),
    // CONEXIÓN CLAVE: Aquí leemos la columna 'tallas' que acabas de corregir
    tallas: item.tallas ? item.tallas.split(',').map(t => t.trim()) : [],
    imagenes: item.imagen2?.trim() ? [item.imagen1.trim(), item.imagen2.trim()] : [item.imagen1.trim()]
  }));

  return { artistas, productos };
}

export default async function Page() {
  const { artistas, productos } = await getDatos();
  return <HomeClient artistas={artistas} productos={productos} />;
}