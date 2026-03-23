import Papa from 'papaparse';
import HomeClient from './HomeClient';

async function fetchCSV(url) {
  // Forzamos a Google a darnos la versión más nueva cada vez
  const res = await fetch(`${url}&cache_bust=${Date.now()}`, { cache: 'no-store' });
  const text = await res.text();
  return Papa.parse(text, { header: true }).data;
}

export default async function Page() {
  const LINK_ARTISTAS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=1184641699&single=true&output=csv";
  const LINK_PRODUCTOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=0&single=true&output=csv";
  const LINK_BANNERS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=1606536173&single=true&output=csv";
  const LINK_CONFIG = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=121884268&single=true&output=csv";

  try {
    const [artistasRaw, productosRaw, bannersRaw, configRaw] = await Promise.all([
      fetchCSV(LINK_ARTISTAS),
      fetchCSV(LINK_PRODUCTOS),
      fetchCSV(LINK_BANNERS),
      fetchCSV(LINK_CONFIG)
    ]);

    const artistas = artistasRaw.filter(a => a.id?.trim());
    const banners = bannersRaw.filter(b => b.url?.trim()).map(b => b.url.trim());
    
    // Mapeo ultra-limpio de fondos
    const fondosMap = {};
    configRaw.forEach(c => {
      const idKey = c.id?.toString().trim().toLowerCase();
      if (idKey && c.fotoBackground) {
        fondosMap[idKey] = c.fotoBackground.trim();
      }
    });

    const productos = productosRaw.map(item => ({
      id: item.id,
      artista: item.artista?.trim().toLowerCase(),
      nombre: item.nombre?.trim(),
      precio: item.precio,
      tallas: item.tallas ? item.tallas.split(',').map(t => t.trim()) : [],
      imagenes: item.imagen2?.trim() ? [item.imagen1.trim(), item.imagen2.trim()] : [item.imagen1.trim()]
    }));

    return <HomeClient artistas={artistas} productos={productos} banners={banners} fondosMap={fondosMap} />;
  } catch (e) {
    return <div className="p-20 text-center font-bold">Error de conexión con Google Sheets. Refresca la página.</div>;
  }
}