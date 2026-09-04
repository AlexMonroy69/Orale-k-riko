/* ============================================================
   ORALE K RICO — Lógica compartida entre todas las páginas
   ============================================================ */

const OKR_DEFAULT_LOGO_SVG = `
<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="31" fill="#fbead6"/>
  <path d="M32 8c-11 0-19 8-19 18 0 7 3 11 6 14 1 4 2 8 2 8h22s1-4 2-8c3-3 6-7 6-14 0-10-8-18-19-18z" fill="#fbead6" stroke="#150a12" stroke-width="2"/>
  <ellipse cx="23" cy="27" rx="5" ry="6" fill="#ef2d84"/>
  <ellipse cx="41" cy="27" rx="5" ry="6" fill="#18c6b8"/>
  <path d="M32 30l-3 8h6l-3-8z" fill="#150a12"/>
  <path d="M20 43c3 3 6 3 12 3s9 0 12-3" stroke="#150a12" stroke-width="2" stroke-linecap="round"/>
  <path d="M24 40l3 4M40 40l-3 4M28 40l1 4M36 40l-1 4" stroke="#8b3fa8" stroke-width="1.6" stroke-linecap="round"/>
</svg>`;

const OKR_PAGES = [
  {href:'index.html', label:'Inicio'},
  {href:'restaurante.html', label:'Restaurante'},
  {href:'menu.html', label:'Menú'},
  {href:'galeria.html', label:'Galería'},
  {href:'contacto.html', label:'Contacto'}
];

/* ---------- Modal de confirmación con la estética de la marca ---------- */
function okrConfirm(message, opts){
  opts = opts || {};
  const danger = !!opts.danger;
  return new Promise(resolve=>{
    const overlay = document.createElement('div');
    overlay.className = 'okr-modal-overlay';
    overlay.innerHTML = `
      <div class="okr-modal" role="alertdialog" aria-modal="true">
        <div class="okr-modal-icon${danger ? ' danger' : ''}">
          ${danger
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16h.01"/></svg>'}
        </div>
        <h3>${opts.title || (danger ? '¿Eliminar?' : '¿Confirmar acción?')}</h3>
        <p>${message}</p>
        <div class="okr-modal-actions">
          <button type="button" class="okr-modal-cancel">${opts.cancelText || 'Cancelar'}</button>
          <button type="button" class="okr-modal-confirm${danger ? ' danger' : ''}">${opts.confirmText || (danger ? 'Eliminar' : 'Confirmar')}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(()=> overlay.classList.add('show'));

    function close(result){
      overlay.classList.remove('show');
      document.removeEventListener('keydown', onKey);
      setTimeout(()=> overlay.remove(), 200);
      resolve(result);
    }
    function onKey(e){ if(e.key==='Escape') close(false); }
    overlay.querySelector('.okr-modal-cancel').addEventListener('click', ()=> close(false));
    overlay.querySelector('.okr-modal-confirm').addEventListener('click', ()=> close(true));
    overlay.addEventListener('click', (e)=>{ if(e.target===overlay) close(false); });
    document.addEventListener('keydown', onKey);
  });
}

function okrRenderHeader(activeHref){
  const s = okrGetSettings();
  const logo = s.logo
    ? `<img class="logo-mark" src="${s.logo}" alt="${s.name}">`
    : `${OKR_DEFAULT_LOGO_SVG}<span class="logo-text">${s.name.split(' ')[0]} <span>${s.name.split(' ').slice(1).join(' ')}</span></span>`;

  const links = OKR_PAGES.map(p => `<a href="${p.href}" class="${p.href===activeHref?'active':''}">${p.label}</a>`).join('');

  const el = document.getElementById('site-header');
  if(!el) return;
  el.innerHTML = `
  <div class="picado"></div>
  <header class="site-header">
    <div class="nav">
      <a href="index.html" class="logo">
        ${logo}
      </a>
      <ul class="nav-links" id="navLinks">${links}</ul>
      <div class="nav-right">
        <button class="cart-btn" id="openCartBtn" aria-label="Abrir carrito">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span class="cart-count hidden" id="cartCount">0</span>
        </button>
        <button class="menu-toggle" id="menuToggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="navLinks">
          <svg class="icon-burger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
    </div>
  </header>
  <div class="nav-backdrop" id="navBackdrop"></div>`;

  okrInitMobileNav();
}

function okrInitMobileNav(){
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  const backdrop = document.getElementById('navBackdrop');
  if(!toggle || !links) return;

  function closeMenu(){
    toggle.classList.remove('open');
    links.classList.remove('open');
    if(backdrop) backdrop.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
  }
  function openMenu(){
    toggle.classList.add('open');
    links.classList.add('open');
    if(backdrop) backdrop.classList.add('show');
    toggle.setAttribute('aria-expanded', 'true');
  }
  toggle.addEventListener('click', (e)=>{
    e.stopPropagation();
    if(links.classList.contains('open')) closeMenu(); else openMenu();
  });
  links.querySelectorAll('a').forEach(a=> a.addEventListener('click', closeMenu));
  if(backdrop) backdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeMenu(); });
  window.addEventListener('resize', ()=>{ if(window.innerWidth > 760) closeMenu(); });
}

const OKR_ICON_PIN = `<svg class="ic-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg>`;
const OKR_ICON_CLOCK = `<svg class="ic-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`;
const OKR_ICON_PHONE = `<svg class="ic-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5c0-1.1.9-2 2-2h2l2 5-2 2c1 3 3 5 6 6l2-2 5 2v2c0 1.1-.9 2-2 2C10 20 4 14 4 5z"/></svg>`;
const OKR_ICON_INSTAGRAM = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>`;
const OKR_ICON_FACEBOOK = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-9h3l.5-4H13V6.5c0-1.2.3-2 2-2h1.6V1.1C16.3 1 15 1 13.5 1 10.6 1 9 2.7 9 5.9V9H6v4h3v9h4z"/></svg>`;
const OKR_ICON_WHATSAPP = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5C10 9 9.5 7.8 9.3 7.3c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.4 5.1L2 22l5-1.3c1.4.8 3.1 1.2 5 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.2-.4-4.5-1.3l-.3-.2-3 .8.8-2.9-.2-.3C4 15 3.5 13.5 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z"/></svg>`;
const OKR_ICON_SKULL_SM = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-4 0-7 3-7 7 0 2.5 1 4 2 5l.5 3h9l.5-3c1-1 2-2.5 2-5 0-4-3-7-7-7z"/><circle cx="9" cy="10" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="1.2" fill="currentColor" stroke="none"/><path d="M12 11.2 10.8 14h2.4z" fill="currentColor" stroke="none"/></svg>`;

function okrRenderFooter(){
  const s = okrGetSettings();
  const el = document.getElementById('site-footer');
  if(!el) return;

  let social = '';
  if(s.instagram) social += `<a href="${s.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${OKR_ICON_INSTAGRAM}</a>`;
  if(s.facebook) social += `<a href="${s.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${OKR_ICON_FACEBOOK}</a>`;
  social += `<a href="https://wa.me/${s.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${OKR_ICON_WHATSAPP}</a>`;

  el.innerHTML = `
  <footer class="site-footer">
    <div class="foot-brand">${OKR_ICON_SKULL_SM}<h3>${s.name}</h3></div>
    <div class="foot-info">
      <div class="foot-info-row">${OKR_ICON_PIN}<span>${s.address}</span></div>
      <div class="foot-info-row">${OKR_ICON_CLOCK}<span>${s.hours}</span></div>
      <div class="foot-info-row">${OKR_ICON_PHONE}<span>Pedidos por WhatsApp: ${s.phone}</span></div>
    </div>
    <div class="foot-badges">
      <span>Domicilios</span><span>Para recoger</span><span>Ambiente Día de Muertos</span>
    </div>
    <div class="social-row">${social}</div>
    <div class="foot-links">
      <a href="index.html">Inicio</a>
      <a href="restaurante.html">Restaurante</a>
      <a href="menu.html">Menú</a>
      <a href="galeria.html">Galería</a>
      <a href="contacto.html">Contacto</a>
      <a href="admin.html">Admin</a>
    </div>
  </footer>
  <a class="wa-float" href="https://wa.me/${s.whatsapp}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">${OKR_ICON_WHATSAPP}</a>`;
}

/* ---------- CARRITO (compartido en todas las páginas) ---------- */
let okrCart = [];

function okrCartTotal(){ return okrCart.reduce((sum,c)=>sum + c.price*c.qty, 0); }

function okrAddToCart(item, qty){
  const existing = okrCart.find(c=>c.id===item.id);
  if(existing){ existing.qty += qty; }
  else{ okrCart.push({id:item.id, name:item.name, price:item.price, qty}); }
  okrUpdateCartUI();
}
function okrChangeQty(id, delta){
  const line = okrCart.find(c=>c.id===id);
  if(!line) return;
  line.qty += delta;
  if(line.qty<=0){ okrCart = okrCart.filter(c=>c.id!==id); }
  okrUpdateCartUI();
}
function okrRemoveLine(id){ okrCart = okrCart.filter(c=>c.id!==id); okrUpdateCartUI(); }

function okrUpdateCartUI(){
  const count = okrCart.reduce((s,c)=>s+c.qty,0);
  const countEl = document.getElementById('cartCount');
  if(countEl){ countEl.textContent = count; countEl.classList.toggle('hidden', count===0); }

  const linesEl = document.getElementById('cartLines');
  const emptyEl = document.getElementById('emptyCart');
  const footEl = document.getElementById('cartFoot');
  if(!linesEl) return;

  if(okrCart.length===0){
    emptyEl.classList.remove('hidden');
    linesEl.innerHTML='';
    footEl.style.display='none';
  } else {
    emptyEl.classList.add('hidden');
    footEl.style.display='block';
    linesEl.innerHTML = okrCart.map(c=>`
      <div class="cart-line" data-id="${c.id}">
        <div style="flex:1;">
          <div class="cart-line-name">${c.name}</div>
          <div class="cart-line-price">${okrFmt(c.price)} c/u</div>
        </div>
        <div class="stepper">
          <button class="line-dec">−</button>
          <span>${c.qty}</span>
          <button class="line-inc">+</button>
        </div>
        <div class="cart-line-total">${okrFmt(c.price*c.qty)}</div>
        <button class="remove-x" aria-label="Quitar">✕</button>
      </div>
    `).join('');
    linesEl.querySelectorAll('.cart-line').forEach(line=>{
      const id = line.dataset.id;
      line.querySelector('.line-inc').addEventListener('click', ()=>okrChangeQty(id, 1));
      line.querySelector('.line-dec').addEventListener('click', ()=>okrChangeQty(id, -1));
      line.querySelector('.remove-x').addEventListener('click', ()=>okrRemoveLine(id));
    });
  }
  const sub1 = document.getElementById('subtotalVal');
  const sub2 = document.getElementById('subtotalVal2');
  if(sub1) sub1.textContent = okrFmt(okrCartTotal());
  if(sub2) sub2.textContent = okrFmt(okrCartTotal());
}

/* ---------- DRAWER + CHECKOUT (usado por menu.html) ---------- */
function okrInitCartDrawer(){
  const overlay = document.getElementById('overlay');
  const drawer = document.getElementById('drawer');
  if(!overlay || !drawer) return;

  function openDrawer(){ overlay.classList.add('show'); drawer.classList.add('show'); }
  function closeDrawer(){ overlay.classList.remove('show'); drawer.classList.remove('show'); showCartView(); }
  document.getElementById('openCartBtn')?.addEventListener('click', openDrawer);
  document.getElementById('closeDrawerBtn')?.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  const cartView = document.getElementById('cartView');
  const checkoutView = document.getElementById('checkoutView');
  const cartFoot = document.getElementById('cartFoot');
  const checkoutFoot = document.getElementById('checkoutFoot');
  const drawerTitle = document.getElementById('drawerTitle');

  function showCheckoutView(){
    cartView.classList.add('hidden'); cartFoot.classList.add('hidden');
    checkoutView.classList.remove('hidden'); checkoutFoot.classList.remove('hidden');
    drawerTitle.textContent = 'Datos del pedido';
  }
  function showCartView(){
    checkoutView.classList.add('hidden'); checkoutFoot.classList.add('hidden');
    cartView.classList.remove('hidden');
    if(okrCart.length>0) cartFoot.classList.remove('hidden');
    drawerTitle.textContent = 'Tu pedido';
  }
  document.getElementById('goCheckoutBtn')?.addEventListener('click', ()=>{
    if(okrCart.length===0) return;
    showCheckoutView();
  });
  document.getElementById('backToCartBtn')?.addEventListener('click', showCartView);

  const radioOpts = document.querySelectorAll('.radio-opt');
  const addressGroup = document.getElementById('addressGroup');
  let deliveryType = 'domicilio';
  radioOpts.forEach(opt=>{
    opt.addEventListener('click', ()=>{
      radioOpts.forEach(o=>o.classList.remove('active'));
      opt.classList.add('active');
      deliveryType = opt.dataset.type;
      addressGroup.style.display = deliveryType==='domicilio' ? 'block' : 'none';
      okrUpdateTotalsView(deliveryType);
    });
  });

  let gpsLink = '';
  document.getElementById('gpsBtn')?.addEventListener('click', ()=>{
    const status = document.getElementById('gpsStatus');
    if(!navigator.geolocation){
      status.textContent = 'Este navegador no permite obtener la ubicación automáticamente. Escribe la dirección o pega el link de Google Maps arriba.';
      return;
    }
    status.textContent = 'Obteniendo tu ubicación...';
    navigator.geolocation.getCurrentPosition(
      (pos)=>{
        const {latitude, longitude} = pos.coords;
        gpsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        status.textContent = 'Ubicación capturada correctamente. Se incluirá el enlace en el pedido.';
      },
      ()=>{ status.textContent = 'No fue posible obtener la ubicación automáticamente. Escribe la dirección o pega aquí el link de tu ubicación de Google Maps.'; }
    );
  });

  document.getElementById('sendWaBtn')?.addEventListener('click', ()=>{
    const settings = okrGetSettings();
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const payMethod = document.getElementById('payMethod').value;
    const notes = document.getElementById('custNotes').value.trim();

    if(!name || !phone){ alert('Por favor completa tu nombre y teléfono para enviar el pedido.'); return; }
    if(deliveryType==='domicilio' && !address && !gpsLink){ alert('Por favor escribe tu dirección o usa el botón de ubicación GPS.'); return; }

    const fecha = new Date().toLocaleString('es-CO', {dateStyle:'long', timeStyle:'short'});
    const deliveryFee = deliveryType==='domicilio' ? Number(settings.deliveryFee||0) : 0;
    const total = okrCartTotal() + deliveryFee;

    let msg = `\u{1F32E} *NUEVO PEDIDO — ${settings.name.toUpperCase()}* \u{1F32E}\n`;
    msg += `_Generado el ${fecha}_\n`;
    msg += `-------------------------\n\n`;
    msg += `\u{1F464} *Cliente:* ${name}\n`;
    msg += `\u{1F4DE} *Teléfono:* ${phone}\n`;
    msg += `\u{1F6F5} *Entrega:* ${deliveryType==='domicilio' ? 'Domicilio' : 'Recoger en tienda'}\n`;
    if(deliveryType==='domicilio'){
      if(address) msg += `\u{1F4CD} *Dirección:* ${address}\n`;
      if(gpsLink) msg += `\u{1F4CD} *Ubicación GPS:* ${gpsLink}\n`;
    }
    msg += `\u{1F4B3} *Pago:* ${payMethod}\n\n`;
    msg += `\u{1F9FE} *DETALLE DEL PEDIDO:*\n`;
    msg += `-------------------------\n`;
    okrCart.forEach(c=>{
      const emoji = okrCategoryEmojiForId(c.id);
      msg += `${emoji} ${c.qty}x *${c.name}* — ${okrFmt(c.price)} c/u = *${okrFmt(c.price*c.qty)}*\n`;
    });
    msg += `-------------------------\n`;
    msg += `Subtotal: ${okrFmt(okrCartTotal())}\n`;
    if(deliveryType==='domicilio') msg += `Domicilio: ${okrFmt(deliveryFee)}\n`;
    msg += `\u{1F4B0} *TOTAL A PAGAR: ${okrFmt(total)}*\n\n`;
    if(notes) msg += `\u{1F4DD} *Notas:* ${notes}\n\n`;
    msg += `¡Gracias por tu pedido! \u{1F64C} En un momento lo confirmamos y te avisamos el tiempo estimado.`;

    const url = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });

  okrUpdateTotalsView('domicilio');
}

function okrUpdateTotalsView(deliveryType){
  const settings = okrGetSettings();
  const deliveryFee = deliveryType==='domicilio' ? Number(settings.deliveryFee||0) : 0;
  const sub1 = document.getElementById('subtotalVal');
  const sub2 = document.getElementById('subtotalVal2');
  const feeRow = document.getElementById('feeRow');
  const feeVal = document.getElementById('feeVal');
  const totalVal = document.getElementById('totalVal');
  if(sub1) sub1.textContent = okrFmt(okrCartTotal());
  if(sub2) sub2.textContent = okrFmt(okrCartTotal());
  if(feeVal) feeVal.textContent = okrFmt(deliveryFee);
  if(feeRow) feeRow.style.display = deliveryFee>0 ? 'flex' : 'none';
  if(totalVal) totalVal.textContent = okrFmt(okrCartTotal() + deliveryFee);
}

/* Envuelve okrUpdateCartUI para además refrescar el total con domicilio */
const _okrUpdateCartUIBase = okrUpdateCartUI;
okrUpdateCartUI = function(){
  _okrUpdateCartUIBase();
  const activeRadio = document.querySelector('.radio-opt.active');
  okrUpdateTotalsView(activeRadio ? activeRadio.dataset.type : 'domicilio');
};

function okrSyncHeaderHeight(){
  const header = document.querySelector('header.site-header');
  if(!header) return;
  document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
}

document.addEventListener('DOMContentLoaded', function(){
  const path = window.location.pathname.split('/').pop() || 'index.html';
  okrRenderHeader(path);
  okrRenderFooter();
  okrInitCartDrawer();
  okrSyncHeaderHeight();
  window.addEventListener('resize', okrSyncHeaderHeight);
  if(document.fonts && document.fonts.ready){ document.fonts.ready.then(okrSyncHeaderHeight); }
});
