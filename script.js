const cars = [
  { id: 1, name: 'Argento 7F', type: 'sport', price: 6500, img: 'images/obey-argento-7f/car.jpg', desc: 'High-performance sports car with custom handling and sound. Features 37 mod parts and 26 livery options.', specs: { topSpeed: 'N/A', acceleration: 'N/A', handling: 'N/A', braking: 'N/A', class: 'N/A' } },
  { id: 2, name: 'COMET S1TF', type: 'sport', price: 6000, img: 'images/comet-s1tf/car.png', desc: 'Turbocharged sports machine with extensive customization. Includes 129 mod parts and custom sound system.', specs: { topSpeed: 'N/A', acceleration: 'N/A', handling: 'N/A', braking: 'N/A', class: 'N/A' } },
  { id: 3, name: 'Cypher GTS', type: 'sport', price: 6500, img: 'images/cypher-gts/car.jpg', desc: 'Performance-tuned sports car with custom sound and handling. Features 108 mod parts and 12 livery designs.', specs: { topSpeed: 'N/A', acceleration: 'N/A', handling: 'N/A', braking: 'N/A', class: 'N/A' } },
  { id: 4, name: 'Shinobi 1800R', type: 'bike', price: 8000, img: 'images/shinobi-1800r/car.png', desc: 'The ultimate performance motorcycle for those who demand extreme speed. Engineered for pure adrenaline and raw power on two wheels.', specs: { topSpeed: 'N/A', acceleration: 'N/A', handling: 'N/A', braking: 'N/A', class: 'N/A' } },
  { id: 5, name: 'Mochi', type: 'classic', price: 5500, img: 'images/mochi/car.jpg', desc: 'Sleek sports classic with refined styling. Equipped with 139 mod parts, custom handling, and 26 liveries.', specs: { topSpeed: 'N/A', acceleration: 'N/A', handling: 'N/A', braking: 'N/A', class: 'N/A' } },
  { id: 6, name: 'Romulus', type: 'sport', price: 5500, img: 'images/romulus/car.jpg', desc: 'Premium sports car featuring custom wheels and handling. Offers 256 mod parts for ultimate personalization.', specs: { topSpeed: 'N/A', acceleration: 'N/A', handling: 'N/A', braking: 'N/A', class: 'N/A' } },
  { id: 7, name: 'Rumina', type: 'classic', price: 5500, img: 'images/rumina/car.jpg', desc: 'Elegant sports classic with extensive customization options. Boasts 216 mod parts, custom handling, and wheels.', specs: { topSpeed: 'N/A', acceleration: 'N/A', handling: 'N/A', braking: 'N/A', class: 'N/A' } },
  { id: 8, name: 'Scout GSX', type: 'suv', price: 6000, img: 'images/scout-gsx/car.jpg', desc: 'Rugged off-road SUV with custom handling and wheels. Features 98 mod parts and 14 livery options.', specs: { topSpeed: 'N/A', acceleration: 'N/A', handling: 'N/A', braking: 'N/A', class: 'N/A' } }
];

const list = document.getElementById('list');
const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');
const sortSelect = document.getElementById('sortSelect');

const modal = document.getElementById('carModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');
const buyBtn = document.getElementById('buyBtn');

function formatPrice(n){
  return 'Vitcoins: ' + n.toLocaleString();
}

function renderList(items, animate = false){
  const existingRows = Array.from(list.querySelectorAll('.car-row'));
  const existingIds = new Set(existingRows.map(r => r.dataset.carId));
  const newIds = new Set(items.map(c => String(c.id)));

  if(animate && existingRows.length > 0){
    existingRows.forEach(row => {
      if(!newIds.has(row.dataset.carId)){
        row.classList.add('fade-out');
      }
    });
    setTimeout(() => {
      renderListActual(items);
    }, 400);
  } else {
    renderListActual(items);
  }
}

function renderListActual(items){
  list.innerHTML = '';
  if(!items.length){
    list.innerHTML = '<div class="empty">No cars found.</div>';
    return;
  }
  items.forEach((car, idx) => {
    const row = document.createElement('article');
    row.className = 'car-row' + (idx % 2 === 1 ? ' alt' : '');
    row.dataset.carId = car.id;
    row.innerHTML = `
      <div class="car-left"><img src="${car.img}" alt="${car.name}"></div>
      <div class="car-right">
        <h2 class="car-title">${car.name}</h2>
        <div class="car-price">${formatPrice(car.price)}</div>
        <p class="car-desc">${car.desc}</p>
        <div class="car-actions">
          <button class="btn btn-primary" data-id="${car.id}">BUY NOW</button>
          <button class="btn" data-view="${car.id}" style="margin-top:8px;background:transparent;border:1px solid rgba(0,0,0,0.08);">View details</button>
        </div>
      </div>
    `;
    list.appendChild(row);
  });
}

function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  const type = typeFilter.value;
  let out = cars.filter(c => {
    const matchesQ = !q || c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
    const matchesType = type === 'all' || c.type === type;
    return matchesQ && matchesType;
  });
  const sort = sortSelect.value;
  if(sort === 'price-asc') out.sort((a,b)=>a.price-b.price);
  if(sort === 'price-desc') out.sort((a,b)=>b.price-a.price);
  renderList(out, true);
}

// event delegation for list (buy / view)
list.addEventListener('click', (e)=>{
  const buy = e.target.closest('.btn.btn-primary[data-id]');
  if(buy){
    window.open('https://vitalrp.tebex.io/category/vitcoins', '_blank');
    return;
  }
  const view = e.target.closest('button[data-view]');
  if(view){
    const id = Number(view.dataset.view);
    const car = cars.find(c=>c.id===id);
    if(car) openModal(car);
  }
});

let _lastFocused = null;
function openModal(car){
  _lastFocused = document.activeElement;
  modalImage.src = car.img;
  modalTitle.textContent = car.name;
  modalPrice.textContent = formatPrice(car.price);
  modalDesc.textContent = car.desc;
  
  // populate specs
  if(car.specs){
    document.getElementById('specSpeed').textContent = car.specs.topSpeed || '—';
    document.getElementById('specAccel').textContent = car.specs.acceleration || '—';
    document.getElementById('specHandling').textContent = car.specs.handling || '—';
    document.getElementById('specBraking').textContent = car.specs.braking || '—';
    document.getElementById('specClass').textContent = car.specs.class || '—';
  }
  
  // set buy button target/data
  if(buyBtn){
    buyBtn.dataset.id = car.id;
    buyBtn.textContent = 'BUY NOW';
  }
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  // move focus to close button for keyboard users
  modalClose.focus();
  // escape to close and simple focus trap
  document.addEventListener('keydown', _handleModalKeydown);
}

function closeModal(){
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = ''; 
  document.removeEventListener('keydown', _handleModalKeydown);
  if(_lastFocused && typeof _lastFocused.focus === 'function') _lastFocused.focus();
}

function _handleModalKeydown(e){
  if(e.key === 'Escape') closeModal();
  if(e.key === 'Tab'){
    // very small focus trap: keep focus within modal close button and first focusable in modal
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if(!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if(e.shiftKey && document.activeElement === first){
      e.preventDefault();
      last.focus();
    } else if(!e.shiftKey && document.activeElement === last){
      e.preventDefault();
      first.focus();
    }
  }
}

modalBackdrop.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);

if(buyBtn){
  buyBtn.addEventListener('click', ()=>{
    window.open('https://vitalrp.tebex.io/category/vitcoins', '_blank');
  });
}

searchInput.addEventListener('input', applyFilters);
typeFilter.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);

// initial render
renderList(cars);

