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
    <button data-category="${cat}" class="category-chip px-5 py-2 rounded-full text-sm font-medium ${cat === 'all' ? 'bg-[#333333] text-white' : 'bg-[#F8D7E6] text-[#333333]'} hover:bg-[#C9A227] hover:text-white transition flex-shrink-0">${cat === 'all' ? 'All' : cat}</button>
  `).join('');

  row.querySelectorAll('.category-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.category;
      row.querySelectorAll('.category-chip').forEach(b => {
        b.classList.remove('bg-[#333333]', 'text-white');
        b.classList.add('bg-[#F8D7E6]', 'text-[#333333]');
      });
      btn.classList.add('bg-[#333333]', 'text-white');
      btn.classList.remove('bg-[#F8D7E6]', 'text-[#333333]');
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

  grid.innerHTML = filtered.map(p => {
    const waMessage = encodeURIComponent(`Hi Bella Wigs, I'm interested in the ${p.name} — KES ${p.price.toLocaleString()}. Is it available?`);
    return `
      <div class="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition relative">
        ${p.badge ? `<span class="absolute top-3 left-3 z-10 bg-[#C9A227] text-white text-xs font-semibold px-3 py-1 rounded-full">${p.badge}</span>` : ''}
        <div class="aspect-square bg-[#FFF8FA] flex items-center justify-center">
          <img src="${IMG_PATH}${p.image}" class="w-full h-full object-cover hover:scale-105 transition" alt="${p.name}">
        </div>
        <div class="p-5">
          <p class="text-xs uppercase text-[#C9A227] mb-1">${p.category}</p>
          <p class="font-display text-lg">${p.name}</p>
          <div class="flex flex-wrap gap-1 my-2">
            <span class="text-xs bg-[#FFF8FA] border border-[#F8D7E6] text-gray-600 px-2 py-1 rounded-full">${p.hair_type}</span>
            <span class="text-xs bg-[#FFF8FA] border border-[#F8D7E6] text-gray-600 px-2 py-1 rounded-full">${p.density} Density</span>
            <span class="text-xs bg-[#FFF8FA] border border-[#F8D7E6] text-gray-600 px-2 py-1 rounded-full">${p.lace}</span>
            <span class="text-xs bg-[#FFF8FA] border border-[#F8D7E6] text-gray-600 px-2 py-1 rounded-full">${p.length}"</span>
          </div>
          <div class="flex justify-between items-center mb-3">
            <span class="font-semibold">KES ${p.price.toLocaleString()}</span>
            <button data-id="${p.id}" class="add-to-cart-btn bg-[#333333] text-white text-sm px-4 py-2 rounded-full hover:bg-[#C9A227] transition">Add to Cart</button>
          </div>
          <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}" target="_blank" class="block text-center text-sm border border-[#25D366] text-[#128C4A] py-2 rounded-full font-medium hover:bg-[#25D366] hover:text-white transition">💬 Ask on WhatsApp</a>
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.dataset.id, btn));
  });
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
    ? '<p class="text-gray-400 text-sm">Your cart is empty.</p>'
    : cart.map(i => `
      <div class="flex justify-between text-sm border-b border-[#F8D7E6] pb-3">
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
  document.querySelectorAll('#category-row button').forEach(b => {
    const match = b.dataset.category === category;
    b.classList.toggle('bg-[#333333]', match);
    b.classList.toggle('text-white', match);
    b.classList.toggle('bg-[#F8D7E6]', !match);
    b.classList.toggle('text-[#333333]', !match);
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

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderProducts();
    });
  }
  if (priceSelect) {
    priceSelect.addEventListener('change', (e) => {
      priceMax = e.target.value === 'all' ? Infinity : Number(e.target.value);
      renderProducts();
    });
  }
  if (lengthSelect) {
    lengthSelect.addEventListener('change', (e) => {
      lengthFilter = e.target.value;
      renderProducts();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchTerm = ''; priceMax = Infinity; lengthFilter = 'all'; activeCategory = 'all';
      if (searchInput) searchInput.value = '';
      if (priceSelect) priceSelect.value = 'all';
      if (lengthSelect) lengthSelect.value = 'all';
      document.querySelectorAll('#category-row button').forEach(b => {
        const match = b.dataset.category === 'all';
        b.classList.toggle('bg-[#333333]', match);
        b.classList.toggle('text-white', match);
        b.classList.toggle('bg-[#F8D7E6]', !match);
        b.classList.toggle('text-[#333333]', !match);
      });
      renderProducts();
    });
  }
}

renderCategoryChips();
renderProducts();
renderCart();
initFilterBar();

