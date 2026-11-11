'use strict';
const dishes = [
  { id:'borscht', name:'Борщ со сметаной', category:'soup', label:'На первое', weight:'300 г', price:160, description:'Наваристый, со свёклой и свежей зеленью.', ingredients:'Свёкла, капуста, картофель, морковь, говядина, томаты, сметана, зелень.', allergens:'Молоко и продукты его переработки.', photo:'borscht', badge:'ЛЮБИМАЯ КЛАССИКА' },
  { id:'cutlet', name:'Котлета с пюре', category:'main', label:'На горячее', weight:'280 г', price:240, description:'Куриная котлета и нежное картофельное пюре.', ingredients:'Куриное филе, картофель, молоко, сливочное масло, лук, пшеничный хлеб, яйцо.', allergens:'Молоко, пшеница (глютен), яйцо.', photo:'main', badge:'ТОТ САМЫЙ ВКУС' },
  { id:'salad', name:'Салат «Свежесть»', category:'salad', label:'Полегче', weight:'150 г', price:110, description:'Хрустящая капуста, огурец и укроп.', ingredients:'Белокочанная капуста, огурец, укроп, растительное масло, лимонный сок.', allergens:'Состав и возможные следы аллергенов уточняйте перед заказом.', photo:'salad', badge:'БЕЗ МЯСА' },
  { id:'syrniki', name:'Сырники с вареньем', category:'sweet', label:'Для настроения', weight:'180 г', price:210, description:'Румяные, со сметаной и ягодным вареньем.', ingredients:'Творог, пшеничная мука, яйцо, сахар, сметана, ягодное варенье.', allergens:'Молоко, пшеница (глютен), яйцо.', photo:'sweet', badge:'МОЖНО И НА ОБЕД' },
  { id:'buckwheat', name:'Гречка с овощами', category:'main', label:'Гарнир', weight:'180 г', price:90, description:'Рассыпчатая гречка с морковью и луком.', ingredients:'Гречневая крупа, морковь, лук, растительное масло.', allergens:'Возможные следы аллергенов уточняйте перед заказом.' },
  { id:'noodles', name:'Куриная лапша', category:'soup', label:'На первое', weight:'300 г', price:140, description:'Лёгкий бульон, курица и домашняя лапша.', ingredients:'Курица, пшеничная лапша, яйцо, морковь, лук, зелень.', allergens:'Пшеница (глютен), яйцо.' },
  { id:'mors', name:'Ягодный морс', category:'drink', label:'Запить вкусное', weight:'250 мл', price:70, description:'Клюквенный, с приятной ягодной кислинкой.', ingredients:'Клюква, вода, сахар.', allergens:'Состав уточняйте перед заказом.' },
  { id:'napoleon', name:'Наполеон', category:'sweet', label:'К чаю', weight:'120 г', price:190, description:'Тонкие слои теста и нежный заварной крем.', ingredients:'Пшеничная мука, сливочное масло, молоко, яйцо, сахар.', allergens:'Молоко, пшеница (глютен), яйцо.' }
];
const money = n => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
let cart = {}, category = 'all', format = 'takeaway', toastTimer;
try { const saved = JSON.parse(localStorage.getItem('vkus-dnya-concept-cart') || '{}'); for(const item of dishes){const n=saved?.[item.id]; if(Number.isInteger(n)&&n>0&&n<=20) cart[item.id]=n;} } catch {}
const total = () => dishes.reduce((sum,d)=>sum+d.price*(cart[d.id]||0),0);
const count = () => Object.values(cart).reduce((sum,n)=>sum+n,0);
function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2400);}
function renderMenu(){
  const filtered=dishes.filter(d=>category==='all'||d.category===category);
  $('#menu-grid').innerHTML=filtered.map(d=>`<article class="menu-card ${d.photo?'':'compact'}">${d.photo?`<button class="dish-photo-button" data-dish="${d.id}" aria-label="Подробнее: ${d.name}"><span class="dish-photo dish-photo-${d.photo}" role="img" aria-label="Визуализация блюда ${d.name}"></span><span class="dish-badge">${d.badge}</span></button>`:''}<div class="dish-info"><div class="dish-meta">${d.label} · ${d.weight}</div><h3><button class="dish-title" data-dish="${d.id}">${d.name}</button></h3><p class="dish-description">${d.description}</p><div class="dish-bottom"><span class="dish-price">${d.price} <small>₽</small></span><button class="dish-add ${cart[d.id]?'has-items':''}" data-add="${d.id}" aria-label="Добавить ${d.name}${cart[d.id]?`, в обеде ${cart[d.id]}`:''}">+</button></div></div></article>`).join('');
  $('#menu-grid').setAttribute('aria-labelledby',`tab-${category}`);
}
function updateCart(){
  try{localStorage.setItem('vkus-dnya-concept-cart',JSON.stringify(cart));}catch{}
  $$('.cart-count').forEach(el=>el.textContent=count());
  $('#floating-total').textContent=money(total());
  $('.floating-cart').hidden=!count();
  $$('[data-add]').forEach(el=>{const d=dishes.find(x=>x.id===el.dataset.add);el.classList.toggle('has-items',!!cart[d.id]);el.setAttribute('aria-label',`Добавить ${d.name}${cart[d.id]?`, в обеде ${cart[d.id]}`:''}`);});
  renderCart();
}
function addDish(id){const d=dishes.find(d=>d.id===id);if(!d)return;if((cart[id]||0)>=20){toast('В макете можно добавить до 20 порций блюда');return;}cart[id]=(cart[id]||0)+1;updateCart();toast(`${d.name} — в вашем обеде`);}
function renderCart(){
  $('#order-summary').hidden=true;
  $('#cart-items').hidden=false;
  $('#cart-details').hidden=!count();
  if(!count()){$('#cart-items').innerHTML='<div class="empty-cart"><span aria-hidden="true">✳</span><h3>Пока здесь только аппетит</h3><p>Добавьте что-нибудь вкусное из меню.<br>Мы посчитаем ваш обед.</p><button class="button button-dark" data-go-menu>Выбрать блюда <span aria-hidden="true">↗</span></button></div>';return;}
  $('#cart-items').innerHTML=dishes.filter(d=>cart[d.id]).map(d=>`<div class="cart-item"><div><h3>${d.name}</h3><p>${d.weight} · ${money(d.price)}</p></div><div><span class="cart-item-price">${money(d.price*cart[d.id])}</span><div class="quantity"><button data-change="${d.id}" data-delta="-1" aria-label="Убрать одну порцию ${d.name}">−</button><span aria-label="Количество порций">${cart[d.id]}</span><button data-change="${d.id}" data-delta="1" aria-label="Добавить одну порцию ${d.name}">+</button></div></div></div>`).join('');
  $('#cart-total').textContent=money(total());
}
function openDialog(name){
  const dialog=$(`#${name}-dialog`);if(!dialog)return;
  if(name==='cart')renderCart();
  dialog.showModal();document.body.classList.add('dialog-open');
}
function closeDialog(dialog){dialog.close();if(!$$('dialog[open]').length)document.body.classList.remove('dialog-open');}
function showDish(id){const d=dishes.find(d=>d.id===id);if(!d)return;$('#dish-content').innerHTML=`${d.photo?`<div class="dish-photo dish-photo-${d.photo} dish-modal-photo" role="img" aria-label="Иллюстрация блюда ${d.name}"></div>`:''}<span class="eyebrow">ПРИМЕР БЛЮДА · ${d.weight}</span><h2 class="dish-modal-heading">${d.name}</h2><p class="dish-modal-desc">${d.description}</p><div class="dish-modal-ingredients"><strong>Примерный состав</strong>${d.ingredients}<br><br><strong>Аллергены</strong>${d.allergens}</div><button class="button button-dark full-width" data-add="${d.id}"><span style="font-size:13px;line-height:1.3">Добавить в обед</span><span style="font-size:18px;line-height:1.3">${money(d.price)} +</span></button><p class="demo-note">Блюдо, состав и цена — демонстрационные. Для реального заказа уточните меню в столовой.</p>`;openDialog('dish');}
async function copyText(value){try{await navigator.clipboard.writeText(value);toast('Скопировано — можно отправить сообщением');return true;}catch{const textarea=document.createElement('textarea');textarea.value=value;textarea.setAttribute('readonly','');textarea.style.cssText='position:fixed;left:-9999px;top:0';const parent=$('dialog[open]')||document.body;parent.append(textarea);textarea.select();let copied=false;try{copied=document.execCommand('copy');}catch{}textarea.remove();toast(copied?'Скопировано':'Выделите текст запроса и скопируйте вручную');return copied;}}
document.addEventListener('click',e=>{
  const button=e.target.closest('button');
  if(button?.dataset.open)openDialog(button.dataset.open);
  if(button?.hasAttribute('data-close'))closeDialog(button.closest('dialog'));
  if(button?.dataset.add)addDish(button.dataset.add);
  if(button?.dataset.dish)showDish(button.dataset.dish);
  if(button?.dataset.change){const id=button.dataset.change;const delta=Number(button.dataset.delta);if(delta>0){addDish(id);}else{cart[id]=Math.max(0,(cart[id]||0)-1);if(!cart[id])delete cart[id];updateCart();}const fallback=$(`[data-change="${id}"][data-delta="${delta}"]`)||$('#cart-items [data-go-menu]')||$('#checkout');if(fallback)fallback.focus();}
  if(button?.hasAttribute('data-go-menu')){closeDialog(button.closest('dialog'));$('#menu').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});setTimeout(()=>$('#tab-all').focus({preventScroll:true}),200);}
  if(button?.dataset.category){category=button.dataset.category;$$('[data-category]').forEach(el=>{const selected=el===button;el.setAttribute('aria-selected',selected);el.tabIndex=selected?0:-1;});renderMenu();}
  if(button?.dataset.format){format=button.dataset.format;$$('[data-format]').forEach(el=>{const selected=el===button;el.classList.toggle('selected',selected);el.setAttribute('aria-pressed',selected);});}
});
$$('dialog').forEach(dialog=>{dialog.addEventListener('close',()=>{if(!$$('dialog[open]').length)document.body.classList.remove('dialog-open');});dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(dialog);});});
$('.tabs').addEventListener('keydown',e=>{const tabs=$$('[data-category]');let i=tabs.indexOf(document.activeElement);if(i<0)return;if(e.key==='ArrowRight')i=(i+1)%tabs.length;else if(e.key==='ArrowLeft')i=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=tabs.length-1;else return;e.preventDefault();tabs[i].click();tabs[i].focus();});
$('#checkout').addEventListener('click',()=>{
  if(!count())return;
  const text=`Демонстрационный обед · «Вкус дня»\n\n${dishes.filter(d=>cart[d.id]).map(d=>`${d.name} × ${cart[d.id]} — ${money(d.price*cart[d.id])}`).join('\n')}\n\nИтого по примерным ценам: ${money(total())}\nФормат: ${format==='takeaway'?'с собой':'в столовой'}\nПланируемое время: ${$('#pickup-time').value}\n\nЭто пример, заказ не отправлен. Меню и цены требуют подтверждения.`;
  $('#cart-items').hidden=true;$('#cart-details').hidden=true;const summary=$('#order-summary');summary.hidden=false;summary.innerHTML='<span class="summary-icon" aria-hidden="true">✳</span><h3 class="summary-title">Вот ваш обед.</h3><p class="summary-copy">Так гость увидит итог перед подтверждением. В этом макете заказ остаётся только на экране.</p><div class="summary-receipt"></div><button class="button button-dark full-width" id="copy-order">Скопировать пример <span aria-hidden="true">↗</span></button><button class="summary-back" id="back-cart">Изменить обед</button>';
  summary.querySelector('.summary-receipt').textContent=text;$('#copy-order').onclick=()=>copyText(text);$('#back-cart').onclick=renderCart;$('#copy-order').focus();
});
$('#group-form input[name="date"]').min=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Moscow',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
$('#group-form').addEventListener('submit',e=>{
  e.preventDefault();const data=new FormData(e.currentTarget);const date=String(data.get('date')).split('-').reverse().join('.');
  const text=`Здравствуйте! Хотелось бы обсудить встречу во «Вкусе дня».\n\nФормат: ${data.get('occasion')}\nГостей: ${data.get('guests')}\nЖелаемая дата: ${date}\nПожелания: ${String(data.get('notes')).trim()||'Обсудим при разговоре'}\n\nПодскажите, пожалуйста, возможен ли такой формат и какие условия?`;
  e.currentTarget.hidden=true;const result=$('#group-result');result.hidden=false;result.innerHTML='<span class="summary-icon" aria-hidden="true">✳</span><h3 class="summary-title">Запрос готов к обсуждению.</h3><p class="summary-copy">Ничего не отправлено. Скопируйте текст, чтобы использовать его при общении со столовой.</p><div class="summary-receipt"></div><button class="button button-dark full-width" id="copy-group">Скопировать запрос <span aria-hidden="true">↗</span></button><button class="summary-back" id="edit-group">Изменить детали</button>';
  result.querySelector('.summary-receipt').textContent=text;$('#copy-group').onclick=()=>copyText(text);$('#edit-group').onclick=()=>{result.hidden=true;$('#group-form').hidden=false;$('#group-form select').focus();};$('#copy-group').focus();
});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.09});$$('.reveal').forEach(el=>observer.observe(el));
window.addEventListener('scroll',()=>$('#header').classList.toggle('scrolled',window.scrollY>40),{passive:true});
renderMenu();updateCart();
