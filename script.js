/* BRICKFACE — packs, composition, gallery and persistent demo cart. */
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const PACKS = {2:{name:'Duo',price:6990},3:{name:'Trio',price:9990},4:{name:'Quatro',price:12990}};
  const UNIT_PRICE = 3990;
  const STORAGE_KEY = 'brickface-cart-v2';
  const money = (cents) => (cents / 100).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2}) + ' €';
  const EXPRESSIONS = ['Sourire','Langue','Colère','Surprise'];
  const IMAGES = [
    {file:'01-produit-sourire',caption:'Sourire — la bonne humeur en version tricot.'},
    {file:'02-produit-langue',caption:'Langue — un peu de sérieux, beaucoup de second degré.'},
    {file:'03-produit-colere',caption:'Colère — la tête du râleur préféré de la bande.'},
    {file:'04-produit-surprise',caption:'Surprise — le visage qui dit tout.'},
    {file:'05-ski-portrait',caption:'Au grand air — le portrait en montagne.'},
    {file:'06-ski-action',caption:'En mode piste — du jaune sur la neige.'},
    {file:'07-marketing-impact',caption:'BRICKFACE — le visuel de campagne.'},
    {file:'08-marketing-collection',caption:'La collection — des têtes à réunir.'},
    {file:'09-reference-sourire-blanc',caption:'Détail de référence — sourire blanc.'},
    {file:'10-reference-sourire-simple',caption:'Détail de référence — sourire simple.'},
    {file:'11-reference-dents-quadrillees',caption:'Détail de référence — dents quadrillées.'},
    {file:'pack-duo-ski-v3',extension:'webp',caption:'Pack Duo — deux amis au ski. Visuel de campagne créé par IA.'},
    {file:'pack-trio-ski-v3',extension:'webp',caption:'Pack Trio — trois amis au ski. Visuel de campagne créé par IA.'},
    {file:'pack-quatro-ski-v3',extension:'webp',caption:'Pack Quatro — quatre amis au ski. Visuel de campagne créé par IA.'}
  ];
  const imageSrc = (index,thumb=false) => 'assets/' + (thumb ? 'thumbs/' : '') + IMAGES[index].file + '.' + (IMAGES[index].extension || 'jpg');
  const state = {pack:2,quantity:1,expressions:[0,1,2,3],cart:[]};
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(saved)) state.cart = saved.filter((item) => item && PACKS[item.pack] && Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 10 && Array.isArray(item.expressions) && item.expressions.length === Number(item.pack) && item.expressions.every(i => Number.isInteger(i) && i >= 0 && i < 4)).slice(0,30).map(item => ({pack:Number(item.pack),quantity:item.quantity,expressions:item.expressions}));
  } catch (_) { /* A blocked or malformed storage does not prevent shopping. */ }
  const saveCart = () => {try {localStorage.setItem(STORAGE_KEY,JSON.stringify(state.cart));} catch (_) {}};
  let currentImage = 0;
  let viewerImage = 0;
  let activeDialog = null;
  let returnFocus = null;
  let toastTimer;
  const backgrounds = ['.announcement','header','main','footer','.mobilebar','.skip-link'];
  function notify(message) {
    $('#toast').textContent=message;
    $('#toast').classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>$('#toast').classList.remove('is-visible'),3500);
  }
  function openDialog(dialog,firstFocus) {
    if (activeDialog) closeDialog(false);
    returnFocus=document.activeElement;
    activeDialog=dialog;
    dialog.hidden=false;
    dialog.inert=false;
    dialog.setAttribute('aria-hidden','false');
    if (dialog.id==='cart') {dialog.classList.add('is-open');$('#overlay').hidden=false;}
    backgrounds.forEach(s=>$$(s).forEach(el=>el.inert=true));
    document.body.style.overflow='hidden';
    requestAnimationFrame(() => { if (activeDialog === dialog) firstFocus.focus(); });
  }
  function closeDialog(restore=true) {
    if (!activeDialog) return;
    const dialog=activeDialog;
    dialog.setAttribute('aria-hidden','true');
    if (dialog.id==='cart') {dialog.classList.remove('is-open');dialog.inert=true;$('#overlay').hidden=true;}
    else dialog.hidden=true;
    backgrounds.forEach(s=>$$(s).forEach(el=>el.inert=false));
    document.body.style.overflow='';
    activeDialog=null;
    if (restore && returnFocus && returnFocus.isConnected) returnFocus.focus();
  }
  function setImage(index) {
    currentImage=(index+8)%8;
    const photo=IMAGES[currentImage];
    $('#mainImg').src=imageSrc(currentImage);
    $('#mainImg').alt=photo.caption;
    $('#imageCaption').textContent=photo.caption;
    $('#imageCounter').textContent=String(currentImage+1).padStart(2,'0')+' / 08';
    $$('.gallery-thumb').forEach((button,i)=>{
      button.classList.toggle('is-active',i===currentImage);
      button.setAttribute('aria-pressed',String(i===currentImage));
    });
  }
  function renderViewer() {
    $('#lbImg').src=imageSrc(viewerImage);
    $('#lbImg').alt=IMAGES[viewerImage].caption;
    $('#lbCaption').textContent=IMAGES[viewerImage].caption+' · '+(viewerImage+1)+' / '+IMAGES.length;
  }
  function openViewer(index) {viewerImage=index;renderViewer();openDialog($('#lightbox'),$('#lightboxClose'));}
  function stepViewer(delta) {viewerImage=(viewerImage+delta+IMAGES.length)%IMAGES.length;renderViewer();}
  $$('.gallery-thumb').forEach(button=>button.addEventListener('click',()=>setImage(Number(button.dataset.image))));
  $('#prevImg').addEventListener('click',()=>setImage(currentImage-1));
  $('#nextImg').addEventListener('click',()=>setImage(currentImage+1));
  $('#zoomBtn').addEventListener('click',()=>openViewer(currentImage));
  $$('.gallery__main').forEach(el=>el.addEventListener('dblclick',()=>openViewer(currentImage)));
  $$('[data-preview]').forEach(button=>button.addEventListener('click',()=>openViewer(Number(button.dataset.preview))));
  $$('[data-pack-preview]').forEach(button=>button.addEventListener('click',()=>openViewer(Number(button.dataset.packPreview))));
  $$('[data-detail]').forEach(button=>button.addEventListener('click',()=>openViewer(Number(button.dataset.detail)+8)));
  $('#lightboxClose').addEventListener('click',()=>closeDialog());
  $('#lbPrev').addEventListener('click',()=>stepViewer(-1));
  $('#lbNext').addEventListener('click',()=>stepViewer(1));
  $('#lightbox').addEventListener('click',e=>{if(e.target===$('#lightbox'))closeDialog();});
  let touchStart=null;
  $('.gallery__main').addEventListener('touchstart',e=>{touchStart=e.changedTouches[0].clientX;},{passive:true});
  $('.gallery__main').addEventListener('touchend',e=>{
    if (touchStart===null) return;
    const delta=e.changedTouches[0].clientX-touchStart;
    if (Math.abs(delta)>45) setImage(currentImage+(delta<0 ? 1 : -1));
    touchStart=null;
  },{passive:true});
  function renderSlots() {
    const wrap=$('#expressionSlots');
    wrap.replaceChildren();
    for (let i=0;i<state.pack;i++) {
      const slot=document.createElement('div');slot.className='expression-slot';
      const img=document.createElement('img');img.src=imageSrc(state.expressions[i],true);img.alt='';img.width=46;img.height=46;
      const field=document.createElement('div');
      const label=document.createElement('label');label.htmlFor='expression-'+i;label.textContent='BONNET '+String(i+1).padStart(2,'0');
      const select=document.createElement('select');select.id=label.htmlFor;select.dataset.slot=i;
      EXPRESSIONS.forEach((name,j)=>{const option=document.createElement('option');option.value=j;option.textContent=name;option.selected=state.expressions[i]===j;select.append(option);});
      select.addEventListener('change',()=>{const choice=Number(select.value);state.expressions[i]=choice;img.src=imageSrc(choice,true);setImage(choice);});
      field.append(label,select);slot.append(img,field);wrap.append(slot);
    }
  }
  function refreshPrice() {
    const pack=PACKS[state.pack];const total=pack.price*state.quantity;
    $('#priceNow').textContent=money(total);
    $('#priceOld').textContent=money(UNIT_PRICE*state.pack*state.quantity);
    $('#priceSaving').textContent='Économie : '+money((UNIT_PRICE*state.pack-pack.price)*state.quantity);
    $('#addToCart').replaceChildren(document.createTextNode('Ajouter '+(state.quantity===1?'mon ':'mes ')+pack.name+' · '));
    const price=document.createElement('span');price.id='btnPrice';price.textContent=money(total);
    const arrow=document.createElement('span');arrow.textContent='↗';$('#addToCart').append(price,arrow);
    $('#qtyInput').value=state.quantity;
    $('#pieceLabel').textContent=state.pack+' bonnets au choix';
    $('#mobilePack').textContent='Pack '+pack.name+' · '+(state.pack*state.quantity)+' bonnets';
    $('#mobilePrice').textContent=money(total);
    $$('[data-pack]').forEach(button=>{const active=Number(button.dataset.pack)===state.pack;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
  }
  function selectPack(pack) {state.pack=pack;renderSlots();refreshPrice();}
  function compose(pack) {state.quantity=1;selectPack(pack);$('#produit').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
  $$('[data-pack]').forEach(button=>button.addEventListener('click',()=>selectPack(Number(button.dataset.pack))));
  $$('[data-select-pack]').forEach(button=>button.addEventListener('click',()=>compose(Number(button.dataset.selectPack))));
  function setQuantity(n) {state.quantity=Math.max(1,Math.min(10,Math.trunc(Number(n)||1)));refreshPrice();}
  $('#qtyMinus').addEventListener('click',()=>setQuantity(state.quantity-1));
  $('#qtyPlus').addEventListener('click',()=>setQuantity(state.quantity+1));
  $('#qtyInput').addEventListener('input',()=>{if ($('#qtyInput').value !== '') setQuantity($('#qtyInput').value);});
  $('#qtyInput').addEventListener('change',()=>setQuantity($('#qtyInput').value));
  function cartKey(item) {return item.pack+':'+item.expressions.join(',');}
  function renderCart() {
    const count=state.cart.reduce((sum,item)=>sum+item.pack*item.quantity,0);
    const subtotal=state.cart.reduce((sum,item)=>sum+PACKS[item.pack].price*item.quantity,0);
    $('#cartCount').textContent=count;
    $('#openCart').setAttribute('aria-label','Ouvrir le panier, '+count+' bonnet'+(count!==1?'s':''));
    $('#cartEmpty').hidden=state.cart.length>0;
    $('#cartFoot').hidden=state.cart.length===0;
    $('#cartItems').hidden=state.cart.length===0;
    $('#cartItems').replaceChildren();
    state.cart.forEach((item,index)=>{
      const pack=PACKS[item.pack];
      const row=document.createElement('article');row.className='cart-item';
      row.innerHTML='<div class="cart-item__head"><img src="'+imageSrc(item.expressions[0],true)+'" alt="" width="62" height="70" /><div><h3 class="cart-item__name">Pack '+pack.name+' · '+item.pack+' bonnets</h3><p class="cart-item__summary">'+item.expressions.map(i=>EXPRESSIONS[i]).join(' / ')+'</p></div><div class="cart-item__price">'+money(pack.price*item.quantity)+'<small>'+money(pack.price)+' / pack</small></div></div><div class="cart-item__actions"><div class="cart-item__qty"><button data-action="minus" data-index="'+index+'" aria-label="Retirer un pack '+pack.name+'">−</button><span>'+item.quantity+' pack'+(item.quantity>1?'s':'')+'</span><button data-action="plus" data-index="'+index+'" aria-label="Ajouter un pack '+pack.name+'" '+(item.quantity===10?'disabled':'')+'>+</button></div><button class="remove-item" data-action="remove" data-index="'+index+'" aria-label="Supprimer ce pack '+pack.name+'">Retirer</button></div>';
      $('#cartItems').append(row);
    });
    $('#cartSubtotal').textContent=money(subtotal);
    $('#cartShipping').textContent=subtotal?'Offerte':'—';
    $('#cartTotal').textContent=money(subtotal);
    saveCart();
  }
  $('#openCart').addEventListener('click',()=>openDialog($('#cart'),$('#closeCart')));
  $('#closeCart').addEventListener('click',()=>closeDialog());
  $('#overlay').addEventListener('click',()=>closeDialog());
  $('#cartShop').addEventListener('click',()=>{closeDialog();$('#packs').scrollIntoView({behavior:'smooth'});});
  $('#addToCart').addEventListener('click',()=>{
    const item={pack:state.pack,quantity:state.quantity,expressions:state.expressions.slice(0,state.pack)};
    const existing=state.cart.find(entry=>cartKey(entry)===cartKey(item));
    if (existing && existing.quantity+item.quantity>10) {notify('Maximum : 10 exemplaires de ce pack.');return;}
    if (!existing && state.cart.length>=30) {notify('Ton panier contient déjà 30 compositions différentes.');return;}
    if(existing)existing.quantity+=item.quantity;else state.cart.push(item);
    renderCart();openDialog($('#cart'),$('#closeCart'));notify('Pack '+PACKS[item.pack].name+' ajouté à ta bande.');
  });
  $('#cartItems').addEventListener('click',e=>{
    const button=e.target.closest('[data-action]');if(!button)return;
    const index=Number(button.dataset.index);const item=state.cart[index];if(!item)return;
    if(button.dataset.action==='plus')item.quantity=Math.min(10,item.quantity+1);
    if(button.dataset.action==='minus')item.quantity--;
    if(button.dataset.action==='remove')item.quantity=0;
    const removed=item.quantity<1;
    state.cart=state.cart.filter(entry=>entry.quantity>0);renderCart();
    const next=$('#cartItems').querySelector('[data-index="'+Math.min(index,state.cart.length-1)+'"][data-action="'+(removed?'minus':button.dataset.action)+'"]');
    if(next)next.focus();else $('#closeCart').focus();
  });
  $('#checkout').addEventListener('click',()=>{
    const total=state.cart.reduce((sum,item)=>sum+PACKS[item.pack].price*item.quantity,0);
    notify('Commande simulée : '+money(total)+'. Aucun paiement ni commande réelle.');
  });
  document.addEventListener('keydown',e=>{
    if(!activeDialog)return;
    if(e.key==='Escape'){e.preventDefault();closeDialog();return;}
    if(activeDialog.id==='lightbox'){
      if(e.key==='ArrowLeft'){e.preventDefault();stepViewer(-1);}
      if(e.key==='ArrowRight'){e.preventDefault();stepViewer(1);}
    }
    if(e.key==='Tab'){
      const focusable=Array.from(activeDialog.querySelectorAll('button:not([disabled]),a[href],input,select,[tabindex="0"]')).filter(el=>el.getClientRects().length>0);
      const first=focusable[0],last=focusable[focusable.length-1];
      if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  function updateMobilebar() {
    const pastPacks=$('#packs').getBoundingClientRect().bottom<0;
    const buy=$('#addToCart').getBoundingClientRect();
    const buyVisible=buy.top>=0 && buy.bottom<=window.innerHeight;
    const footerVisible=$('footer').getBoundingClientRect().top<window.innerHeight;
    $('#mobilebar').hidden=window.innerWidth>760 || !pastPacks || buyVisible || footerVisible;
  }
  let scrollQueued=false;
  window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(()=>{updateMobilebar();scrollQueued=false;});}},{passive:true});
  window.addEventListener('resize',updateMobilebar);
  $('#mobileCompose').addEventListener('click',()=>compose(state.pack));
  renderSlots();refreshPrice();renderCart();updateMobilebar();
})();
