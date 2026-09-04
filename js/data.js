/* ============================================================
   ORALE K RICO — Datos por defecto + capa de almacenamiento
   Todo se guarda en localStorage para que el panel de admin
   pueda modificar cualquier parámetro sin tocar el código.
   ============================================================ */

const OKR_KEYS = {
  settings: 'okr_settings',
  promos: 'okr_promos',
  menu: 'okr_menu',
  gallery: 'okr_gallery',
  auth: 'okr_admin_auth'
};

const OKR_ADMIN_USER = 'admin';
const OKR_ADMIN_PASS = 'andres2026';

const OKR_DEFAULT_SETTINGS = {
  name: 'Órale K Rico',
  tagline: 'Sabor callejero, directo a tu mesa',
  heroText: 'Tacos, quesadillas y dorilokos hechos como en la calle de México. Arma tu pedido y te lo mandamos por WhatsApp en un momento.',
  aboutText: 'Órale K Rico nació con la idea de traer el verdadero sabor callejero mexicano a El Carmen de Viboral. Cada taco se prepara al momento, con tortilla recién hecha, cilantro y cebolla picados frescos, y las salsas de la casa que le dan ese toque que nos caracteriza. Nuestro ambiente está inspirado en el Día de Muertos: colores vivos, papel picado y mucha buena energía para que la pasen increíble.',
  whatsapp: '573045742645',
  phone: '+57 304 5742645',
  address: 'Cl. 41 #30-2, El Carmen de Viboral',
  hours: '4:00 p. m. - 11:00 p. m.',
  instagram: 'https://www.instagram.com/oralekricotaqueria/?hl=es',
  facebook: '',
  deliveryFee: 6000,
  logo: 'img/logo.png' // ruta o base64 — si está vacío se usa el logo SVG por defecto
};

const OKR_DEFAULT_PROMOS = [
  {
    id: 'p1',
    type: 'evento',
    badge: 'Evento especial',
    title: 'Ceviche al Barril',
    desc: 'Nuestro ceviche mexicano estilo barril, fresco y picante, para compartir en la mesa. Disponible por tiempo limitado.',
    img: 'img/tacos-camaron.jpg',
    active: true
  },
  {
    id: 'p2',
    type: 'promo',
    badge: 'Todos los martes',
    title: 'Taco Tuesday',
    desc: 'Cada martes, llevando 10 tacos o más, cada uno vale solo $5.000. El mejor día para venir en grupo.',
    img: 'img/tacos-detalle.jpg',
    active: true
  }
];

const OKR_DEFAULT_MENU = {
  tacos: [
    {id:'t1', name:'Taco de Birria', desc:'Carne de res marinada en variedades de chiles, cilantro y cebolla.', price:8000, img:'img/birria-tacos.jpg'},
    {id:'t2', name:'Taco de Suadero', desc:'Carne de res sudada con especias de la casa, cilantro y cebolla.', price:8000, img:'img/tacos-detalle.jpg'},
    {id:'t3', name:'Taco de Asada', desc:'Solomito marinado en ingredientes de la casa, cebolla y cilantro.', price:8000, img:'img/tacos-mesa.jpg'},
    {id:'t4', name:'Taco al Pastor', desc:'Tradicional carne de cerdo adobado con trozos de piña, cilantro y cebolla.', price:8000, img:'img/tacos-salsa.jpg'},
    {id:'t5', name:'Taco Cochinita Pibil', desc:'Carne de cerdo desmechada adobada en achiote y especias, con encurtido de cebolla morada.', price:8000, img:'img/tacos-camaron.jpg'},
    {id:'t6', name:'Taco de Pollo', desc:'Pollo desmechado en aderezo de la casa, cilantro y cebolla.', price:7000, img:'img/taco-lima.jpg'},
    {id:'t7', name:'Taco Orale', desc:'Trocitos de chicharrón, maicitos, cebolla y cilantro.', price:7000, img:'img/birria-tacos.jpg'},
    {id:'t8', name:'Taco Catrina', desc:'Delicioso chorizo ahumado, maicitos, cebolla y cilantro.', price:7000, img:'img/tacos-detalle.jpg'}
  ],
  quesadillas: [
    {id:'q1', name:'Quesadilla de Birria', desc:'Tortilla de harina con queso y carne de res marinada en variedades de chiles, cilantro y cebolla.', price:28000, img:'img/birria-tacos.jpg'},
    {id:'q2', name:'Quesadilla Gringa', desc:'Tortilla de harina con queso, carne al pastor, pollo, cebolla y cilantro.', price:25000, img:'img/tacos-mesa.jpg'},
    {id:'q3', name:'Quesadilla Mixta', desc:'Queso, cebolla, pimentón y cilantro. Elige 2 entre: Orale, Pollo, Catrina o Asada.', price:22000, img:'img/hero-tacos.jpg'},
    {id:'q4', name:'Quesadilla de Pollo', desc:'Tortilla de harina con queso, pollo, pimentón, cebolla y cilantro.', price:20000, img:'img/taco-lima.jpg'},
    {id:'q5', name:'Quesadilla de Chorizo', desc:'Tortilla de harina con queso, chorizo ahumado, pimentón, cebolla y cilantro.', price:18000, img:'img/tacos-salsa.jpg'},
    {id:'q6', name:'Quesadilla Hawaiana', desc:'Tortilla de harina con jamón, queso y piña.', price:18000, img:'img/pina-fruta.jpg'},
    {id:'q7', name:'Quesadilla Jamón y Queso', desc:'Tortilla de harina con queso y jamón.', price:15000, img:'img/tacos-detalle.jpg'},
    {id:'q8', name:'Quesadilla Cajeta', desc:'Tortilla de harina con queso y arequipe, dulce y derretida.', price:13000, img:'img/tacos-camaron.jpg'}
  ],
  dorilokos: [
    {id:'d1', name:'Dorilokos Orale, Catrina o Pollo', desc:'Doritos cargados con la proteína que elijas, salsas y toppings de la casa.', price:20000, img:'img/comida-mexicana.jpg'},
    {id:'d2', name:'Dorilokos Pastor, Birria, Cochinita, Asada o Sudadero', desc:'Doritos cargados con la proteína premium que elijas, salsas y toppings de la casa.', price:25000, img:'img/hero-tacos.jpg'}
  ],
  ezquite: [
    {id:'e1', name:'Ezquite Mexicano', desc:'Maicitos dulces con queso derretido, tajín y salsa ácida de la casa.', price:9000, img:'img/tacos-salsa.jpg'}
  ],
  adiciones: [
    {id:'a1', name:'Salsa de Birria', desc:'Adición de salsa de birria bien concentrada.', price:5000, img:'img/tacos-salsa.jpg'},
    {id:'a2', name:'Cebolla cochinita', desc:'Encurtido de cebolla morada estilo cochinita.', price:5000, img:'img/tacos-detalle.jpg'},
    {id:'a3', name:'Salsa de aguacate', desc:'Salsa cremosa de aguacate de la casa.', price:3000, img:'img/tacos-camaron.jpg'},
    {id:'a4', name:'Piña', desc:'Trozos de piña asada.', price:4000, img:'img/pina-fruta.jpg'},
    {id:'a5', name:'Queso', desc:'Extra de queso derretido.', price:4000, img:'img/birria-tacos.jpg'},
    {id:'a6', name:'Maicitos', desc:'Porción extra de maíz tierno.', price:4000, img:'img/comida-mexicana.jpg'},
    {id:'a7', name:'Jamón', desc:'Extra de jamón.', price:3500, img:'img/taco-lima.jpg'},
    {id:'a8', name:'Tortilla', desc:'Tortilla adicional.', price:2000, img:'img/tacos-mesa.jpg'}
  ]
};

const OKR_CAT_LABELS = {
  tacos: '\u{1F32E} Tacos',
  quesadillas: '\u{1F9C0} Quesadillas',
  dorilokos: '\u{1F336}\u{FE0F} Dorilokos',
  ezquite: '\u{1F33D} Ezquite',
  adiciones: '\u{1F9C2} Adiciones'
};

const OKR_CAT_EMOJI = {
  tacos: '\u{1F32E}',
  quesadillas: '\u{1F9C0}',
  dorilokos: '\u{1F336}\u{FE0F}',
  ezquite: '\u{1F33D}',
  adiciones: '\u{1F9C2}'
};

/* ---------- Storage helpers ---------- */
function okrGet(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    if(!raw) return fallback;
    return JSON.parse(raw);
  }catch(e){ return fallback; }
}
function okrSet(key, value){
  try{
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }catch(e){
    alert('No se pudo guardar: el almacenamiento del navegador está lleno. Intenta eliminar alguna foto de la galería o usar imágenes más livianas.');
    return false;
  }
}

function okrGetSettings(){ return Object.assign({}, OKR_DEFAULT_SETTINGS, okrGet(OKR_KEYS.settings, {})); }
function okrSetSettings(s){ return okrSet(OKR_KEYS.settings, s); }

function okrGetPromos(){ return okrGet(OKR_KEYS.promos, OKR_DEFAULT_PROMOS); }
function okrSetPromos(p){ return okrSet(OKR_KEYS.promos, p); }

function okrGetMenu(){
  const stored = okrGet(OKR_KEYS.menu, null);
  if(!stored) return JSON.parse(JSON.stringify(OKR_DEFAULT_MENU));
  return stored;
}
function okrSetMenu(m){ return okrSet(OKR_KEYS.menu, m); }

function okrCategoryEmojiForId(id){
  const menu = okrGetMenu();
  for(const cat in menu){
    if(menu[cat].some(it=>it.id===id)) return OKR_CAT_EMOJI[cat] || '\u{1F32E}';
  }
  return '\u{1F32E}';
}

function okrGetGallery(){ return okrGet(OKR_KEYS.gallery, []); }
function okrSetGallery(g){ return okrSet(OKR_KEYS.gallery, g); }

function okrIsAdminLoggedIn(){ return sessionStorage.getItem(OKR_KEYS.auth) === 'yes'; }
function okrAdminLogin(user, pass){
  if(user === OKR_ADMIN_USER && pass === OKR_ADMIN_PASS){
    sessionStorage.setItem(OKR_KEYS.auth, 'yes');
    return true;
  }
  return false;
}
function okrAdminLogout(){ sessionStorage.removeItem(OKR_KEYS.auth); }

/* Comprime y convierte una imagen (File) a base64 dataURL, para no
   llenar el localStorage con fotos pesadas de la cámara. */
function okrCompressImage(file, maxWidth){
  maxWidth = maxWidth || 1000;
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = (e)=>{
      const img = new Image();
      img.onload = ()=>{
        let w = img.width, h = img.height;
        if(w > maxWidth){
          h = Math.round(h * (maxWidth / w));
          w = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function okrFmt(n){ return '$' + Number(n).toLocaleString('es-CO'); }
function okrUid(prefix){ return (prefix||'id') + '_' + Math.random().toString(36).slice(2,9); }
