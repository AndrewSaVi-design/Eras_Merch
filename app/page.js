import Papa from 'papaparse';
import HomeClient from './HomeClient';

async function getDatos() {
  const LINK_ARTISTAS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=1184641699&single=true&output=csv";
  const LINK_PRODUCTOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=0&single=true&output=csv";
  const LINK_BANNERS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=1606536173&single=true&output=csv";
  // NUEVA HOJA DE CONFIGURACIÓN
  const LINK_CONFIG = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=121884268&single=true&output=csv";

  const [resArt, resProd, resBan, resConf] = await Promise.all([
    fetch(LINK_ARTISTAS, { cache: 'no-store' }),
    fetch(LINK_PRODUCTOS, { cache: 'no-store' }),
    fetch(LINK_BANNERS, { cache: 'no-store' }),
    fetch(LINK_CONFIG, { cache: 'no-store' })
  ]);

  const textArt = await resArt.text();
  const textProd = await resProd.text();
  const textBan = await resBan.text();
  const textConf = await resConf.text();

  const artistas = Papa.parse(textArt, { header: true }).data.filter(a => a.id);
  const productosRaw = Papa.parse(textProd, { header: true }).data.filter(p => p.id);
  const banners = Papa.parse(textBan, { header: true }).data.filter(b => b.url).map(b => b.url);
  
  // Procesamos la nueva hoja de fondos
  const configRaw = Papa.parse(textConf, { header: true }).data.filter(c => c.id);
  const fondosMap = {};
  configRaw.forEach(c => {
    if (c.id && c.fotoBackground) {
      fondosMap[c.id.trim()] = c.fotoBackground.trim();
    }
  });

  const productos = productosRaw.map(item => ({
    id: parseInt(item.id),
    artista: item.artista,
    nombre: item.nombre,
    precio: parseFloat(item.precio),
    tallas: item.tallas ? item.tallas.split(',').map(t => t.trim()) : [],
    imagenes: item.imagen2?.trim() ? [item.imagen1.trim(), item.imagen2.trim()] : [item.imagen1.trim()]
  }));

  return { artistas, productos, banners, fondosMap };
}

export default async function Page() {
  const data = await getDatos();
  return <HomeClient {...data} />;
}