const SHOWROOM_SLIDES = [
  { num: "01", title: "BELLA WIGS", subtitle: "Luxury Hair. Your Signature Look.", cta: "EXPLORE COLLECTION", category: "all", image: "banner.png" },
  { num: "02", title: "THE CLASSIC", subtitle: "Sleek. Elegant. Timeless.", cta: "SHOP STRAIGHT WIGS", category: "Straight Wigs", image: "13x4_lace_front_human_hair_wig.png" },
  { num: "03", title: "THE GLAM EDIT", subtitle: "Soft waves. Maximum movement.", cta: "SHOP WATER WAVE", category: "Water Wave Wigs", image: "water_wave_wig.png" },
  { num: "04", title: "THE STATEMENT", subtitle: "Volume. Texture. Confidence.", cta: "SHOP CURLY WIGS", category: "Afro Wigs", image: "all-curly-style.png" },
  { num: "05", title: "YOUR LOOK. YOUR CONFIDENCE.", subtitle: "Find your perfect Bella look.", cta: "SHOP ALL WIGS", category: "all", image: "achieve-the-perfect.png" }
];

function showroomShop(category) {
  activeCategory = category;
  document.querySelectorAll('#category-row .filter-chip').forEach(b => {
    b.classList.toggle('is-active', b.dataset.category === category);
  });
  renderProducts();
  document.getElementById('product-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function panelBg(s) {
  return s.image
    ? `background-image:url('${IMG_PATH}${s.image}')`
    : `background-image: linear-gradient(135deg, #2B2826, #C9A227)`;
}

function renderShowroomDesktop() {
  const panelsEl = document.getElementById('showroom-panels');
  if (!panelsEl) return;

  panelsEl.innerHTML = SHOWROOM_SLIDES.map((s, i) => `
    <div class="showroom-panel" style="${panelBg(s)}" data-index="${i}">
      <span class="showroom-panel-num">${s.num}</span>
      <div class="showroom-panel-content">
        <h3 class="font-display text-2xl text-white mb-1">${s.title}</h3>
        <p class="text-white/90 text-sm mb-3">${s.subtitle}</p>
        <button class="showroom-cta btn btn-sm" style="border:1px solid #fff; color:#fff; background:transparent;">${s.cta}</button>
      </div>
    </div>
  `).join('');

  panelsEl.querySelectorAll('.showroom-panel').forEach((panel, i) => {
    panel.addEventListener('click', (e) => {
      panelsEl.querySelectorAll('.showroom-panel').forEach(p => p.classList.remove('is-active'));
      if (e.target.closest('.showroom-cta') || window.matchMedia('(hover: none)').matches) {
        showroomShop(SHOWROOM_SLIDES[i].category);
      }
      panel.classList.add('is-active');
    });
  });
}

function renderShowroomMobile() {
  const scrollEl = document.getElementById('showroom-scroll');
  const dotsEl = document.getElementById('showroom-dots');
  if (!scrollEl || !dotsEl) return;

  scrollEl.innerHTML = SHOWROOM_SLIDES.map(s => `
    <div class="showroom-slide snap-center shrink-0 w-full h-[420px] relative flex items-end" style="${panelBg(s)}">
      <div class="relative p-6 z-10">
        <h3 class="font-display text-2xl text-white mb-1">${s.title}</h3>
        <p class="text-white/90 text-sm mb-3">${s.subtitle}</p>
        <button class="showroom-cta-mobile btn btn-sm" style="border:1px solid #fff; color:#fff; background:transparent;" data-category="${s.category}">${s.cta}</button>
      </div>
    </div>
  `).join('');

  dotsEl.innerHTML = SHOWROOM_SLIDES.map((_, i) =>
    `<button class="showroom-dot w-2 h-2 rounded-full" style="background: ${i === 0 ? 'var(--champagne)' : 'var(--border)'}" data-index="${i}"></button>`
  ).join('');

  scrollEl.querySelectorAll('.showroom-cta-mobile').forEach(btn => {
    btn.addEventListener('click', () => showroomShop(btn.dataset.category));
  });

  const dots = dotsEl.querySelectorAll('.showroom-dot');
  dotsEl.querySelectorAll('.showroom-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      scrollEl.children[dot.dataset.index].scrollIntoView({ behavior: 'smooth', inline: 'center' });
    });
  });

  let ticking = false;
  scrollEl.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const index = Math.round(scrollEl.scrollLeft / scrollEl.clientWidth);
      dots.forEach((d, i) => { d.style.background = i === index ? 'var(--champagne)' : 'var(--border)'; });
      ticking = false;
    });
  });
}

renderShowroomDesktop();
renderShowroomMobile();
