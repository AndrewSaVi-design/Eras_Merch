'use client';
import { useState } from 'react';
import { Instagram, Facebook, ArrowLeft, ShoppingBag, X, Trash2, Search } from 'lucide-react';

export default function HomeClient({ artistas, productos }) {
  const [vista, setVista] = useState('colecciones'); 
  const [artistaId, setArtistaId] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [tallaSeleccionada, setTallaSeleccionada] = useState({});

  const WHATSAPP_NUMBER = "51906618846"; 

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
    const item = { ...producto, tallaElegida: tallaSeleccionada[producto.id] || null };
    setCarrito([...carrito, item]);
    setNotificacion(producto.id);
    setTimeout(() => setNotificacion(null), 2000);
  };

  const enviarWhatsApp = () => {
    const lista = carrito.map(p => `• ${p.nombre} ${p.tallaElegida ? `(Talla: ${p.tallaElegida})` : ''} - S/ ${p.precio}`).join('%0A');
    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=¡Hola! Mi pedido:%0A%0A${lista}%0A%0A*Total: S/ ${total}*`, '_blank');
  };

  return (
    <main className="min-h-screen bg-white p-6 flex flex-col items-center text-black">
      {/* CABECERA */}
      <div className="w-full max-w-4xl flex flex-col items-center mb-8 relative">
        <div className="absolute right-0 top-0 cursor-pointer" onClick={() => setCarritoAbierto(true)}>
          <ShoppingBag size={24} />
          {carrito.length > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{carrito.length}</span>}
        </div>
        <img src="/erasmerch.jpeg" className="w-32 h-auto mb-4" />
        <h1 className="text-lg font-serif tracking-widest uppercase">ERAS MERCH</h1>
      </div>

      {/* VISTA COLECCIONES */}
      {vista === 'colecciones' && (
        <>
          <div className="w-full max-w-md mb-10 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input 
              type="text" placeholder="BUSCAR ARTISTA..." value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full border rounded-full py-2 px-10 text-[10px] focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
            {artistasFiltrados.map(art => (
              <div key={art.id} onClick={() => { setArtistaId(art.id); setVista('productos'); }} className="cursor-pointer group flex flex-col items-center">
                <img src={art.foto} className="aspect-square object-cover rounded-2xl mb-4 border group-hover:border-black transition-all" />
                <p className="text-[10px] font-bold uppercase tracking-widest">{art.nombre}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* VISTA PRODUCTOS */}
      {vista === 'productos' && artistaActual && (
        <div className="w-full max-w-5xl">
          <button onClick={() => setVista('colecciones')} className="flex items-center gap-2 text-[10px] font-bold mb-8 text-gray-400">
            <ArrowLeft size={14} /> VOLVER
          </button>
          <h2 className="text-2xl font-serif text-center mb-12 uppercase">{artistaActual.nombre}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {polosAMostrar.map(polo => (
              <div key={polo.id} className="flex flex-col items-center border p-4 rounded-3xl">
                <img src={polo.imagenes[0]} className="aspect-[3/4] object-cover rounded-xl mb-4 bg-gray-50" />
                <h3 className="text-[9px] font-bold uppercase text-center h-8 flex items-center">{polo.nombre}</h3>
                <p className="text-[10px] text-gray-500 mb-4">S/ {polo.precio}</p>
                
                {/* SELECTOR DE TALLAS */}
                {polo.tallas?.length > 0 && (
                  <div className="flex gap-1 mb-4">
                    {polo.tallas.map(t => (
                      <button key={t} onClick={() => setTallaSeleccionada({...tallaSeleccionada, [polo.id]: t})} className={`w-6 h-6 text-[8px] font-bold rounded-full border ${tallaSeleccionada[polo.id] === t ? 'bg-black text-white' : 'text-gray-400'}`}>{t}</button>
                    ))}
                  </div>
                )}

                <button onClick={() => agregarAlCarrito(polo)} className={`w-full py-2 text-[9px] font-bold uppercase rounded-lg border ${notificacion === polo.id ? 'bg-green-500 text-white' : 'border-black'}`}>
                  {notificacion === polo.id ? 'Añadido' : 'Añadir'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CARRITO (Sencillo para evitar errores) */}
      {carritoAbierto && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20" onClick={() => setCarritoAbierto(false)} />
          <div className="relative w-80 bg-white h-full p-6 shadow-xl flex flex-col">
            <h2 className="text-sm font-bold mb-6 uppercase">Tu Pedido</h2>
            <div className="flex-1 overflow-y-auto space-y-4">
              {carrito.map((item, i) => (
                <div key={i} className="text-[10px] border-b pb-2">
                  <p className="font-bold">{item.nombre} {item.tallaElegida && `(${item.tallaElegida})`}</p>
                  <p>S/ {item.precio}</p>
                </div>
              ))}
            </div>
            <button onClick={enviarWhatsApp} className="w-full bg-black text-white py-3 text-[10px] font-bold mt-4">PEDIR POR WHATSAPP</button>
          </div>
        </div>
      )}
    </main>
  );
}