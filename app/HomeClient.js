'use client';
import { useState, useEffect } from 'react';
import { Instagram, Facebook, ArrowLeft, ShoppingBag, X, Trash2, Search, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

export default function HomeClient({ artistas, productos, banners }) {
  const [vista, setVista] = useState('colecciones'); 
  const [artistaId, setArtistaId] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [tallaSeleccionada, setTallaSeleccionada] = useState({});
  
  // ESTADO PARA EL CARRUSEL
  const [currentBanner, setCurrentBanner] = useState(0);

  const WHATSAPP_NUMBER = "51906618846"; 

  const links = {
    instagram: "https://www.instagram.com/eras_merch?igsh=aWY0OHJ3cWlqbmc%3D&utm_source=qr",
    facebook: "https://www.facebook.com/share/1AqEUYkZKL/?mibextid=wwXIfr",
    tiktok: "https://www.tiktok.com/@erasmerch?_r=1&_t=ZS-93TklyrCIhp"
  };

  // LÓGICA DE AUTODESLIZADO
  useEffect(() => {
    if (banners && banners.length > 0 && vista === 'colecciones') {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [banners, vista]);

  const artistasFiltrados = (artistas || []).filter(art => 
    art?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const artistaActual = artistas.find(art => art.id === artistaId);
  const polosAMostrar = productos.filter(p => p.artista === artistaId);

  const agregarAlCarrito = (producto) => {
    if (producto.tallas?.length > 0 && !tallaSeleccionada[producto.id]) {
      alert("Por favor, selecciona una talla primero.");
      return;
    }
    const item = { 
      ...producto, 
      tallaElegida: tallaSeleccionada[producto.id] || null, 
      tempId: Date.now() + Math.random() 
    };
    setCarrito([...carrito, item]);
    setNotificacion(producto.id);
    setTimeout(() => setNotificacion(null), 2000);
  };

  const enviarWhatsApp = () => {
    if (carrito.length === 0) {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=¡Hola! Tengo una consulta sobre los productos de Eras Merch.`, '_blank');
      return;
    }
    const lista = carrito.map(p => `• ${p.nombre} ${p.tallaElegida ? `(Talla: ${p.tallaElegida})` : ''} - S/ ${p.precio}`).join('%0A');
    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=¡Hola! Mi pedido:%0A%0A${lista}%0A%0A*Total: S/ ${total}*`, '_blank');
  };

  return (
    <main className="min-h-screen bg-white p-6 flex flex-col items-center text-black relative">
      
      {/* BOTÓN WHATSAPP FLOTANTE */}
      <button 
        onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
        className="fixed bottom-6 right-6 z-[90] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-90 flex items-center justify-center"
      >
        <MessageCircle size={28} fill="white" />
      </button>

      {/* CABECERA */}
      <div className="w-full max-w-4xl flex flex-col items-center mb-8 relative">
        <div className="absolute right-0 top-0 cursor-pointer p-2" onClick={() => setCarritoAbierto(true)}>
          <ShoppingBag size={24} />
          {carrito.length > 0 && (
            <span className="absolute top-0 right-0 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{carrito.length}</span>
          )}
        </div>
        <img src="/erasmerch.jpeg" className="w-32 h-auto mb-4" />
        <h1 className="text-xl font-serif tracking-[0.4em] mb-6 uppercase text-center">ERAS MERCH</h1>
        
        <div className="flex gap-6 text-gray-400 mb-4">
          <a href={links.instagram} target="_blank" className="hover:text-black transition-colors"><Instagram size={20} /></a>
          <a href={links.facebook} target="_blank" className="hover:text-black transition-colors"><Facebook size={20} /></a>
          <a href={links.tiktok} target="_blank" className="hover:text-black transition-colors">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.44-4.13-1.19-.29-.17-.57-.38-.82-.61-.01 2.45.01 4.89 0 7.34-.02 2.1-.53 4.25-1.95 5.82-1.41 1.6-3.6 2.39-5.67 2.39-2.07 0-4.25-.79-5.67-2.39-1.42-1.57-1.93-3.72-1.95-5.82-.02-2.1.49-4.25 1.91-5.82 1.4-1.6 3.58-2.39 5.65-2.39.26 0 .52.01.78.03v4.02c-.26-.02-.52-.03-.78-.03-1.4 0-2.87.54-3.83 1.57-.96 1.05-1.3 2.51-1.28 3.94.02 1.43.37 2.89 1.33 3.94.96 1.03 2.43 1.57 3.83 1.57s2.87-.54 3.83-1.57c.96-1.05 1.3-2.51 1.28-3.94V0z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* CARRUSEL DE BANNERS */}
      {vista === 'colecciones' && banners && banners.length > 0 && (
        <div className="w-full max-w-4xl mb-12 relative px-4 group">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-lg bg-gray-100 border border-gray-100">
            {banners.map((url, index) => (
              <img
                key={index}
                src={url}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <button onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft size={20} /></button>
            <button onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={20} /></button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentBanner ? 'bg-black w-4' : 'bg-black/20'}`} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VISTA COLECCIONES */}
      {vista === 'colecciones' && (
        <>
          <div className="w-full max-w-md mb-12 relative px-4 text-black">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input 
              type="text" placeholder="BUSCAR ARTISTA..." value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full border border-gray-100 bg-gray-50 rounded-full py-3 px-12 text-[10px] tracking-[0.2em] focus:outline-none focus:border-black transition-all"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl px-4">
            {artistasFiltrados.map(art => (
              <div key={art.id} onClick={() => { setArtistaId(art.id); setVista('productos'); }} className="cursor-pointer group flex flex-col items-center">
                <div className="aspect-square w-full rounded-2xl overflow-hidden border border-gray-100 group-hover:border-black transition-all shadow-sm">
                  <img src={art.foto} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-4 text-[11px] font-black tracking-[0.3em] uppercase">{art.nombre}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* VISTA PRODUCTOS */}
      {vista === 'productos' && artistaActual && (
        <div className="w-full max-w-6xl px-4">
          <button onClick={() => setVista('colecciones')} className="flex items-center gap-2 text-[10px] font-bold mb-10 text-gray-400 hover:text-black transition-colors uppercase tracking-widest">
            <ArrowLeft size={14} /> VOLVER A COLECCIONES
          </button>
          <h2 className="text-3xl font-serif text-center mb-16 uppercase tracking-[0.2em]">{artistaActual.nombre}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {polosAMostrar.map(polo => (
              <div key={polo.id} className="flex flex-col items-center border border-gray-50 p-4 rounded-[2rem] shadow-sm bg-white">
                <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden mb-4 bg-gray-50">
                  <img src={polo.imagenes[0]} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-[10px] font-bold uppercase text-center h-10 flex items-center px-2">{polo.nombre}</h3>
                <p className="text-[11px] text-gray-400 mb-4 font-serif italic font-bold">S/ {polo.precio}</p>
                {polo.tallas?.length > 0 && (
                  <div className="flex gap-2 mb-5">
                    {polo.tallas.map(t => (
                      <button key={t} onClick={() => setTallaSeleccionada({...tallaSeleccionada, [polo.id]: t})} className={`w-8 h-8 text-[9px] font-bold rounded-full border transition-all ${tallaSeleccionada[polo.id] === t ? 'bg-black text-white border-black' : 'text-gray-400 border-gray-100 hover:border-gray-300'}`}>{t}</button>
                    ))}
                  </div>
                )}
                <button onClick={() => agregarAlCarrito(polo)} className={`w-full py-3 text-[10px] font-bold uppercase rounded-xl border tracking-widest transition-all ${notificacion === polo.id ? 'bg-green-500 border-green-500 text-white' : 'border-black hover:bg-black hover:text-white'}`}>{notificacion === polo.id ? 'AÑADIDO' : 'AÑADIR'}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PANEL CARRITO */}
      {carritoAbierto && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setCarritoAbierto(false)} />
          <div className="relative w-full max-w-md bg-white h-full p-8 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center border-b pb-6 mb-6">
              <h2 className="text-sm font-black uppercase tracking-[0.3em]">Tu Bolsa</h2>
              <button onClick={() => setCarritoAbierto(false)} className="hover:rotate-90 transition-transform"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6">
              {carrito.length === 0 ? (
                <p className="text-[10px] uppercase text-center text-gray-300 tracking-widest mt-10">La bolsa está vacía</p>
              ) : (
                carrito.map((item) => (
                  <div key={item.tempId} className="flex gap-4 items-center border-b border-gray-50 pb-4">
                    <img src={item.imagenes[0]} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase">{item.nombre} {item.tallaElegida && `(${item.tallaElegida})`}</p>
                      <p className="text-[10px] text-gray-400 mt-1">S/ {item.precio}</p>
                    </div>
                    <button onClick={() => setCarrito(carrito.filter(c => c.tempId !== item.tempId))} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                  </div>
                ))
              )}
            </div>
            {carrito.length > 0 && (
              <div className="pt-6 border-t">
                <div className="flex justify-between mb-6">
                   <span className="text-[10px] font-bold uppercase tracking-widest">Total Estimado</span>
                   <span className="text-sm font-black">S/ {carrito.reduce((sum, item) => sum + item.precio, 0)}</span>
                </div>
                <button onClick={enviarWhatsApp} className="w-full bg-black text-white py-5 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-gray-900 transition-colors">PEDIR POR WHATSAPP</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}