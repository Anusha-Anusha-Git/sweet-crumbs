let cart = [];

function toggleCart() {
  const sidebar = document.getElementById("cartSidebar");
  sidebar.classList.toggle("open");
}


function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - Rs ${item.price} 
      <button onclick="removeItem(${index})">x</button>`;
    cartItems.appendChild(li);
    total += item.price;
  });

  cartTotal.innerText = `Total: Rs ${total}`;
  cartCount.innerText = cart.length; // update badge
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.getAttribute("data-name");
    const price = parseFloat(btn.getAttribute("data-price"));
    cart.push({ name, price });
    updateCart();
    showToast(`${name} added to cart!`);
  });
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  alert("Checkout complete!");
  cart = [];
  updateCart();
});
