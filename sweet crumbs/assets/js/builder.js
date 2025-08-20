const form = document.getElementById('cakeForm');
const preview = document.getElementById('cakePreview');
const priceEl = document.getElementById('totalPrice');
const billSection = document.getElementById('billSection');
const billContent = document.getElementById('billContent');
const generateBillBtn = document.getElementById('generateBill');

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
  return total;
}

function renderPreview() {
  preview.innerHTML = ''; // reset
  const layers = Number(form.layers.value);
  const sponge = form.sponge.value;
  const icing = form.icing.value;
  const filling = form.filling.value;

  // build cake layers (stacked with filling + icing between each)
for (let i = 0; i < layers; i++) {
  const layer = document.createElement('div');
  layer.className = 'cake-layer';
  const spongeColor = colorMap[sponge] || '#EBD5BD';
  const fillingColor = colorMap[filling] || '#fff';

  // sponge + filling band
  layer.style.background = `linear-gradient(to bottom,
    ${spongeColor} 0%,
    ${spongeColor} 70%,
    ${fillingColor} 71%,
    ${fillingColor} 75%,
    ${spongeColor} 76%)`;
  preview.appendChild(layer);

  // add icing after each sponge layer
  const icingDiv = document.createElement("div");
  icingDiv.className = "cake-icing";
  icingDiv.style.background = colorMap[icing] || "#fff";
  preview.appendChild(icingDiv);
}


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

function generateBill() {
  const total = calcPrice();
  const size = form.size.selectedOptions[0].textContent;
  const layers = form.layers.value;
  const sponge = form.sponge.selectedOptions[0].textContent;
  const filling = form.filling.selectedOptions[0].textContent;
  const icing = form.icing.selectedOptions[0].textContent;

  const toppings = [...document.querySelectorAll('input[name="toppings"]:checked')]
    .map(t => t.value)
    .join(', ') || 'None';

  billContent.innerHTML = `
    <h3>🍰 Sweet Crumbs - Cake Order Receipt</h3>
    <p><strong>Size:</strong> ${size}</p>
    <p><strong>Layers:</strong> ${layers}</p>
    <p><strong>Sponge:</strong> ${sponge}</p>
    <p><strong>Filling:</strong> ${filling}</p>
    <p><strong>Icing:</strong> ${icing}</p>
    <p><strong>Toppings:</strong> ${toppings}</p>
    <hr>
    <p><strong>Total Price:</strong> Rs ${total.toLocaleString()}</p>
    <p><em>Thank you for your order! 🎉</em></p>
  `;

  billSection.style.display = 'block';
}

form.addEventListener('input', updateAll);
form.addEventListener('change', updateAll);
form.addEventListener("reset", (e) => {
  e.preventDefault(); // stop browser’s reset

  // Force defaults
  form.size.value = "6";
  form.layers.value = "1";
  form.sponge.value = "vanilla";
  form.filling.value = "chantilly";
  form.icing.value = "buttercream";

  document.querySelectorAll('input[name="toppings"]').forEach(cb => cb.checked = false);

  // Hide bill section
  billSection.style.display = "none";
  billContent.innerHTML = "";

  // Update everything visually
  updateAll();
});
generateBillBtn.addEventListener('click', generateBill);

updateAll(); // initial draw

document.getElementById("generateBill").addEventListener("click", function () {
  billSection.style.display = "block";
  billContent.innerHTML = `
    <h3>🧾 Sweet Crumbs Receipt</h3>
    <p><span>Size:</span> <span>${chips.size.textContent}</span></p>
    <p><span>Layers:</span> <span>${chips.layers.textContent}</span></p>
    <p><span>Sponge:</span> <span>${chips.sponge.textContent}</span></p>
    <p><span>Filling:</span> <span>${chips.filling.textContent}</span></p>
    <p><span>Icing:</span> <span>${chips.icing.textContent}</span></p>
    <p><span>Toppings:</span> <span>${chips.toppings.textContent}</span></p>
    <h4>${totalPrice.textContent}</h4>
  `;
});


function generateCake() {
  const layers = parseInt(document.getElementById("layers").value);
  const icing = document.getElementById("icing").value;
  const toppings = Array.from(document.querySelectorAll("input[name='toppings']:checked")).map(t => t.value);

  const cakePreview = document.getElementById("cakePreview");
  cakePreview.innerHTML = ""; // clear old cake

  // Build cake from bottom up
  for (let i = 0; i < layers; i++) {
    const sponge = document.createElement("div");
    sponge.classList.add("cake-layer");
    cakePreview.appendChild(sponge);

    const icingLayer = document.createElement("div");
    icingLayer.classList.add("icing-layer", icing);
    cakePreview.appendChild(icingLayer);
  }

  // Add toppings only at the top
  if (toppings.length > 0) {
    const toppingContainer = document.createElement("div");
    toppingContainer.classList.add("topping-container");

    toppings.forEach(top => {
      const topping = document.createElement("div");
      topping.classList.add("topping", top);
      toppingContainer.appendChild(topping);
    });

    cakePreview.appendChild(toppingContainer);
  }
}





