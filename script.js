/* =========================================================
   BRICKFACE™ — Interactions boutique
   ========================================================= */
(function () {
  'use strict';

  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  const UNIT_PRICE = 39.90;
  const BUNDLES = { 1: 39.90, 2: 69.90, 3: 99.90 };
  const FREE_SHIP = 50;
  const SHIP_COST = 4.90;

  /* ---------- État ---------- */
  const state = {
    color: 'Jaune Iconique',
    emoji: '🟡',
    qty: 1,
    bundle: 1,
    cart: []
  };

  const eur = (n) => n.toFixed(2).replace('.', ',') + ' €';

  /* =========================================================
     GALERIE + LIGHTBOX
     ========================================================= */
  const thumbEls = $$('.gallery__thumb');
  const IMAGES = thumbEls.map((t) => t.dataset.src);
  const ALTS = thumbEls.map((t) => t.dataset.alt || 'Photo produit');
  // recadrage vertical des visuels portrait (data-fit sur la vignette)
  const FITS = thumbEls.map((t) => t.dataset.fit || '');

  const mainImg = $('#mainImg');
  const imgIndex = $('#imgIndex');
  const imgTotal = $('#imgTotal');
  const galleryMain = $('#galleryMain');
  const dotsWrap = $('#dots');
  let current = 0;

  // Compteur total dynamique
  if (imgTotal) imgTotal.textContent = IMAGES.length;

  // Construction des points (dots)
  IMAGES.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'gallery__dot' + (i === 0 ? ' is-active' : '');
    d.type = 'button';
    d.setAttribute('aria-label', 'Afficher l\'image ' + (i + 1));
    d.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    d.addEventListener('click', () => setImage(i));
    dotsWrap.appendChild(d);
  });
  const dotEls = $$('.gallery__dot');

  function markLoaded() { if (galleryMain) galleryMain.classList.add('is-loaded'); }

  function setImage(i) {
    current = (i + IMAGES.length) % IMAGES.length;

    if (mainImg) {
      const nextSrc = IMAGES[current];
      if (mainImg.getAttribute('src') !== nextSrc) {
        if (galleryMain) galleryMain.classList.remove('is-loaded');
        mainImg.src = nextSrc;
        mainImg.alt = ALTS[current];
        // image déjà en cache -> pas d'événement 'load' fiable
        if (mainImg.complete) markLoaded();
      }
      mainImg.style.objectPosition = FITS[current] || 'center center';
    }
    if (imgIndex) imgIndex.textContent = current + 1;

    thumbEls.forEach((t, idx) => {
      t.classList.toggle('is-active', idx === current);
      t.setAttribute('aria-current', idx === current ? 'true' : 'false');
    });
    dotEls.forEach((d, idx) => {
      d.classList.toggle('is-active', idx === current);
      d.setAttribute('aria-pressed', idx === current ? 'true' : 'false');
    });
    // on reste synchronisé avec la lightbox si elle est ouverte
    if (lightbox.classList.contains('is-open')) renderLightbox();
  }

  // Skeleton : retire l'animation dès que l'image est prête
  if (mainImg) {
    const done = () => galleryMain && galleryMain.classList.add('is-loaded');
    if (mainImg.complete) done(); else mainImg.addEventListener('load', done);
    mainImg.addEventListener('error', done);
  }

  thumbEls.forEach((t, idx) => t.addEventListener('click', () => setImage(idx)));
  const prevBtn = $('#prevImg');
  const nextBtn = $('#nextImg');
  if (prevBtn) prevBtn.addEventListener('click', () => setImage(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => setImage(current + 1));

  /* ---------- Swipe tactile sur la galerie ---------- */
  let touchX = null;
  if (galleryMain) {
    galleryMain.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
    galleryMain.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 45) setImage(current + (dx < 0 ? 1 : -1));
      touchX = null;
    }, { passive: true });
  }

  /* =========================================================
     LIGHTBOX
     ========================================================= */
  const lightbox = $('#lightbox');
  const lbImg = $('#lbImg');
  const lbCaption = $('#lbCaption');

  function renderLightbox() {
    if (!lbImg) return;
    lbImg.src = IMAGES[current];
    lbImg.alt = ALTS[current];
    lbImg.style.objectPosition = FITS[current] || 'center center';
    if (lbCaption) lbCaption.textContent = ALTS[current] + '  ·  ' + (current + 1) + '/' + IMAGES.length;
  }
  function openLightbox() {
    renderLightbox();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('#lightboxClose').focus();
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  const zoomBtn = $('#zoomBtn');
  if (zoomBtn) zoomBtn.addEventListener('click', openLightbox);
  if (galleryMain) galleryMain.addEventListener('dblclick', openLightbox);
  $('#lightboxClose').addEventListener('click', closeLightbox);
  $('#lbPrev').addEventListener('click', () => setImage(current - 1));
  $('#lbNext').addEventListener('click', () => setImage(current + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  /* ---------- Clavier global ---------- */
  document.addEventListener('keydown', (e) => {
    const lbOpen = lightbox.classList.contains('is-open');
    const cartOpen = $('#cart').classList.contains('is-open');

    if (lbOpen) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') setImage(current - 1);
      if (e.key === 'ArrowRight') setImage(current + 1);
      return;
    }
    if (e.key === 'Escape' && cartOpen) closeCart();

    // Flèches sur la galerie seulement quand elle est au centre de l'écran
    const r = galleryMain && galleryMain.getBoundingClientRect();
    const inView = r && r.top < window.innerHeight * 0.7 && r.bottom > window.innerHeight * 0.3;
    if (inView && !(document.activeElement instanceof HTMLInputElement)) {
      if (e.key === 'ArrowLeft') setImage(current - 1);
      if (e.key === 'ArrowRight') setImage(current + 1);
    }
  });

  /* =========================================================
     VARIANTES / QUANTITÉ / BUNDLES
     ========================================================= */
  const colorLabel = $('#colorLabel');
  const qtyInput = $('#qtyInput');
  const btnPrice = $('#btnPrice');
  const priceNow = $('#priceNow');

  $$('.swatch').forEach((sw) => {
    sw.addEventListener('click', () => {
      $$('.swatch').forEach((s) => s.classList.remove('is-active'));
      sw.classList.add('is-active');
      state.color = sw.dataset.name;
      state.emoji = sw.dataset.emoji;
      if (colorLabel) colorLabel.textContent = state.color;
    });
  });

  /* Prix UNITAIRE : le panier multiplie ensuite par la quantité.
     Un bundle 69,90 € pour 2 = 34,95 € pièce. */
  function currentUnitPrice() {
    return state.bundle ? BUNDLES[state.bundle] / state.bundle : UNIT_PRICE;
  }
  /* Prix TOTAL affiché (CEA/PUI à l'écran) */
  function currentPrice() {
    return currentUnitPrice() * state.qty;
  }

  function refreshPrice() {
    const p = currentPrice();
    if (btnPrice) btnPrice.textContent = eur(p);
    if (priceNow) priceNow.textContent = eur(UNIT_PRICE);
    if (qtyInput) qtyInput.value = state.qty;
    const mp = $('#mbarPrice');
    if (mp) mp.textContent = eur(p);
  }

  function setQty(n) {
    state.qty = Math.max(1, Math.min(10, n));
    state.bundle = 0; // changer la quantité à la main annule le bundle
    $$('.bundle').forEach((b) => b.classList.remove('is-active'));
    refreshPrice();
  }

  const qtyMinus = $('#qtyMinus');
  const qtyPlus = $('#qtyPlus');
  if (qtyMinus) qtyMinus.addEventListener('click', () => setQty(state.qty - 1));
  if (qtyPlus) qtyPlus.addEventListener('click', () => setQty(state.qty + 1));
  if (qtyInput) qtyInput.addEventListener('change', () => setQty(parseInt(qtyInput.value, 10) || 1));

  $$('.bundle').forEach((b) => {
    b.addEventListener('click', () => {
      $$('.bundle').forEach((x) => x.classList.remove('is-active'));
      b.classList.add('is-active');
      state.bundle = parseInt(b.dataset.qty, 10);
      state.qty = state.bundle;
      refreshPrice();
    });
  });

  refreshPrice();

  /* =========================================================
     PANIER
     ========================================================= */
  const cart = $('#cart');
  const overlay = $('#overlay');
  const cartItems = $('#cartItems');
  const cartEmpty = $('#cartEmpty');
  const cartFoot = $('#cartFoot');
  const cartCount = $('#cartCount');

  function openCart() {
    cart.classList.add('is-open');
    overlay.classList.add('is-open');
    cart.setAttribute('aria-hidden', 'false');
  }
  function closeCart() {
    cart.classList.remove('is-open');
    overlay.classList.remove('is-open');
    cart.setAttribute('aria-hidden', 'true');
  }

  $('#openCart').addEventListener('click', openCart);
  $('#closeCart').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  $('#cartShop').addEventListener('click', closeCart);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });

  function cartTotals() {
    const sub = state.cart.reduce((s, it) => s + it.price * it.qty, 0);
    const ship = sub === 0 || sub >= FREE_SHIP ? 0 : SHIP_COST;
    return { sub, ship, total: sub + ship };
  }

  function renderCart() {
    const count = state.cart.reduce((s, it) => s + it.qty, 0);
    cartCount.textContent = count;

    cartItems.innerHTML = '';

    if (state.cart.length === 0) {
      cartEmpty.style.display = 'flex';
      cartFoot.style.display = 'none';
      cartItems.style.display = 'none';
    } else {
      cartEmpty.style.display = 'none';
      cartFoot.style.display = 'block';
      cartItems.style.display = 'grid';

      state.cart.forEach((it) => {
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML =
          '<div class="cart-item__thumb">' + it.emoji + '</div>' +
          '<div class="cart-item__info">' +
            '<b>' + it.name + '</b>' +
            '<small>' + it.color + '</small>' +
            '<div class="cart-item__qty">' +
              '<button data-act="minus" data-id="' + it.id + '">&minus;</button>' +
              '<span>' + it.qty + '</span>' +
              '<button data-act="plus" data-id="' + it.id + '">+</button>' +
            '</div>' +
          '</div>' +
          '<div class="cart-item__price">' + eur(it.price * it.qty) +
            (it.qty > 1 ? '<small class="cart-item__unit">' + eur(it.price) + ' × ' + it.qty + '</small>' : '') +
            '<div class="cart-item__remove" data-act="remove" data-id="' + it.id + '">Retirer</div>' +
          '</div>';
        cartItems.appendChild(el);
      });
    }

    const t = cartTotals();
    $('#cartSubtotal').textContent = eur(t.sub);
    $('#cartShipping').textContent = t.ship === 0 ? 'Offerte 🎉' : eur(t.ship);
    $('#cartTotal').textContent = eur(t.total);

    const shipMsg = $('#cartShip');
    const shipBar = $('#cartShipBar');
    const shipWrap = document.querySelector('.cart__shipbar');
    const pct = Math.min(100, (t.sub / FREE_SHIP) * 100);
    if (shipBar) shipBar.style.width = pct + '%';
    if (shipWrap) shipWrap.classList.toggle('is-full', t.sub >= FREE_SHIP);

    if (t.sub >= FREE_SHIP) {
      shipMsg.innerHTML = '🎉 Livraison <b>offerte</b> débloquée !';
    } else {
      shipMsg.innerHTML = '🚚 Plus que <b>' + eur(FREE_SHIP - t.sub) + '</b> pour la livraison offerte';
    }
  }

  cartItems.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const id = btn.dataset.id;
    const act = btn.dataset.act;
    const item = state.cart.find((i) => i.id === id);
    if (!item) return;
    if (act === 'plus') item.qty = Math.min(10, item.qty + 1);
    if (act === 'minus') item.qty -= 1;
    if (act === 'remove') item.qty = 0;
    state.cart = state.cart.filter((i) => i.qty > 0);
    renderCart();
  });

  /* ---------- Ajout au panier ---------- */
  $('#addToCart').addEventListener('click', () => {
    const unit = currentUnitPrice();      // prix PAR PIÈCE (le panier va multiplier)
    const name = 'Balaclava Lego Minifigure';
    const existing = state.cart.find((i) => i.color === state.color && i.price === unit);
    if (existing) {
      existing.qty = Math.min(10, existing.qty + state.qty);
    } else {
      state.cart.push({
        id: 'id-' + Date.now(),
        name: name,
        color: state.color,
        emoji: state.emoji,
        price: unit,
        qty: state.qty
      });
    }
    renderCart();
    openCart();
    fireConfetti();
    showToast('🎉 Ajouté au panier ! La hype est là.');
  });

  $('#checkout').addEventListener('click', () => {
    const t = cartTotals();
    showToast('🔒 Démo : commande simulée de ' + eur(t.total) + '. Merci ! 🧱');
    fireConfetti(90);
  });


  /* =========================================================
     TOAST
     ========================================================= */
  let toastTimer;
  function showToast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-show'), 2600);
  }

  /* =========================================================
     CONFETTIS
     ========================================================= */
  const canvas = $('#confetti');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let confettiRunning = false;

  function sizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);

  function fireConfetti(amount) {
    const colors = ['#FFCF00', '#FF2D2D', '#2D7BFF', '#9BE564', '#C77DFF', '#0E0E0E'];
    const n = amount || 60;
    for (let i = 0; i < n; i++) {
      particles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 160,
        y: window.innerHeight * 0.35,
        vx: (Math.random() - 0.5) * 11,
        vy: Math.random() * -13 - 4,
        size: Math.random() * 9 + 5,
        color: colors[(Math.random() * colors.length) | 0],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        life: 1
      });
    }
    if (!confettiRunning) { confettiRunning = true; requestAnimationFrame(animateConfetti); }
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.vy += 0.4;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 0.012;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    particles = particles.filter((p) => p.life > 0 && p.y < canvas.height + 40);
    if (particles.length > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      confettiRunning = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  /* =========================================================
     COMPTE À REBOURS
     ========================================================= */
  let deadline = Date.now() + (4 * 3600 + 12 * 60 + 45) * 1000;
  function tickCountdown() {
    const diff = Math.max(0, deadline - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = (n) => String(n).padStart(2, '0');
    const H = $('#cdH'), M = $('#cdM'), S = $('#cdS');
    if (H) H.textContent = pad(h);
    if (M) M.textContent = pad(m);
    if (S) S.textContent = pad(s);
    if (diff === 0) deadline = Date.now() + 4 * 3600 * 1000;
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* =========================================================
     MICRO-INTERACTIONS "VIVANTES"
     ========================================================= */
  const live = $('#liveViewers');
  if (live) {
    setInterval(() => {
      const n = 12 + Math.floor(Math.random() * 24);
      live.innerHTML = '👀 <b>' + n + ' personnes</b> regardent ce produit en ce moment';
    }, 4000);
  }

  const stockNum = $('#stockNum');
  if (stockNum) {
    let stock = 41;
    setInterval(() => {
      if (Math.random() < 0.35 && stock > 6) {
        stock -= 1;
        stockNum.textContent = stock;
      }
    }, 9000);
  }

  /* ---------- Newsletter ---------- */
  const newsForm = $('#newsForm');
  if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsForm.reset();
      showToast('😜 Bienvenue dans le club ! Code -10% envoyé.');
      fireConfetti(40);
    });
  }

  /* =========================================================
     SCROLL : progression, nav, retour en haut, barre mobile
     ========================================================= */
  const nav = $('#nav');
  const navBar = $('#navProgress');
  const toTop = $('#toTop');
  const mbar = $('#mbar');
  const buyBox = $('.buybox');
  const addToCartBtn = $('#addToCart');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (y / max) * 100 : 0;

    if (navBar) navBar.firstElementChild.style.width = pct.toFixed(2) + '%';
    if (nav) nav.classList.toggle('is-stuck', y > 10);
    if (toTop) toTop.classList.toggle('is-visible', y > 700);

    // Barre mobile : visible seulement une fois le buybox dépassé
    if (mbar && buyBox) {
      const past = buyBox.getBoundingClientRect().bottom < 0;
      const nearFooter = (window.innerHeight + y) > (max - 40);
      mbar.classList.toggle('is-visible', past && !nearFooter);
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', onScroll);

  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  if (mbar) $('#mbarAdd').addEventListener('click', () => addToCartBtn.click());

  /* =========================================================
     RÉVÉLATIONS AU SCROLL (staggered)
     ========================================================= */
  const revealTargets = [
    '.trust', '.fcard', '.dcard', '.review',
    '.faq__item', '.lifestyle__copy', '.lifestyle__img', '.section__head',
    '.ecard', '.mcard', '.stat', '.impact__img', '.pack__grid'
  ];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach((sel) => {
      $$(sel).forEach((el) => { el.classList.add('reveal'); io.observe(el); });
    });
  }

  /* =========================================================
     CARTES EXPRESSIONS -> GALERIE · PACK -> BUNDLE
     ========================================================= */
  function scrollToProduct() {
    const target = $('#produit');
    if (target && typeof target.scrollIntoView === 'function') target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  $$('.ecard').forEach((card) => {
    card.addEventListener('click', () => {
      const i = parseInt(card.dataset.goto, 10);
      if (!Number.isNaN(i)) setImage(i);
      scrollToProduct();
    });
  });

  const packBundle = $('#packBundle');
  if (packBundle) {
    packBundle.addEventListener('click', () => {
      const duo = $$('.bundle')[1];
      if (duo) duo.click();
      scrollToProduct();
      showToast('😈 Pack duo sélectionné · 2 bonnets pour 69,90 €');
    });
  }

  /* ---------- Init ---------- */
  renderCart();
  setImage(0);
  onScroll();
})();

