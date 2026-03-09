'use client';
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Instagram, Facebook, ArrowLeft, ShoppingBag, X, Trash2, Check, Search, RefreshCw } from 'lucide-react';

export default function Home() {
  const [vista, setVista] = useState('colecciones'); 
  const [artistaId, setArtistaId] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [poloVolteado, setPoloVolteado] = useState(null);

  // ESTADOS DINÁMICOS
  const [artistas, setArtistas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const links = {
    instagram: "https://www.instagram.com/eras_merch?igsh=aWY0OHJ3cWlqbmc%3D&utm_source=qr",
    facebook: "https://www.facebook.com/share/1AqEUYkZKL/?mibextid=wwXIfr",
    tiktok: "https://www.tiktok.com/@erasmerch?_r=1&_t=ZS-93TklyrCIhp",
    whatsapp: "https://wa.me/message/VBDNL4S6LVXTP1"
  };

  useEffect(() => {
    // 1. REEMPLAZA ESTOS DOS LINKS CON TUS LINKS CSV REALES
    const LINK_ARTISTAS = ""; 
    const LINK_PRODUCTOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRn4eg2QNYNlyJbafWuOq5WN1MXhc0YwKQgI9jn8sKxilxH1Vx8D6xj3wVG6-XdWgW6-i_zuItIcrCY/pub?output=csv";

    // Función para cargar artistas
    const cargarDatos = async () => {
      // Usamos cachebuster para evitar que el navegador guarde versiones viejas
      const cb = "&cb=" + new Date().getTime();

      Papa.parse(LINK_ARTISTAS + cb, {
        download: true,
        header: true,
        complete: (resArtistas) => {
          setArtistas(resArtistas.data.filter(a => a.id));

          // Una vez cargados artistas, cargamos productos
          Papa.parse(LINK_PRODUCTOS + cb, {
            download: true,
            header: true,
            complete: (resProductos) => {
              const transformados = resProductos.data
                .filter(item => item.id)
                .map(item => ({
                  id: parseInt(item.id),
                  artista: item.artista,
                  nombre: item.nombre,
                  precio: parseFloat(item.precio),
                  imagenes: item.imagen2 && item.imagen2.trim() !== "" 
                    ? [item.imagen1.trim(), item.imagen2.trim()] 
                    : [item.imagen1.trim()]
                }));
              setProductos(transformados);
              setCargando(false);
            }
          });
        }
      });
    };

    cargarDatos();
  }, []);

  const artistasFiltrados = artistas.filter(art => 
    art.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const polosAMostrar = productos.filter(p => p.artista === artistaId);

  const agregarAlCarrito = (e, producto) => {
    e.stopPropagation();
    setCarrito([...carrito, producto]);
    setNotificacion(producto.id);
    setTimeout(() => setNotificacion(null), 2000);
  };

  const eliminarDelCarrito = (indexAEliminar) => {
    setCarrito(carrito.filter((_, index) => index !== indexAEliminar));
  };

  const toggleVoltear = (id, tieneMultiplesImagenes) => {
    if (!tieneMultiplesImagenes) return;
    setPoloVolteado(poloVolteado === id ? null : id);
  };

  const total = carrito.reduce((sum, item) => sum + item.precio, 0);

  const enviarWhatsApp = () => {
    const mensaje = carrito.map(p => `- ${p.nombre} (S/ ${p.precio})`).join('\n');
    const url = `${links.whatsapp}?text=¡Hola! Me gustaría pedir:\n${mensaje}\n\nTotal: S/ ${total}`;
    window.open(url, '_blank');
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-[10px] uppercase tracking-[0.5em] animate-pulse text-black">Cargando Merch...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white p-6 flex flex-col items-center text-black">
      
      {/* --- CABECERA --- */}
      <div className="flex flex-col items-center mb-8 w-full max-w-4xl relative">
        <div className="absolute right-0 top-0">
          <div className="relative cursor-pointer p-2" onClick={() => setCarritoAbierto(true)}>
            <ShoppingBag size={24} className="text-black" />
            {carrito.length > 0 && (
              <span className="absolute top-0 right-0 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {carrito.length}
              </span>
            )}
          </div>
        </div>
        <img src="/erasmerch.jpeg" alt="Logo" className="w-40 h-auto mb-4" />
        <h1 className="text-xl font-serif tracking-[0.4em] mb-6 uppercase">ERAS MERCH</h1>
        
        <div className="flex gap-8 text-gray-400">
          <a href={links.instagram} target="_blank" className="hover:text-black transition-colors"><Instagram size={22} /></a>
          <a href={links.facebook} target="_blank" className="hover:text-black transition-colors"><Facebook size={22} /></a>
          <a href={links.tiktok} target="_blank" className="hover:text-black transition-colors">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.44-4.13-1.19-.29-.17-.57-.38-.82-.61-.01 2.45.01 4.89 0 7.34-.02 2.1-.53 4.25-1.95 5.82-1.41 1.6-3.6 2.39-5.67 2.39-2.07 0-4.25-.79-5.67-2.39-1.42-1.57-1.93-3.72-1.95-5.82-.02-2.1.49-4.25 1.91-5.82 1.4-1.6 3.58-2.39 5.65-2.39.26 0 .52.01.78.03v4.02c-.26-.02-.52-.03-.78-.03-1.4 0-2.87.54-3.83 1.57-.96 1.05-1.3 2.51-1.28 3.94.02 1.43.37 2.89 1.33 3.94.96 1.03 2.43 1.57 3.83 1.57s2.87-.54 3.83-1.57c.96-1.05 1.3-2.51 1.28-3.94V0z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* --- BUSCADOR --- */}
      {vista === 'colecciones' && (
        <div className="w-full max-w-md mb-12 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
          <input 
            type="text"
            placeholder="BUSCAR ARTISTA..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-full py-3 px-12 text-[10px] tracking-[0.2em] uppercase focus:outline-none focus:border-black"
          />
        </div>
      )}

      {/* --- PANEL DEL CARRITO --- */}
      {carritoAbierto && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCarritoAbierto(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="p-6 flex justify-between items-center border-b">
              <h2 className="text-sm font-black uppercase tracking-widest text-black">Tu Carrito</h2>
              <button onClick={() => setCarritoAbierto(false)}><X size={20} className="text-black" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {carrito.length === 0 ? (
                <p className="text-[10px] uppercase tracking-widest text-center text-gray-400">Tu bolsa está vacía</p>
              ) : (
                carrito.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <img src={item.imagenes[0]} className="w-16 h-16 object-cover rounded bg-gray-50" />
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase text-black">{item.nombre}</p>
                      <p className="text-[10px] mt-1 font-serif text-gray-500">S/ {item.precio}</p>
                    </div>
                    <button onClick={() => eliminarDelCarrito(index)} className="text-gray-300 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
            {carrito.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Total</span>
                  <span className="text-[11px] font-bold text-black font-serif">S/ {total}</span>
                </div>
                <button onClick={enviarWhatsApp} className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.3em]">
                  Confirmar por WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- VISTA: COLECCIONES --- */}
      {vista === 'colecciones' && (
        <div className="w-full max-w-4xl">
          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-8 pb-8 no-scrollbar">
            {artistasFiltrados.map(art => (
              <div key={art.id} onClick={() => { setArtistaId(art.id); setVista('productos'); }} className="cursor-pointer group flex flex-col items-center min-w-[80%] md:min-w-0">
                <div className="aspect-square w-full rounded-2xl overflow-hidden border border-gray-100 group-hover:border-black transition-all shadow-sm">
                  <img src={art.foto} className="w-full h-full object-cover md:grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <p className="mt-6 text-[11px] font-black tracking-[0.4em] uppercase">{art.nombre}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- VISTA: PRODUCTOS --- */}
      {vista === 'productos' && (
        <div className="w-full max-w-6xl">
          <button onClick={() => setVista('colecciones')} className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-12">
            <ArrowLeft size={14} /> Volver
          </button>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {polosAMostrar.map(polo => {
              const tieneMultiples = polo.imagenes.length > 1;
              return (
                <div key={polo.id} className="group flex flex-col items-center">
                  <div 
                    onClick={() => toggleVoltear(polo.id, tieneMultiples)}
                    className={`aspect-[3/4] w-full bg-gray-50 rounded-2xl overflow-hidden relative border border-gray-100 shadow-sm ${tieneMultiples ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <img 
                      src={polo.imagenes[0]} 
                      className={`w-full h-full object-cover transition-opacity duration-500 ${poloVolteado === polo.id ? 'opacity-0' : 'opacity-100'}`} 
                    />
                    {tieneMultiples && (
                      <>
                        <img 
                          src={polo.imagenes[1]} 
                          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${poloVolteado === polo.id ? 'opacity-100' : 'opacity-0'}`} 
                        />
                        <div className="absolute bottom-3 right-3 bg-white/60 backdrop-blur-sm p-1.5 rounded-full">
                          <RefreshCw size={12} className={`text-gray-500 transition-transform duration-500 ${poloVolteado === polo.id ? 'rotate-180' : 'rotate-0'}`} />
                        </div>
                      </>
                    )}
                  </div>
                  <h3 className="mt-5 text-[10px] font-bold uppercase tracking-tight text-center px-2">{polo.nombre}</h3>
                  <p className="text-gray-400 text-[10px] mt-1 mb-4 font-serif">S/ {polo.precio}</p>
                  <button 
                    onClick={(e) => agregarAlCarrito(e, polo)}
                    disabled={notificacion === polo.id}
                    className={`text-[9px] border w-full py-3 uppercase tracking-[0.2em] font-bold transition-all duration-500 rounded-lg ${
                      notificacion === polo.id ? 'bg-green-500 border-green-500 text-white' : 'border-black text-black hover:bg-black hover:text-white'
                    }`}
                  >
                    {notificacion === polo.id ? 'Añadido' : 'Añadir al carrito'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WHATSAPP FLOTANTE (Logo Oficial) */}
      <a 
        href={links.whatsapp} 
        target="_blank"
        className="fixed bottom-8 right-8 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all z-[90] flex items-center justify-center"
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

    </main>
  );
}

// Actualización final