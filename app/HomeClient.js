'use client';
import { useState } from 'react';
import { Instagram, Facebook, ArrowLeft, ShoppingBag, X, Trash2, Search, RefreshCw } from 'lucide-react';

export default function HomeClient({ artistas, productos }) {
  const [vista, setVista] = useState('colecciones'); 
  const [artistaId, setArtistaId] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [poloVolteado, setPoloVolteado] = useState(null);

  const links = {
    instagram: "https://www.instagram.com/eras_merch?igsh=aWY0OHJ3cWlqbmc%3D&utm_source=qr",
    facebook: "https://www.facebook.com/share/1AqEUYkZKL/?mibextid=wwXIfr",
    whatsapp: "https://wa.me/message/VBDNL4S6LVXTP1"
  };

  const artistasFiltrados = (artistas || []).filter(art => 
    art?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
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

  return (
    <main className="min-h-screen bg-white p-6 flex flex-col items-center text-black">
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
        </div>
      </div>

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
                    <img src={polo.imagenes[0]} className={`w-full h-full object-cover transition-opacity duration-500 ${poloVolteado === polo.id ? 'opacity-0' : 'opacity-100'}`} />
                    {tieneMultiples && (
                      <>
                        <img src={polo.imagenes[1]} className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${poloVolteado === polo.id ? 'opacity-100' : 'opacity-0'}`} />
                        <div className="absolute bottom-3 right-3 bg-white/60 backdrop-blur-sm p-1.5 rounded-full">
                          <RefreshCw size={12} className={`text-gray-500 transition-transform duration-500 ${poloVolteado === polo.id ? 'rotate-180' : 'rotate-0'}`} />
                        </div>
                      </>
                    )}
                  </div>
                  <h3 className="mt-5 text-[10px] font-bold uppercase tracking-tight text-center px-2">{polo.nombre}</h3>
                  <p className="text-gray-400 text-[10px] mt-1 mb-4 font-serif">S/ {polo.precio}</p>
                  <button onClick={(e) => agregarAlCarrito(e, polo)} disabled={notificacion === polo.id} className={`text-[9px] border w-full py-3 uppercase tracking-[0.2em] font-bold transition-all duration-500 rounded-lg ${notificacion === polo.id ? 'bg-green-500 border-green-500 text-white' : 'border-black text-black hover:bg-black hover:text-white'}`}>
                    {notificacion === polo.id ? 'Añadido' : 'Añadir al carrito'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}