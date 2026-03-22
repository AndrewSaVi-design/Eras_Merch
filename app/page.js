import Papa from 'papaparse';
import HomeClient from './HomeClient';

async function fetchCSV(url) {
  const res = await fetch(url, { cache: 'no-store' }); // Forzamos datos frescos
  const text = await res.text();
  return Papa.parse(text, { header: true }).data;
}

export default async function Page() {
  const LINK_ARTISTAS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=1184641699&single=true&output=csv";
  const LINK_PRODUCTOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=0&single=true&output=csv";
  const LINK_BANNERS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=1606536173&single=true&output=csv";
  const LINK_CONFIG = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=121884268&single=true&output=csv";

  // Esperamos obligatoriamente a las 4 hojas antes de continuar
  const [artistasRaw, productosRaw, bannersRaw, configRaw] = await Promise.all([
    fetchCSV(LINK_ARTISTAS),
    fetchCSV(LINK_PRODUCTOS),
    fetchCSV(LINK_BANNERS),
    fetchCSV(LINK_CONFIG)
  ]);

  const artistas = artistasRaw.filter(a => a.id?.trim());
  const banners = bannersRaw.filter(b => b.url?.trim()).map(b => b.url.trim());
  
  // Procesamos la hoja de fondos (Hoja 4) de forma segura
  const fondosMap = {};
  configRaw.forEach(c => {
    if (c.id?.trim() && c.fotoBackground?.trim()) {
      fondosMap[c.id.trim()] = c.fotoBackground.trim();
    }
  });

  const productos = productosRaw
    .filter(p => p.id?.trim())
    .map(item => ({
      id: item.id.trim(),
      artista: item.artista?.trim(),
      nombre: item.nombre?.trim(),
      precio: parseFloat(item.precio) || 0,
      tallas: item.tallas ? item.tallas.split(',').map(t => t.trim()) : [],
      imagenes: item.imagen2?.trim() ? [item.imagen1.trim(), item.imagen2.trim()] : [item.imagen1.trim()]
    }));

  return <HomeClient artistas={artistas} productos={productos} banners={banners} fondosMap={fondosMap} />;
}