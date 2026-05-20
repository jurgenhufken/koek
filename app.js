// ============================================
// Sranang Koekoe — App Logic
// ============================================

  // ---- Hero Background — random on load, fixed for session ----
  (function () {
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length <= 1) return;
    const startIndex = Math.floor(Math.random() * heroSlides.length);
    heroSlides.forEach(s => s.classList.remove('active'));
    heroSlides[startIndex].classList.add('active');
  })();

// ---- Product Data ----
const PRODUCTS = {
  'eksi-kuku': {
    name: 'Eksi Kuku',
    subtitle: 'Surinaamse Gele Koek',
    img: 'images/eksi-kuku.jpg',
    desc: 'De Eksi Kuku is de koningin van de Surinaamse koek. Deze iconische, luchtige eiercake heeft een prachtige goudgele kleur en wordt traditioneel afgewerkt met kleurrijke suikermuisjes. Het recept vereist vakmanschap — het beslag moet 15-20 minuten lang opgeklopt worden voor de perfecte luchtigheid.',
    ingredients: 'Eieren, suiker, patentbloem, roomboter, vanille-essence, suikermuisjes',
    sizes: [
      { name: 'Medium', info: 'Ø 20 cm · 4-6 stukken', price: 18.50 },
      { name: 'Groot', info: 'Ø 24 cm · 8-10 stukken', price: 27.50 },
      { name: 'Feest', info: 'Ø 30 cm · 12-16 stukken', price: 38.00 }
    ],
    details: { levertijd: '2 dagen', houdbaarheid: '3 dagen', allergenen: 'Gluten, ei, melk' }
  },
  'keksi': {
    name: 'Keksi',
    subtitle: 'Surinaamse Bruine Koek',
    img: 'images/keksi.jpg',
    desc: 'De Keksi is een rijke, donkere vruchtencake vol rozijnen, krenten en gedroogde pruimen, geweekt in Surinaamse rum. De warme kaneel en nootmuskaat geven deze koek zijn onmiskenbare karakter. Een absolute favoriet bij feestelijke gelegenheden.',
    ingredients: 'Eieren, bruine basterdsuiker, bloem, roomboter, rozijnen, krenten, pruimen, kaneel, nootmuskaat, Borgoe rum',
    sizes: [
      { name: 'Medium', info: 'Ø 20 cm · 4-6 stukken', price: 20.00 },
      { name: 'Groot', info: 'Ø 24 cm · 8-10 stukken', price: 30.00 },
      { name: 'Feest', info: 'Ø 28 cm · 12-16 stukken', price: 42.00 }
    ],
    details: { levertijd: '3 dagen', houdbaarheid: '5 dagen', allergenen: 'Gluten, ei, melk, alcohol' }
  },
  'bojo': {
    name: 'Bojo',
    subtitle: 'Cassave-Kokoscake',
    img: 'images/bojo.jpg',
    desc: 'Bojo is de ultieme Surinaamse comfort cake — smeuïg, compact en boordevol kokossmaak. Gemaakt van verse geraspte cassave en kokosmelk, is deze cake van nature glutenvrij. Verkrijgbaar als witte bojo (vanille & amandel) of bruine bojo (kaneel).',
    ingredients: 'Geraspte cassave, kokosmelk, geraspte kokos, suiker, eieren, boter, vanille, kaneel, rozijnen',
    sizes: [
      { name: 'Medium', info: 'Ø 24 cm · 6-8 stukken', price: 22.00 },
      { name: 'Groot', info: 'Ø 28 cm · 10-12 stukken', price: 28.00 },
      { name: 'Feest', info: 'Ø 35 cm · 14-18 stukken', price: 40.00 }
    ],
    details: { levertijd: '2 dagen', houdbaarheid: '3 dagen', allergenen: 'Ei, melk · Glutenvrij ✓' }
  },
  'appeltaart': {
    name: 'Surinaamse Appeltaart',
    subtitle: 'Tropische twist op een klassieker',
    img: 'images/appeltaart.jpg',
    desc: 'Onze Surinaamse appeltaart tilt de Nederlandse klassieker naar een hoger niveau. Met een scheutje Borgoe rum, gembersiroop en amandelessence krijgt de vulling een onweerstaanbaar aromatisch karakter. De krokante bodem en het gouden rasterpatroon maken het geheel af.',
    ingredients: 'Appels, bloem, roomboter, suiker, Borgoe rum, gembersiroop, amandelessence, rozijnen, kaneel, citroensap',
    sizes: [
      { name: 'Medium', info: 'Ø 20 cm · 4-6 stukken', price: 18.00 },
      { name: 'Groot', info: 'Ø 24 cm · 8-10 stukken', price: 26.00 },
      { name: 'Feest', info: 'Ø 28 cm · 12-14 stukken', price: 35.00 }
    ],
    details: { levertijd: '2 dagen', houdbaarheid: '3 dagen', allergenen: 'Gluten, ei, melk, noten, alcohol' }
  }
};

const cart = {};
let deliveryFee = 0;
let famiriDiscount = 0; // 0 = no discount, 0.12 = 12%

// ---- Famiri Loyalty System (Tiered) ----
const FAMIRI_TIERS = {
  'MATI2026':   { tier: 'Mati',        discount: 0.05 },
  'FAMIRI2026': { tier: 'Famiri',       discount: 0.12 },
  'BIGI2026':   { tier: 'Bigi Famiri',  discount: 0.20 },
  // Add personal codes here:
  // 'FAMIRI-NAAM-XX': { tier: 'Famiri', discount: 0.12 },
};

function applyDiscount() {
  const input = document.getElementById('famiriCode');
  const msg = document.getElementById('famiriCodeMsg');
  const code = input.value.trim().toUpperCase();

  if (!code) {
    famiriDiscount = 0;
    msg.textContent = '';
    msg.className = 'famiri-code-msg';
    renderCart();
    return;
  }

  const match = FAMIRI_TIERS[code];
  if (match) {
    famiriDiscount = match.discount;
    const pct = Math.round(match.discount * 100);
    msg.textContent = `✓ ${match.tier}-code geaccepteerd! ${pct}% korting toegepast.`;
    msg.className = 'famiri-code-msg success';
    input.style.borderColor = '#27ae60';
  } else {
    famiriDiscount = 0;
    msg.textContent = '✗ Ongeldige code. Word Famiri om een code te ontvangen.';
    msg.className = 'famiri-code-msg error';
    input.style.borderColor = '#e74c3c';
  }
  renderCart();
}

function selectFamiriPhoto(el) {
  document.querySelectorAll('.famiri-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const altText = el.querySelector('img')?.alt || 'Suriname';
  const hiddenInput = document.getElementById('famiriChosenPrint');
  if (hiddenInput) hiddenInput.value = altText;
}

// Signup Modal
const TIER_INFO = {
  mati: { name: 'Mati', price: '€2,95/mnd', desc: 'Je ontvangt je Mati-code (5% korting) per e-mail.' },
  famiri: { name: 'Famiri', price: '€6,95/mnd', desc: 'Je ontvangt je Famiri-code (12% korting), een mok en je gekozen art print.' },
  bigi: { name: 'Bigi Famiri', price: '€14,95/mnd', desc: 'Je ontvangt je Bigi Famiri-code (20% korting), mok, ingelijste print en exclusieve VIP-toegang.' }
};

function openFamiriSignup(tier) {
  const info = TIER_INFO[tier];
  if (!info) return;
  document.getElementById('famiriSignupTitle').textContent = `Word ${info.name}`;
  document.getElementById('famiriSignupDesc').textContent = info.desc;
  document.getElementById('famiriTierInput').value = tier;
  document.getElementById('famiriSubmitBtn').textContent = `Aanmelden — ${info.price}`;
  document.getElementById('famiriSignupOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeFamiriSignup() {
  document.getElementById('famiriSignupOverlay').style.display = 'none';
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.id === 'famiriSignupOverlay') closeFamiriSignup();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeFamiriSignup();
});

// ---- Navigation ----
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.textContent = '☰';
  });
});

// ---- Scroll Animations ----
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ---- Set min delivery date ----
const dateInput = document.getElementById('deliveryDate');
if (dateInput) {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  dateInput.min = minDate.toISOString().split('T')[0];
}

// ---- Delivery type toggle ----
const deliverySelect = document.getElementById('deliveryType');
const addressGroup = document.getElementById('addressGroup');

deliverySelect.addEventListener('change', () => {
  const isBezorgen = deliverySelect.value === 'bezorgen';
  addressGroup.style.display = isBezorgen ? 'block' : 'none';
  document.getElementById('address').required = isBezorgen;
  deliveryFee = isBezorgen ? 7.50 : 0;
  updateCartDisplay();
});

// ---- Product Modal ----
function createModalHTML() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'productModal';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-image">
        <button class="modal-close" onclick="closeModal()">✕</button>
        <img id="modalImg" src="" alt="" style="cursor: zoom-in;" onclick="openLightbox(this.src)">
      </div>
      <div class="modal-body">
        <h2 id="modalTitle"></h2>
        <p class="modal-subtitle" id="modalSubtitle"></p>
        <p class="modal-desc" id="modalDesc"></p>
        <div class="modal-details" id="modalDetails"></div>
        <div class="modal-ingredients" id="modalIngredients">
          <h4>Ingrediënten</h4>
          <p id="modalIngText"></p>
        </div>
        <div class="size-selector" id="sizeSelector"></div>
        <div class="modal-price-row">
          <span class="modal-price" id="modalPrice">€27,50<small> hele taart</small></span>
          <button class="btn btn-primary" id="modalAddBtn" style="padding: 0.7rem 1.5rem;">
            + Bestellen
          </button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}

createModalHTML();

let currentModalProduct = null;
let currentModalSize = 1;

function openProductModal(productId) {
  const p = PRODUCTS[productId];
  if (!p) return;

  currentModalProduct = productId;
  currentModalSize = 1;

  document.getElementById('modalImg').src = p.img;
  document.getElementById('modalImg').alt = p.name;
  document.getElementById('modalTitle').textContent = p.name;
  document.getElementById('modalSubtitle').textContent = p.subtitle;
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalIngText').textContent = p.ingredients;

  // Details
  const detailsHTML = `
    <div class="modal-detail"><span class="modal-detail-icon">⏱️</span><div><div class="modal-detail-label">Levertijd</div><div class="modal-detail-value">${p.details.levertijd}</div></div></div>
    <div class="modal-detail"><span class="modal-detail-icon">📦</span><div><div class="modal-detail-label">Houdbaarheid</div><div class="modal-detail-value">${p.details.houdbaarheid}</div></div></div>
    <div class="modal-detail"><span class="modal-detail-icon">⚠️</span><div><div class="modal-detail-label">Allergenen</div><div class="modal-detail-value">${p.details.allergenen}</div></div></div>
    <div class="modal-detail"><span class="modal-detail-icon">🏡</span><div><div class="modal-detail-label">Bereiding</div><div class="modal-detail-value">Ambachtelijk</div></div></div>`;
  document.getElementById('modalDetails').innerHTML = detailsHTML;

  // Size selector
  const sizesHTML = p.sizes.map((s, i) => `
    <div class="size-option ${i === 1 ? 'active' : ''}" onclick="selectSize('${productId}', ${i})">
      <span class="size-name">${s.name}</span>
      <span class="size-info">${s.info}</span>
      <span class="size-price">€${s.price.toFixed(2)}</span>
    </div>`).join('');
  document.getElementById('sizeSelector').innerHTML = sizesHTML;

  updateModalPrice(productId, 1);

  document.getElementById('productModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function selectSize(productId, index) {
  currentModalSize = index;
  document.querySelectorAll('.size-option').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });
  updateModalPrice(productId, index);
}

function updateModalPrice(productId, sizeIndex) {
  const p = PRODUCTS[productId];
  const size = p.sizes[sizeIndex];
  document.getElementById('modalPrice').innerHTML = `€${size.price.toFixed(2)}<small> ${size.name.toLowerCase()}</small>`;
  document.getElementById('modalAddBtn').onclick = () => {
    addToCart(productId, `${p.name} (${size.name})`, size.price, p.img);
    closeModal();
  };
}

function closeModal() {
  document.getElementById('productModal').classList.remove('active');
  document.body.style.overflow = '';
}

// ---- Lightbox ----
function createLightbox() {
  const lb = document.createElement('div');
  lb.className = 'lightbox-overlay';
  lb.id = 'lightbox';
  lb.innerHTML = '<img src="" alt="Vergroot">';
  lb.addEventListener('click', () => {
    lb.classList.remove('active');
  });
  document.body.appendChild(lb);
}

createLightbox();

function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  lb.querySelector('img').src = src;
  lb.classList.add('active');
}

// ---- Make product cards clickable ----
document.querySelectorAll('.product-card').forEach(card => {
  const productId = card.dataset.product;
  card.querySelector('.product-card-img').addEventListener('click', (e) => {
    e.stopPropagation();
    openProductModal(productId);
  });

  // Make the title clickable too
  const title = card.querySelector('h3');
  if (title) {
    title.style.cursor = 'pointer';
    title.addEventListener('click', () => openProductModal(productId));
  }
});

// ---- Cart Functions ----
function addToCart(id, name, price, img) {
  const cartKey = `${id}-${price}`;
  if (cart[cartKey]) {
    cart[cartKey].qty += 1;
  } else {
    cart[cartKey] = { name, price, img, qty: 1 };
  }
  updateCartDisplay();
  showToast(`✓ ${name} toegevoegd aan je bestelling`);
}

function removeFromCart(key) {
  if (cart[key]) {
    cart[key].qty -= 1;
    if (cart[key].qty <= 0) delete cart[key];
  }
  updateCartDisplay();
}

function increaseCart(key) {
  if (cart[key]) cart[key].qty += 1;
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartItemsEl = document.getElementById('cartItems');
  const totalsEl = document.getElementById('orderTotals');
  const items = Object.entries(cart);

  if (items.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <p>🛒 Je winkelwagen is leeg</p>
        <p style="font-size: 0.8rem; margin-top: 0.5rem;">Klik op een product of "+ Toevoegen"</p>
      </div>`;
    totalsEl.style.display = 'none';
    return;
  }

  let html = '';
  let subtotal = 0;

  items.forEach(([key, item]) => {
    const lineTotal = item.price * item.qty;
    subtotal += lineTotal;
    const escapedName = item.name.replace(/'/g, "\\'");
    html += `
      <div class="cart-item">
        <div class="cart-item-img"><img src="${item.img}" alt="${item.name}"></div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>€${item.price.toFixed(2)} per stuk</p>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="removeFromCart('${key}')">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="increaseCart('${key}')">+</button>
        </div>
        <span class="cart-item-price">€${lineTotal.toFixed(2)}</span>
      </div>`;
  });

  cartItemsEl.innerHTML = html;
  totalsEl.style.display = 'block';

  // Calculate discount
  const discountAmt = subtotal * famiriDiscount;
  const discountedSubtotal = subtotal - discountAmt;
  const total = discountedSubtotal + deliveryFee;

  document.getElementById('subtotal').textContent = `€${subtotal.toFixed(2)}`;

  // Show/hide discount row
  const discountRow = document.getElementById('discountRow');
  const discountAmountEl = document.getElementById('discountAmount');
  if (famiriDiscount > 0 && subtotal > 0) {
    discountRow.style.display = 'flex';
    const pct = Math.round(famiriDiscount * 100);
    discountRow.querySelector('span:first-child').textContent = `Famiri-korting (${pct}%)`;
    discountAmountEl.textContent = `−€${discountAmt.toFixed(2)}`;
  } else {
    discountRow.style.display = 'none';
  }

  document.getElementById('deliveryCost').textContent = deliveryFee > 0 ? `€${deliveryFee.toFixed(2)}` : 'Gratis';
  document.getElementById('totalAmount').textContent = `€${total.toFixed(2)}`;
}

// ---- Toast ----
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---- Order System ----
function generateOrderNumber() {
  const prefix = 'SK';
  const date = new Date();
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${d}${m}-${rand}`;
}

function buildOrderSummary(data, items) {
  let subtotal = 0;
  const lines = items.map(([_, item]) => {
    const lineTotal = item.price * item.qty;
    subtotal += lineTotal;
    return { name: item.name, qty: item.qty, lineTotal };
  });
  const total = subtotal + deliveryFee;
  return { lines, subtotal, total };
}

function submitOrder(e) {
  e.preventDefault();

  const items = Object.entries(cart);
  if (items.length === 0) {
    showToast('⚠️ Voeg eerst producten toe aan je bestelling');
    return;
  }

  const form = document.getElementById('orderForm');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  const orderNumber = generateOrderNumber();
  const { lines, subtotal, total } = buildOrderSummary(data, items);

  // Build order object
  const order = {
    orderNumber,
    date: new Date().toISOString(),
    customer: {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone
    },
    delivery: {
      type: data.deliveryType,
      date: data.deliveryDate,
      address: data.address || 'Ophalen'
    },
    items: lines,
    subtotal,
    deliveryFee,
    total,
    notes: data.notes || ''
  };

  // Save to localStorage
  saveOrder(order);

  // Send via Formspree (replace with your own form ID)
  sendOrderEmail(order);

  // Build WhatsApp message
  let waMsg = `🇸🇷 *Bestelling ${orderNumber}*\n`;
  waMsg += `*Sranang Koekoe*\n\n`;
  waMsg += `👤 ${order.customer.name}\n`;
  waMsg += `📧 ${order.customer.email}\n`;
  waMsg += `📞 ${order.customer.phone}\n`;
  waMsg += `📅 ${formatDate(order.delivery.date)}\n`;
  waMsg += `🚚 ${order.delivery.type === 'bezorgen' ? 'Bezorgen: ' + order.delivery.address : 'Ophalen'}\n\n`;
  lines.forEach(l => { waMsg += `• ${l.qty}x ${l.name} — €${l.lineTotal.toFixed(2)}\n`; });
  waMsg += `\n💰 *Totaal: €${total.toFixed(2)}*`;
  if (order.notes) waMsg += `\n💬 ${order.notes}`;

  const waUrl = `https://wa.me/31612345678?text=${encodeURIComponent(waMsg)}`;

  // Show confirmation
  showOrderConfirmation(order, waUrl);

  // Reset form and cart
  form.reset();
  Object.keys(cart).forEach(k => delete cart[k]);
  deliveryFee = 0;
  updateCartDisplay();
  addressGroup.style.display = 'none';
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function showOrderConfirmation(order, waUrl) {
  const detailsEl = document.getElementById('confirmDetails');
  detailsEl.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.8rem; padding-bottom: 0.8rem; border-bottom: 1px solid var(--border-glass);">
      <span style="color: var(--text-muted); font-size: 0.85rem;">Bestelnummer</span>
      <span style="font-weight: 700; color: var(--clr-primary); font-size: 1rem;">${order.orderNumber}</span>
    </div>
    ${order.items.map(l => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.9rem;">
        <span>${l.qty}× ${l.name}</span>
        <span style="color: var(--clr-primary);">€${l.lineTotal.toFixed(2)}</span>
      </div>`).join('')}
    <div style="display: flex; justify-content: space-between; margin-top: 0.8rem; padding-top: 0.8rem; border-top: 1px solid var(--border-glass); font-weight: 700; font-size: 1.1rem;">
      <span>Totaal</span>
      <span style="color: var(--clr-primary);">€${order.total.toFixed(2)}</span>
    </div>
    <div style="margin-top: 0.8rem; font-size: 0.8rem; color: var(--text-muted);">
      📅 ${formatDate(order.delivery.date)} · ${order.delivery.type === 'bezorgen' ? '🚚 Bezorgen' : '🏠 Ophalen'}
    </div>`;

  document.getElementById('whatsappLink').href = waUrl;
  document.getElementById('confirmationModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeConfirmation() {
  document.getElementById('confirmationModal').classList.remove('active');
  document.body.style.overflow = '';
}

// ---- LocalStorage Order History ----
function saveOrder(order) {
  try {
    const orders = JSON.parse(localStorage.getItem('sranang_orders') || '[]');
    orders.unshift(order);
    if (orders.length > 50) orders.pop();
    localStorage.setItem('sranang_orders', JSON.stringify(orders));
  } catch (e) { /* localStorage unavailable */ }
}

// ---- Formspree Email ----
async function sendOrderEmail(order) {
  const body = {
    orderNumber: order.orderNumber,
    name: order.customer.name,
    email: order.customer.email,
    phone: order.customer.phone,
    deliveryDate: order.delivery.date,
    deliveryType: order.delivery.type,
    address: order.delivery.address,
    items: order.items.map(l => `${l.qty}x ${l.name} (€${l.lineTotal.toFixed(2)})`).join(', '),
    total: `€${order.total.toFixed(2)}`,
    notes: order.notes,
    _subject: `Nieuwe bestelling ${order.orderNumber} — Sranang Koekoe`
  };

  try {
    // Replace 'YOUR_FORMSPREE_ID' with your actual Formspree form ID
    await fetch('https://formspree.io/f/mlgvjpgz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (e) {
    // Silently fail — WhatsApp is the primary channel
    console.log('Email fallback niet beschikbaar:', e.message);
  }
}

// ---- Smooth scroll ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ---- Keyboard shortcuts ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeConfirmation();
    document.getElementById('lightbox').classList.remove('active');
  }
});

// ---- Gallery Strip with Controls ----
(function () {
  const track = document.getElementById('galleryTrackInner');
  const trackWrap = document.getElementById('galleryTrack');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  const playPauseBtn = document.getElementById('galleryPlayPause');
  if (!track || !trackWrap) return;

  // Duplicate items for seamless loop
  const items = track.querySelectorAll('.gallery-item');
  items.forEach(item => track.appendChild(item.cloneNode(true)));

  let scrollPos = 0;
  let playing = true;
  let speed = 0.8; // px per frame
  let animId = null;
  const itemWidth = 350 + 24; // width + gap

  function getHalfWidth() {
    return items.length * itemWidth;
  }

  function animate() {
    scrollPos += speed;
    if (scrollPos >= getHalWidth()) scrollPos -= getHalWidth();
    track.style.transform = 'translateX(' + (-scrollPos) + 'px)';
    if (playing) animId = requestAnimationFrame(animate);
  }

  // Fix typo-safe
  function getHalWidth() { return items.length * itemWidth; }

  function startScroll() {
    playing = true;
    updatePlayBtn();
    if (!animId) animId = requestAnimationFrame(animate);
  }

  function stopScroll() {
    playing = false;
    updatePlayBtn();
    if (animId) { cancelAnimationFrame(animId); animId = null; }
  }

  function scrollBy(direction) {
    // Jump by 2 items in given direction
    const jumpPx = itemWidth * 2;
    scrollPos += direction * jumpPx;
    const half = getHalWidth();
    if (scrollPos < 0) scrollPos += half;
    if (scrollPos >= half) scrollPos -= half;
    track.style.transform = 'translateX(' + (-scrollPos) + 'px)';
  }

  function updatePlayBtn() {
    if (!playPauseBtn) return;
    const iconPause = playPauseBtn.querySelector('.icon-pause');
    const iconPlay = playPauseBtn.querySelector('.icon-play');
    if (iconPause) iconPause.style.display = playing ? '' : 'none';
    if (iconPlay) iconPlay.style.display = playing ? 'none' : '';
  }

  // Button events
  if (prevBtn) prevBtn.addEventListener('click', () => { scrollBy(-1); });
  if (nextBtn) nextBtn.addEventListener('click', () => { scrollBy(1); });
  if (playPauseBtn) playPauseBtn.addEventListener('click', () => {
    playing ? stopScroll() : startScroll();
  });

  // Pause on hover
  trackWrap.addEventListener('mouseenter', () => {
    if (playing && animId) { cancelAnimationFrame(animId); animId = null; }
  });
  trackWrap.addEventListener('mouseleave', () => {
    if (playing && !animId) animId = requestAnimationFrame(animate);
  });

  // Lightbox on click
  track.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item) {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src);
    }
  });

  // Start
  track.classList.add('scrolling');
  startScroll();
})();

// ---- About Image Slideshow ----
(function () {
  const slides = document.querySelectorAll('.about-slide');
  if (slides.length <= 1) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4000);
})();

