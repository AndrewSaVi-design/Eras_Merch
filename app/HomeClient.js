'use client';
import { useState, useEffect, useRef } from 'react';
import { Instagram, Facebook, ArrowLeft, ShoppingBag, X, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

// Icono de TikTok
const TikTokIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.44-4.13-1.19-.29-.17-.57-.38-.82-.61-.01 2.45.01 4.89 0 7.34-.02 2.1-.53 4.25-1.95 5.82-1.41 1.6-3.6 2.39-5.67 2.39-2.07 0-4.25-.79-5.67-2.39-1.42-1.57-1.93-3.72-1.95-5.82-.02-2.1.49-4.25 1.91-5.82 1.4-1.6 3.58-2.39 5.65-2.39.26 0 .52.01.78.03v4.02c-.26-.02-.52-.03-.78-.03-1.4 0-2.87.54-3.83 1.57-.96 1.05-1.3 2.51-1.28 3.94.02 1.43.37 2.89 1.33 3.94.96 1.03 2.43 1.57 3.83 1.57s2.87-.54 3.83-1.57c.96-1.05 1.3-2.51 1.28-3.94V0z"/>
  </svg>
);

export default function HomeClient({ artistas, productos, banners }) {
  const [vista, setVista] = useState('colecciones'); 
  const [artistaId, setArtistaId] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [tallaSeleccionada, setTallaSeleccionada] = useState({});
  const [currentBanner, setCurrentBanner] = useState(0);
  
  const artistasRef = useRef(null);
  const WHATSAPP_NUMBER = "51906618846"; 

  const links = {
    instagram: "https://www.instagram.com/eras_merch?igsh=aWY0OHJ3cWlqbmc%3D&utm_source=qr",
    facebook: "https://www.facebook.com/share/1AqEUYkZKL/?mibextid=wwXIfr",
    tiktok: "https://www.tiktok.com/@erasmerch?_r=1&_t=ZS-93TklyrCIhp"
  };

  // Autodeslizado de banners (Reducido a 7 segundos)
  useEffect(() => {
    if (banners?.length > 0 && vista === 'colecciones') {
      const timer = setInterval(() => setCurrentBanner(p => (p + 1) % banners.length), 7000);
      return () => clearInterval(timer);
    }
  }, [banners, vista]);

  // Filtrado de artistas y REDIRECCIÓN DIRECTA
  const artistasFiltrados = (artistas || []).filter(art => 
    art?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  useEffect(() => {
    const coincidenciaExacta = artistas.find(a => a.nombre.toLowerCase() === busqueda.toLowerCase().trim());
    if (coincidenciaExacta) {
      setArtistaId(coincidenciaExacta.id);
      setVista('productos');
      setBusqueda(''); 
    }
  }, [busqueda, artistas]);

  const artistaActual = artistas.find(art => art.id === artistaId);
  const polosAMostrar = productos.filter(p => p.artista === artistaId);

  const agregarAlCarrito = (p) => {
    if (p.tallas?.length > 0 && !tallaSeleccionada[p.id]) return alert("Selecciona una talla.");
    setCarrito([...carrito, { ...p, tallaElegida: tallaSeleccionada[p.id], tempId: Date.now() }]);
    setNotificacion(p.id);
    setTimeout(() => setNotificacion(null), 2000);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center text-black relative font-sans overflow-x-hidden">
      
      {/* WHATSAPP FLOTANTE */}
      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank"
        className="fixed bottom-6 right-6 z-[99] hover:scale-110 transition-transform shadow-2xl rounded-full"
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-14 h-14" alt="WhatsApp" />
      </a>

      {/* CABECERA (Logo de texto recuperado + TikTok) */}
      <div className="w-full max-w-4xl p-6 flex flex-col items-center relative">
        <div className="absolute right-6 top-8 cursor-pointer" onClick={() => setCarritoAbierto(true)}>
          <ShoppingBag size={26} />
          {carrito.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {carrito.length}
            </span>
          )}
        </div>
        <h1 className="text-[2.5rem] font-serif tracking-[0.4em] mb-1uppercase text-center text-black">ERAS MERCH</h1>
        <p className="text-[10px] font-bold tracking-[0.2em] mb-4 text-black uppercase">ERAS MERCH</p>
        
        <div className="flex gap-6 text-gray-400">
          <a href={links.instagram} target="_blank" className="hover:text-black"><Instagram size={20} /></a>
          <a href={links.facebook} target="_blank" className="hover:text-black"><Facebook size={20} /></a>
          {/* TikTok recuperado */}
          <a href={links.tiktok} target="_blank" className="hover:text-black"><TikTokIcon size={20} /></a>
        </div>
      </div>

      {vista === 'colecciones' && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-700">
          {/* PORTADA GRANDE */}
          {banners?.length > 0 && (
            <div className="w-full max-w-5xl px-4 mb-10 group">
              <div className="relative aspect-[16/10] md:aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] shadow-2xl">
                {banners.map((url, i) => (
                  <img key={i} src={url} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === currentBanner ? 'opacity-100' : 'opacity-0'}`} />
                ))}
                
                {/* Controles manuales para intercalar */}
                <button 
                  onClick={() => setCurrentBanner(p => (p - 1 + banners.length) % banners.length)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/50 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => setCurrentBanner(p => (p + 1) % banners.length)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/50 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={24} />
                </button>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {banners.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentBanner ? 'bg-white w-6' : 'bg-white/30 w-1.5'}`} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BUSCADOR */}
          <div className="w-full max-w-2xl px-6 flex flex-col md:flex-row gap-4 mb-12 text-black">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text" placeholder="BUSCAR ARTISTA..." value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-12 text-xs font-bold tracking-widest focus:ring-2 focus:ring-black transition-all text-black placeholder:text-gray-300"
              />
            </div>
            <button 
              onClick={() => artistasRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] hover:bg-gray-800 transition-colors"
            >
              VER ARTISTAS
            </button>
          </div>

          {/* GRILLA ARTISTAS */}
          <div ref={artistasRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl px-6 mb-20 text-black">
            {artistasFiltrados.map(art => (
              <div key={art.id} onClick={() => { setArtistaId(art.id); setVista('productos'); window.scrollTo(0,0); }} className="cursor-pointer group">
                <div className="aspect-square rounded-[2.5rem] overflow-hidden border-2 border-transparent group-hover:border-black transition-all duration-500 shadow-md">
                  <img src={art.foto} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <p className="mt-4 text-[10px] font-black tracking-widest uppercase text-center text-black">{art.nombre}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA PRODUCTOS */}
      {vista === 'productos' && artistaActual && (
        <div className="w-full min-h-screen relative flex flex-col items-center">
          {/* Fondo con Blur corregido */}
          <div 
            className="fixed inset-0 z-[-1] bg-cover bg-center transition-all duration-1000"
            style={{ 
              backgroundImage: `url(${artistaActual.fotoBackground})`,
              filter: 'blur(20px) brightness(0.5)'
            }}
          />
          
          <div className="w-full max-w-6xl p-6 mt-10">
            <button onClick={() => setVista('colecciones')} className="flex items-center gap-2 text-white/70 hover:text-white text-[10px] font-bold tracking-widest uppercase mb-10 transition-colors">
              <ArrowLeft size={16} /> VOLVER A COLECCIONES
            </button>
            <h2 className="text-4xl md:text-6xl font-black text-white text-center mb-20 uppercase tracking-tighter italic">
              {artistaActual.nombre}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {polosAMostrar.map(polo => (
                <div key={polo.id} className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-[2.5rem] flex flex-col items-center group shadow-2xl">
                  <div className="aspect-[3/4] w-full rounded-3xl overflow-hidden mb-4 relative">
                    <img src={polo.imagenes[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  {/* TEXTOS EN BLANCO PARA LEGIBILIDAD */}
                  <h3 className="text-white text-[10px] font-bold uppercase text-center h-8 flex items-center px-2">{polo.nombre}</h3>
                  <p className="text-white/80 text-xs font-black mb-4 tracking-widest">S/ {polo.precio}</p>
                  
                  <div className="flex gap-2 mb-4">
                    {polo.tallas.map(t => (
                      <button 
                        key={t} onClick={() => setTallaSeleccionada({...tallaSeleccionada, [polo.id]: t})}
                        className={`w-8 h-8 rounded-full text-[9px] font-black border transition-all ${tallaSeleccionada[polo.id] === t ? 'bg-white text-black border-white' : 'text-white border-white/30'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => agregarAlCarrito(polo)} className={`w-full py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all ${notificacion === polo.id ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}>
                    {notificacion === polo.id ? 'AÑADIDO' : 'AÑADIR'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PANEL CARRITO */}
      {carritoAbierto && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCarritoAbierto(false)} />
          <div className="relative w-full max-w-md bg-white h-full p-8 flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center border-b pb-6 mb-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-black">Tu Bolsa</h2>
              <button onClick={() => setCarritoAbierto(false)} className="hover:rotate-90 transition-transform text-black"><X /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4">
              {carrito.map((item, i) => (
                <div key={i} className="flex gap-4 items-center border-b border-gray-50 pb-4 text-black">
                  <img src={item.imagenes[0]} className="w-20 h-20 object-cover rounded-2xl shadow-sm" />
                  <div className="flex-1 text-black">
                    <p className="text-[10px] font-black uppercase text-black">{item.nombre} {item.tallaElegida && `(${item.tallaElegida})`}</p>
                    <p className="text-xs text-gray-400">S/ {item.precio}</p>
                  </div>
                  <button onClick={() => setCarrito(carrito.filter((_, idx) => idx !== i))} className="text-gray-200 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                </div>
              ))}
            </div>
            {carrito.length > 0 && (
              <div className="pt-6 text-black">
                <div className="flex justify-between text-xl font-black mb-6 uppercase italic text-black">
                  <span>Total</span>
                  <span>S/ {carrito.reduce((s, i) => s + i.precio, 0)}</span>
                </div>
                <button onClick={() => {
                  const lista = carrito.map(p => `• ${p.nombre} (${p.tallaElegida || 'N/A'}) - S/ ${p.precio}`).join('%0A');
                  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=¡Hola! Mi pedido:%0A%0A${lista}%0A%0A*Total: S/ ${carrito.reduce((s, i) => s + i.precio, 0)}*`, '_blank');
                }} className="w-full bg-black text-white py-6 rounded-2xl font-black tracking-[0.3em] text-xs hover:bg-gray-800 transition-all">
                  PEDIR POR WHATSAPP
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}