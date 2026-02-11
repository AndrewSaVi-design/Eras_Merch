'use client';
import { useState } from 'react';
import { Instagram, Facebook, MessageCircleMore, Music2, ArrowLeft } from 'lucide-react';

export default function Home() {
  const [vista, setVista] = useState('colecciones'); 
  const [artistaId, setArtistaId] = useState(null);

  // CONFIGURACIÓN DE TUS ENLACES (Pon los tuyos entre las comillas)
  const links = {
    instagram: "https://www.instagram.com/eras_merch?igsh=aWY0OHJ3cWlqbmc%3D&utm_source=qr",
    facebook: "https://www.facebook.com/share/1AqEUYkZKL/?mibextid=wwXIfr",
    tiktok: "https://www.tiktok.com/@erasmerch?_r=1&_t=ZS-93TklyrCIhp",
    whatsapp: "https://wa.me/message/VBDNL4S6LVXTP1"
  };

  const artistas = [
    { id: 'artista1', nombre: 'Dua Lipa', foto: '/foto_dua_lipa.png' },
    { id: 'artista2', nombre: 'Bad Bunny', foto: '/foto_bad_bunny.png' },
  ];

const productos = [
    { 
      id: 1, 
      artista: 'artista1', 
      nombre: 'Polo Dua Lipa', 
      precio: 'S/ 60', 
      imagenes: [
        '/polos/dua_lipa/polo1.png', 
        '/polos/dua_lipa/polo1_(atras).png'
      ] 
    },
    { 
      id: 2, 
      artista: 'artista1', 
      nombre: 'Polo Dua Lipa', 
      precio: 'S/ 60', 
      imagenes: [
        '/polos/dua_lipa/polo2_(adelante).png', 
        '/polos/dua_lipa/polo2_(atras).png'
      ] 
    },
    { 
      id: 3, 
      artista: 'artista1', 
      nombre: 'Polera Capucha Bad Bunny', 
      precio: 'S/ 85', 
      imagenes: [
        '/polos/dua_lipa/polera1_(adelante).png', 
        '/polos/dua_lipa/polera2(atras).png'
      ] 
    },

    { 
      id: 4, 
      artista: 'artista1', 
      nombre: 'Polera Capucha Dua Lipa', 
      precio: 'S/ 85', 
      imagenes: [
        '/polos/dua_lipa/polera_capucha2(adelante).png', 
        '/polos/dua_lipa/polera_capucha2(atras).png'
      ] 
    }
  ];

  const polosAMostrar = productos.filter(p => p.artista === artistaId);

  return (
    <main className="min-h-screen bg-white p-6 flex flex-col items-center">
      
      {/* --- BLOQUE SUPERIOR (Logo + Título + Redes) --- */}
      <div className="flex flex-col items-center mb-12">
        <img src="/erasmerch.jpeg" alt="Logo" className="w-40 h-auto mb-4" />
        <h1 className="text-xl font-serif tracking-[0.4em] mb-6 uppercase text-black">ERAS MERCH</h1>
        
        {/* REDES SOCIALES (Ahora aquí arriba, cerca al logo) */}
        <div className="flex gap-8 text-gray-400">
          <a href={links.instagram} target="_blank" className="hover:text-black transition-colors">
            <Instagram size={24} />
          </a>
          <a href={links.facebook} target="_blank" className="hover:text-black transition-colors">
            <Facebook size={24} />
          </a>
          <a href={links.tiktok} target="_blank" className="hover:text-black transition-colors">
            <Music2 size={24} />
          </a>
        </div>
      </div>

      {/* VISTA 1: COLECCIONES (CON SCROLL LATERAL) */}
      {vista === 'colecciones' && (
        <div className="w-full max-w-4xl animate-in fade-in duration-700">
          <p className="text-center text-[10px] uppercase tracking-widest text-gray-300 mb-8 italic">
            Selecciona una colección
          </p>
          
          {/* Contenedor con Scroll Lateral en móvil y Grid en PC */}
          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-4 snap-x snap-mandatory no-scrollbar">
            {artistas.map(art => (
              <div 
                key={art.id} 
                onClick={() => { setArtistaId(art.id); setVista('productos'); }}
                className="cursor-pointer group flex flex-col items-center min-w-[70%] md:min-w-0 snap-center"
              >
                <div className="aspect-square w-full rounded-xl overflow-hidden border border-gray-100 group-hover:border-black transition-all duration-500 shadow-sm">
                  <img 
                    src={art.foto} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                  />
                </div>
                <p className="mt-4 text-[11px] font-black tracking-widest uppercase text-black text-center">
                  {art.nombre}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 2: PRODUCTOS */}
      {vista === 'productos' && (
        <div className="w-full max-w-6xl animate-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={() => setVista('colecciones')}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-10 hover:opacity-50 transition-opacity"
          >
            <ArrowLeft size={14} /> Volver
          </button>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {polosAMostrar.map(polo => (
              <div key={polo.id} className="group flex flex-col items-center">
                <div className="aspect-[3/4] w-full bg-gray-50 rounded-xl overflow-hidden relative border border-gray-100">
                  <img src={polo.imagenes[0]} className="w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0" />
                  <img src={polo.imagenes[1]} className="absolute top-0 left-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                </div>
                <h3 className="mt-4 text-[10px] font-bold uppercase tracking-tighter text-center">{polo.nombre}</h3>
                <p className="text-gray-400 text-[10px] mt-1">{polo.precio}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WHATSAPP FLOTANTE (Icono Oficial) */}
      <a 
        href={links.whatsapp} 
        target="_blank"
        className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-50"
      >
        <MessageCircleMore size={32} fill="currentColor" />
      </a>

    </main>
  );
}