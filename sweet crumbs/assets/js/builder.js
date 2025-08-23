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
  buttercream: '#F6E0C4',
  cganache: '#5B4535',
  royalicing: '#FFF',
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

function lightenColor(hex, percent) {
  // convert hex → RGB
  let num = parseInt(hex.replace("#", ""), 16),
      r = (num >> 16) + percent,
      g = ((num >> 8) & 0x00FF) + percent,
      b = (num & 0x0000FF) + percent;

  // clamp values between 0–255
  r = r < 255 ? (r < 0 ? 0 : r) : 255;
  g = g < 255 ? (g < 0 ? 0 : g) : 255;
  b = b < 255 ? (b < 0 ? 0 : b) : 255;

  return `rgb(${r},${g},${b})`;
}

function renderPreview() {
  preview.innerHTML = ''; // clear previous cake

  const layers = Number(form.layers.value);
  const sponge = form.sponge.value;
  const filling = form.filling.value;
  const icing = form.icing.value;
  const size = form.size.value;

  const spongeColor = colorMap[sponge] || '#EBD5BD';
  const fillingColor = colorMap[filling] || '#fff';
  const icingColor = colorMap[icing] || '#fff';

  // size scaling
  const cakeSizeMap = {
    "6": 0.7,
    "8": 0.9,
    "10": 1.0
  };
  const scale = cakeSizeMap[size] || 1;
  const baseWidth = 200;           // base cake width
  const layerWidth = baseWidth * scale;
  const layerHeight = 40;
  const fillingHeight = 20;
  const icingHeight = 20;

  // Create cake layers
  for (let i = 0; i < layers; i++) {
    // Sponge
    const spongeDiv = document.createElement('div');
    spongeDiv.className = 'cake-layer';
    spongeDiv.style.width = layerWidth + 'px';
    spongeDiv.style.height = layerHeight + 'px';
    spongeDiv.style.background = spongeColor;
    spongeDiv.style.borderRadius = '5px';
    spongeDiv.style.margin = '2px 0';
    preview.appendChild(spongeDiv);

    // Filling (except after last layer)
    if (i < layers - 1) {
      const fillingDiv = document.createElement('div');
      fillingDiv.className = 'cake-filling';
      fillingDiv.style.width = layerWidth + 'px';
      fillingDiv.style.height = fillingHeight + 'px';
      fillingDiv.style.background = fillingColor;
      fillingDiv.style.borderRadius = '3px';
      fillingDiv.style.margin = '0';
      preview.appendChild(fillingDiv);
    }
  }

  // Top icing
  const icingDiv = document.createElement('div');
  icingDiv.className = 'cake-icing top-icing';
  icingDiv.style.width = layerWidth + 'px';
  icingDiv.style.height = icingHeight + 'px';
  icingDiv.style.background = icingColor;
  icingDiv.style.borderRadius = '5px';
  icingDiv.style.margin = '0';
  preview.appendChild(icingDiv);

const topLayerIcing = preview.querySelector('.cake-icing:last-of-type');
if (topLayerIcing) {
    const checkedTopping = document.querySelector('input[name="toppings"]:checked');
    if (checkedTopping) {
        const count = 5; // number of toppings
        const toppingSize = 20; // diameter
        const gap = 10; // horizontal gap
        const icingWidth = topLayerIcing.offsetWidth;

        // total width of all toppings including gaps
        const totalWidth = count * toppingSize + (count - 1) * gap;
        const startX = (icingWidth - totalWidth) / 2;

        // set icing position to relative to position toppings absolutely inside
        topLayerIcing.style.position = 'relative';

        // define colors
        function lightenColor(hex, percent) {
            let num = parseInt(hex.replace("#", ""), 16),
                r = (num >> 16) + percent,
                g = ((num >> 8) & 0x00FF) + percent,
                b = (num & 0x0000FF) + percent;
            r = Math.min(255, Math.max(0, r));
            g = Math.min(255, Math.max(0, g));
            b = Math.min(255, Math.max(0, b));
            return `rgb(${r},${g},${b})`;
        }

        let color = "#fff";
        switch (checkedTopping.value) {
            case "macarons": color = lightenColor("#d17fa3", 40); break;
            case "berries": color = lightenColor("#c62828", 40); break;
            case "pistachio": color = lightenColor("#6b8e23", 40); break;
            case "goldleaf": color = lightenColor("#d4af37", 40); break;
        }

        for (let i = 0; i < count; i++) {
            const topDiv = document.createElement("div");
            topDiv.className = `cake-topping ${checkedTopping.value}`;
            topDiv.style.width = toppingSize + "px";
            topDiv.style.height = toppingSize + "px";
            topDiv.style.borderRadius = "50%";
            topDiv.style.position = "absolute";
            topDiv.style.background = color;

            // horizontal inside icing
            topDiv.style.left = `${startX + i * (toppingSize + gap)}px`;
            // vertical centered inside icing
            topDiv.style.top = `${(topLayerIcing.offsetHeight - toppingSize) / 2}px`;

            topLayerIcing.appendChild(topDiv);
        }
    }
}


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


window.addEventListener('load', () => {
  // Reset form to defaults
  form.reset();

  // Hide bill section
  billSection.style.display = 'none';
  billContent.innerHTML = '';

  // Update preview and chips
  updateAll();
});



// Make toppings behave like radio buttons
const toppingCheckboxes = document.querySelectorAll('input[name="toppings"]');
toppingCheckboxes.forEach(cb => {
  cb.addEventListener('change', function() {
    if (this.checked) {
      // Uncheck all other checkboxes
      toppingCheckboxes.forEach(other => {
        if (other !== this) other.checked = false;
      });
    }
    updateAll(); // redraw cake preview when selection changes
  });
});

updateAll(); // initial draw

