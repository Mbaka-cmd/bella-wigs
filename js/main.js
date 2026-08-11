const IMG_PATH = "assets/images/";
const WHATSAPP_NUMBER = "254748077609";

let activeCategory = 'all';
let searchTerm = '';
let priceMax = Infinity;
let lengthFilter = 'all'; // 'all' | 'short' (<=12) | 'mid' (14-18) | 'long' (>=20)
let cart = JSON.parse(localStorage.getItem('bella_cart') || '[]');

function saveCart() {
  localStorage.setItem('bella_cart', JSON.stringify(cart));
}

function renderCategoryChips() {
  const row = document.getElementById('category-row');
  const categories = ['all', ...new Set(PRODUCTS.map(p => p.category))];
  row.innerHTML = categories.map(cat => `
    <button data-category="${cat}" class="filter-chip flex-shrink-0 ${cat === 'all' ? 'is-active' : ''}">${cat === 'all' ? 'All' : cat}</button>
  `).join('');

  row.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.category;
      row.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderProducts();
    });
  });
}

function matchesLength(p) {
  if (lengthFilter === 'all') return true;
  if (lengthFilter === 'short') return p.length <= 12;
  if (lengthFilter === 'mid') return p.length >= 14 && p.length <= 18;
  if (lengthFilter === 'long') return p.length >= 20;
  return true;
}

function getFilteredProducts() {
  const term = searchTerm.trim().toLowerCase();
  return PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = !term ||
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.hair_type.toLowerCase().includes(term);
    const matchesPrice = p.price <= priceMax;
    return matchesCategory && matchesSearch && matchesPrice && matchesLength(p);
  });
}

function productCardHtml(p) {
  const waMessage = encodeURIComponent(`Hi Bella Wigs, I'm interested in the ${p.name} — KES ${p.price.toLocaleString()}. Is it available?`);
  const badgeHtml = p.badge ? `<span class="badge badge-${p.badge}">${BADGE_LABELS[p.badge]}</span>` : '';
  return `
    <div class="product-card fade-up">
      ${badgeHtml}
      <div class="product-card-image">
        <img src="${IMG_PATH}${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-card-body">
        <p class="product-card-cat">${p.category}</p>
        <p class="product-card-name">${p.name}</p>
        <div class="product-card-chips">
          <span class="product-card-chip">${p.hair_type}</span>
          <span class="product-card-chip">${p.density} Density</span>
          <span class="product-card-chip">${p.length}"</span>
        </div>
        <div class="product-card-footer">
          <div class="product-card-price-row">
            <span class="product-card-price">KES ${p.price.toLocaleString()}</span>
            <button data-id="${p.id}" class="add-to-cart-btn btn btn-primary btn-sm">Add to Bag</button>
          </div>
          <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}" target="_blank" class="btn btn-whatsapp btn-sm">Ask on WhatsApp</a>
        </div>
      </div>
    </div>
  `;
}

function renderProducts() {
  const filtered = getFilteredProducts();
  const grid = document.getElementById('product-grid');
  const emptyState = document.getElementById('filter-empty-state');

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }
  if (emptyState) emptyState.classList.add('hidden');

  grid.innerHTML = filtered.map(productCardHtml).join('');

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.dataset.id, btn));
  });
  observeFadeUps();
}

function addToCart(id, btn) {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  saveCart();
  renderCart();

  const orig = btn.textContent;
  btn.textContent = 'Added ✓';
  setTimeout(() => { btn.textContent = orig; }, 1000);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0);

  const countEl = document.getElementById('cart-count');
  countEl.classList.toggle('hidden', count === 0);
  countEl.textContent = count;

  document.getElementById('cart-items').innerHTML = cart.length === 0
    ? '<p class="text-gray-400 text-sm">Your bag is empty.</p>'
    : cart.map(i => `
      <div class="flex justify-between text-sm border-b pb-3" style="border-color: var(--border)">
        <div>
          <p class="font-medium">${i.name}</p>
          <p class="text-gray-400">Qty ${i.qty} &middot; <button data-id="${i.id}" class="remove-btn underline">Remove</button></p>
        </div>
        <span class="font-semibold">KES ${(i.qty * i.price).toLocaleString()}</span>
      </div>
    `).join('');

  document.getElementById('cart-subtotal').textContent = `KES ${subtotal.toLocaleString()}`;

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
  });
}

document.getElementById('cart-btn').addEventListener('click', () => {
  document.getElementById('cart-drawer').classList.toggle('hidden');
  document.getElementById('cart-overlay').classList.toggle('hidden');
});
document.getElementById('cart-close').addEventListener('click', closeCart);
document.getElementById('cart-overlay').addEventListener('click', closeCart);
function closeCart() {
  document.getElementById('cart-drawer').classList.add('hidden');
  document.getElementById('cart-overlay').classList.add('hidden');
}

document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) return;
  const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0);
  let message = "Hi Bella Wigs! I'd like to order:%0A";
  cart.forEach(i => {
    message += `- ${i.name} x${i.qty} (KES ${(i.qty * i.price).toLocaleString()})%0A`;
  });
  message += `%0ATotal: KES ${subtotal.toLocaleString()}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
});

function openWigFinder() { document.getElementById('wigfinder-overlay').classList.remove('hidden'); }
function closeWigFinder() { document.getElementById('wigfinder-overlay').classList.add('hidden'); }

function selectOccasion(occasion) {
  const category = OCCASION_MAP[occasion];
  activeCategory = category;
  document.querySelectorAll('#category-row .filter-chip').forEach(b => {
    b.classList.toggle('is-active', b.dataset.category === category);
  });
  const note = document.getElementById('wigfinder-note');
  if (occasion === 'Cancer Treatment') {
    note.textContent = "We're here for you. Here's our full collection, styled by our team to be comfortable and confidence-boosting. Message us on WhatsApp and we'll help you find the right fit.";
    note.classList.remove('hidden');
  } else {
    note.classList.add('hidden');
  }
  renderProducts();
  closeWigFinder();
  document.getElementById('product-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initFilterBar() {
  const searchInput = document.getElementById('search-input');
  const priceSelect = document.getElementById('price-filter');
  const lengthSelect = document.getElementById('length-filter');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (searchInput) searchInput.addEventListener('input', (e) => { searchTerm = e.target.value; renderProducts(); });
  if (priceSelect) priceSelect.addEventListener('change', (e) => { priceMax = e.target.value === 'all' ? Infinity : Number(e.target.value); renderProducts(); });
  if (lengthSelect) lengthSelect.addEventListener('change', (e) => { lengthFilter = e.target.value; renderProducts(); });
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchTerm = ''; priceMax = Infinity; lengthFilter = 'all'; activeCategory = 'all';
      if (searchInput) searchInput.value = '';
      if (priceSelect) priceSelect.value = 'all';
      if (lengthSelect) lengthSelect.value = 'all';
      document.querySelectorAll('#category-row .filter-chip').forEach(b => b.classList.toggle('is-active', b.dataset.category === 'all'));
      renderProducts();
    });
  }
}

function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }, { passive: true });
}

function observeFadeUps() {
  const items = document.querySelectorAll('.fade-up:not(.is-visible)');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(el => io.observe(el));
}

renderCategoryChips();
renderProducts();
renderCart();
initFilterBar();
initStickyHeader();
observeFadeUps();
