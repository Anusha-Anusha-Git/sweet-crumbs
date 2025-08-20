const form = document.getElementById('cakeForm');
const preview = document.getElementById('cakePreview');
const priceEl = document.getElementById('totalPrice');

const chipSize = document.getElementById('chipSize');
const chipLayers = document.getElementById('chipLayers');
const chipSponge = document.getElementById('chipSponge');
const chipFilling = document.getElementById('chipFilling');
const chipIcing = document.getElementById('chipIcing');

const colorMap = {
  vanilla: '#F6E7D8',
  chocolate: '#7B5B42',
  redvelvet: '#A14343',
  pistachio: '#C7D9B8',
  chantilly: '#FFF9F0',
  strawberry: '#F5B7C5',
  lemoncurd: '#F7E37C',
  coffee: '#C8A585',
  buttercream: '#FFF3E8',
  ganache: '#5B4535',
  meringue: '#FFF',
};

function calcPrice() {
  let total = 0;
  const size = form.size.selectedOptions[0];
  total += Number(size.dataset.price || 0);
  const layers = Number(form.layers.value);
  total += (layers - 1) * 250; // extra per layer

  ['sponge', 'filling', 'icing'].forEach(name => {
    const opt = form[name].selectedOptions[0];
    total += Number(opt.dataset.price || 0);
  });

  document.querySelectorAll('input[name="toppings"]:checked').forEach(cb => {
    total += Number(cb.dataset.price || 0);
  });

  priceEl.textContent = 'Rs ' + total.toLocaleString();
}

function renderPreview() {
  preview.innerHTML = ''; // reset
  const layers = Number(form.layers.value);
  const sponge = form.sponge.value;
  const icing = form.icing.value;
  const filling = form.filling.value;

  // build cake layers (stacked with filling lines)
  for (let i = 0; i < layers; i++) {
    const layer = document.createElement('div');
    layer.className = 'cake-layer';
    const spongeColor = colorMap[sponge] || '#EBD5BD';
    const fillingColor = colorMap[filling] || '#fff';
    layer.style.background = `linear-gradient(to bottom,
      ${spongeColor} 0%,
      ${spongeColor} 70%,
      ${fillingColor} 71%,
      ${fillingColor} 75%,
      ${spongeColor} 76%)`;
    preview.appendChild(layer);
  }

  // icing cap
  const icingCap = document.createElement('div');
  icingCap.className = 'cake-icing';
  icingCap.style.background = colorMap[icing] || '#fff';
  preview.appendChild(icingCap);

  // toppings
  document.querySelectorAll("input[name='toppings']:checked").forEach((t, idx) => {
    const topDiv = document.createElement("div");
    topDiv.className = `cake-topping ${t.value}`;
    topDiv.style.background = colorMap[t.value] || 'pink';
    topDiv.style.left = `${30 + idx * 40}px`;
    preview.appendChild(topDiv);
  });
}

function updateChips() {
  chipSize.textContent = form.size.value + '"';
  chipLayers.textContent = form.layers.value + ' layers';
  chipSponge.textContent = form.sponge.selectedOptions[0].textContent;
  chipFilling.textContent = form.filling.selectedOptions[0].textContent;
  chipIcing.textContent = form.icing.selectedOptions[0].textContent;
}

function updateAll() {
  calcPrice();
  renderPreview();
  updateChips();
}

form.addEventListener('input', updateAll);
form.addEventListener('change', updateAll);
form.addEventListener('reset', () => setTimeout(updateAll, 0));
updateAll(); // initial draw
