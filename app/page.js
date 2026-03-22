import Papa from 'papaparse';
import HomeClient from './HomeClient';

// Función para limpiar textos de espacios invisibles
const cleanText = (text) => text ? text.toString().trim() : '';

async function getDatos() {
  const LINK_ARTISTAS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=1184641699&single=true&output=csv";
  const LINK_PRODUCTOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=0&single=true&output=csv";
  const LINK_BANNERS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=1606536173&single=true&output=csv";
  const LINK_CONFIG = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?gid=121884268&single=true&output=csv";

  try {
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

    const artistasRaw = Papa.parse(textArt, { header: true }).data;
    const artistas = artistasRaw
      .filter(a => cleanText(a.id))
      .map(a => ({
        id: cleanText(a.id), // ID limpio
        nombre: cleanText(a.nombre),
        foto: cleanText(a.foto)
      }));

    const productosRaw = Papa.parse(textProd, { header: true }).data;
    const configRaw = Papa.parse(textConf, { header: true }).data;

    const banners = Papa.parse(textBan, { header: true }).data
      .filter(b => cleanText(b.url))
      .map(b => cleanText(b.url));
    
    // Mapa de fondos blindado
    const fondosMap = {};
    configRaw.forEach(c => {
      const idLimpio = cleanText(c.id);
      const fondoLimpio = cleanText(c.fotoBackground);
      if (idLimpio && fondoLimpio) {
        fondosMap[idLimpio] = fondoLimpio;
      }
    });

    const productos = productosRaw
      .filter(p => cleanText(p.id))
      .map(item => ({
        id: parseInt(item.id),
        artista: cleanText(item.artista), // ID de artista limpio
        nombre: cleanText(item.nombre),
        precio: parseFloat(item.precio) || 0,
        tallas: item.tallas ? item.tallas.split(',').map(t => t.trim()) : [],
        imagenes: item.imagen2?.trim() ? [item.imagen1.trim(), item.imagen2.trim()] : [item.imagen1.trim()]
      }));

    return { artistas, productos, banners, fondosMap };
  } catch (error) {
    console.error("Error cargando datos:", error);
    return { artistas: [], productos: [], banners: [], fondosMap: {} };
  }
}

export default async function Page() {
  const data = await getDatos();
  return <HomeClient {...data} />;
}