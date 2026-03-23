import Papa from 'papaparse';
import HomeClient from './HomeClient';

async function fetchCSV(url) {
  const res = await fetch(`${url}&cache_bust=${Date.now()}`, { cache: 'no-store' });
  const text = await res.text();
  return Papa.parse(text, { header: false }).data; // Leemos por posición de columna
}

export default async function Page() {
  const LINK_ARTISTAS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=1184641699&single=true&output=csv";
  const LINK_PRODUCTOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=0&single=true&output=csv";
  const LINK_BANNERS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=1606536173&single=true&output=csv";
  const LINK_CONFIG = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=121884268&single=true&output=csv";

  try {
    const [artRaw, prodRaw, banRaw, confRaw] = await Promise.all([
      fetchCSV(LINK_ARTISTAS),
      fetchCSV(LINK_PRODUCTOS),
      fetchCSV(LINK_BANNERS),
      fetchCSV(LINK_CONFIG)
    ]);

    const artistas = artRaw.slice(1).filter(r => r[0]).map(r => ({
      id: r[0].trim().toLowerCase(),
      nombre: r[1],
      foto: r[2]
    }));

    const fondosMap = {};
    confRaw.slice(1).forEach(r => {
      if (r[0] && r[1]) fondosMap[r[0].trim().toLowerCase()] = r[1].trim();
    });

    const banners = banRaw.slice(1).filter(r => r[0]).map(r => r[0].trim());

    const productos = prodRaw.slice(1).filter(r => r[0]).map(r => ({
      id: r[0],
      artista: r[1]?.trim().toLowerCase(),
      nombre: r[2],
      // CORRECCIÓN AQUÍ: r[3] es Tallas y r[4] es Precio
      tallas: r[3] ? r[3].split(',').map(t => t.trim()) : [],
      precio: parseFloat(r[4]) || 0,
      imagenes: r[6]?.trim() ? [r[5].trim(), r[6].trim()] : [r[5].trim()]
    }));

    return <HomeClient artistas={artistas} productos={productos} banners={banners} fondosMap={fondosMap} />;
  } catch (e) {
    return <div className="p-20 text-center font-bold">Cargando Eras Merch...</div>;
  }
}