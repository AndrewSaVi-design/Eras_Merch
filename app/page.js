import Papa from 'papaparse';
import HomeClient from './HomeClient';

async function fetchCSV(url) {
  const res = await fetch(`${url}&cache_bust=${Date.now()}`, { cache: 'no-store' });
  const text = await res.text();
  // Leemos sin encabezados para evitar errores de nombres
  return Papa.parse(text, { header: false }).data;
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

    // Mapeo Artistas (Col 0: ID, Col 1: Nombre, Col 2: Foto)
    const artistas = artRaw.slice(1).filter(r => r[0]).map(r => ({
      id: r[0].trim().toLowerCase(),
      nombre: r[1],
      foto: r[2]
    }));

    // Mapeo Fondos (Col 0: ID, Col 1: URL)
    const fondosMap = {};
    confRaw.slice(1).forEach(r => {
      if (r[0] && r[1]) fondosMap[r[0].trim().toLowerCase()] = r[1].trim();
    });

    const banners = banRaw.slice(1).filter(r => r[0]).map(r => r[0].trim());

    const productos = prodRaw.slice(1).filter(r => r[0]).map(r => ({
      id: r[0],
      artista: r[1]?.trim().toLowerCase(),
      nombre: r[2],
      precio: r[3],
      tallas: r[4] ? r[4].split(',').map(t => t.trim()) : [],
      imagenes: r[6]?.trim() ? [r[5].trim(), r[6].trim()] : [r[5].trim()]
    }));

    return <HomeClient artistas={artistas} productos={productos} banners={banners} fondosMap={fondosMap} />;
  } catch (e) {
    return <div className="p-20 text-center">Cargando tienda...</div>;
  }
}