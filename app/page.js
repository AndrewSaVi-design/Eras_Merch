import Papa from 'papaparse';
import HomeClient from './HomeClient';

async function getDatos() {
  const LINK_ARTISTAS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=1184641699&single=true&output=csv";
  const LINK_PRODUCTOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=0&single=true&output=csv";
  const LINK_BANNERS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=1606536173&single=true&output=csv";

  try {
    const [resArt, resProd, resBan] = await Promise.all([
      fetch(LINK_ARTISTAS, { cache: 'no-store' }),
      fetch(LINK_PRODUCTOS, { cache: 'no-store' }),
      fetch(LINK_BANNERS, { cache: 'no-store' })
    ]);

    const textArt = await resArt.text();
    const textProd = await resProd.text();
    const textBan = await resBan.text();

    const artistasRaw = Papa.parse(textArt, { header: true }).data.filter(a => a.id);
    const artistas = artistasRaw.map(a => ({
      id: a.id || '',
      nombre: a.nombre || 'Artista',
      foto: a.foto?.trim() || '',
      fotoBackground: a.fotoBackground?.trim() || ''
    }));

    const productosRaw = Papa.parse(textProd, { header: true }).data.filter(p => p.id);
    const banners = Papa.parse(textBan, { header: true }).data.filter(b => b.url).map(b => b.url);

    const productos = productosRaw.map(item => ({
      id: parseInt(item.id) || Math.random(),
      artista: item.artista || '',
      nombre: item.nombre || 'Producto',
      precio: parseFloat(item.precio) || 0,
      tallas: item.tallas ? item.tallas.split(',').map(t => t.trim()) : [],
      imagenes: item.imagen2?.trim() ? [item.imagen1.trim(), item.imagen2.trim()] : [item.imagen1.trim()]
    }));

    return { artistas, productos, banners };
  } catch (error) {
    console.error("Error cargando datos:", error);
    return { artistas: [], productos: [], banners: [] };
  }
}

export default async function Page() {
  const data = await getDatos();
  return <HomeClient {...data} />;
}