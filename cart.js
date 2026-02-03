// ============================
// CART STORAGE
// ============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ============================
// ADD TO CART
// ============================
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart")) {

    const btn = e.target;

    const product = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: Number(btn.dataset.price),
      qty: 1
    };

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart ✅");
  }
});

// ============================
// DISPLAY CART (cart.html)
// ============================
function displayCart() {
  const cartBox = document.getElementById("cart-items");
  const totalBox = document.getElementById("total");

  if (!cartBox) return;

  cartBox.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartBox.innerHTML = "<p>Your cart is empty</p>";
    totalBox.innerText = "0";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    cartBox.innerHTML += `
      <div class="card shadow-sm mb-3">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-1">${item.name}</h6>
            <small class="text-muted">Qty: ${item.qty}</small>
          </div>
          <div>
            <span class="fw-bold text-success me-3">₹${item.price * item.qty}</span>
            <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">X</button>
          </div>
        </div>
      </div>
    `;
  });

  totalBox.innerText = total;
}

// ============================
// REMOVE ITEM
// ============================
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// AUTO LOAD
displayCart();
