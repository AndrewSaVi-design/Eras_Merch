import Papa from 'papaparse';
import HomeClient from './HomeClient';

async function getDatos() {
  const LINK_ARTISTAS = "TU_URL_DE_ARTISTAS_CSV";
  const LINK_PRODUCTOS = "TU_URL_DE_PRODUCTOS_CSV";

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