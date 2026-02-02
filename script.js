let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

let products = [
  {id:1, name:"iPhone 14 Pro", price:129999, category:"mobile", img:"https://m.media-amazon.com/images/I/61XO4bORHUL._SX679_.jpg"},
  {id:2, name:"Samsung Galaxy S23", price:74999, category:"mobile", img:"https://m.media-amazon.com/images/I/61VfL-aiToL._SX679_.jpg"},
  {id:3, name:"Sony WH-1000XM5", price:29999, category:"audio", img:"https://m.media-amazon.com/images/I/61ULAZmt9NL._SX679_.jpg"},
  {id:4, name:"Apple Watch Series 9", price:41999, category:"watch", img:"https://m.media-amazon.com/images/I/71T5NVOgbpL._SX679_.jpg"},
  {id:5, name:"Gaming Mouse RGB", price:1999, category:"gaming", img:"https://m.media-amazon.com/images/I/61mpMH5TzkL._SX679_.jpg"}
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];




// 1. Display Products
function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p>$${p.price}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
            <button onclick="addToWishlist(${p.id})">❤️ Wishlist</button>

        </div>
    `).join('');
}

// 2. Add to Cart Logic




function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}


// 3. Update the Screen
function updateCartUI(){
  document.getElementById("cart-count").innerText =
    cart.reduce((sum,i)=>sum+(i.qty || 1),0);


  let html = "";
  let total = 0;

  cart.forEach((item,index)=>{
    total += item.price * item.qty;
    html += `
      <div class="cart-item">
        <img src="${item.img}">
        <div>
          <h4>${item.name}</h4>
          <p>₹${item.price} × ${item.qty}</p>
        </div>
        <button onclick="removeItem(${index})">✖</button>
      </div>
    `;
  });

  document.getElementById("cart-items").innerHTML = html;
  document.getElementById("cart-total").innerText = total;
}


function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();


}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('hidden');
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderProducts();
  updateCartUI();
});


// Switch between Home and Profile
function showSection(section) {
    if (section === 'home') {
        document.getElementById('home-section').classList.remove('hidden');
        document.getElementById('profile-section').classList.add('hidden');
    } else {
        document.getElementById('home-section').classList.add('hidden');
        document.getElementById('profile-section').classList.remove('hidden');
    }
}

// Search Functionality
function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    
    const grid = document.getElementById('product-grid');
    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p>$${p.price}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
    `).join('');
}

// Profile Tab Logic
function showOrders(){
  if(orders.length === 0){
    document.getElementById("profile-content").innerHTML =
      "<h3>My Orders</h3><p>No orders yet.</p>";
    return;
  }

  let html = orders.map(o=>`
    <div class="order-card">
      <h4>${o.id}</h4>
      <p><b>Date:</b> ${o.date}</p>
      <p><b>Payment:</b> ${o.payment}</p>
      <p><b>Status:</b> PAID</p>
      <p><b>Total:</b> ₹${o.total}</p>
    </div>
  `).join("");

  document.getElementById("profile-content").innerHTML =
    "<h3>My Orders</h3>" + html;
}







// 3. Invoice Generation
function generateInvoice(order){
    let win = window.open("");

    win.document.write(`
        <h1>QuickCart Invoice</h1>
        <p><b>Order ID:</b> ${order.id}</p>
        <p><b>Name:</b> ${order.user?.name || "User"}</p>
<p><b>Address:</b> ${order.user?.address || "-"}</p>
<p><b>Phone:</b> ${order.user?.phone || "-"}</p>
        <p><b>Date:</b> ${order.date}</p>

        <hr>

        <table border="1" width="100%" cellpadding="8">
            <tr><th>Product</th><th>Qty</th><th>Price</th></tr>
            ${order.items.map(i=>`
                <tr>
                    <td>${i.name}</td>
                    <td>${i.qty}</td>
                    <td>₹${i.price*i.qty}</td>
                </tr>
            `).join("")}
        </table>

        <p>Subtotal: ₹${order.subtotal}</p>
        <p>GST (18%): ₹${order.gst}</p>
        <h2>Total Paid: ₹${order.total}</h2>

        <p><b>Payment Mode:</b> ${order.payment}</p>
        <p style="color:green;font-weight:bold;">PAID</p>

        <button onclick="window.print()">Print Invoice</button>
    `);
}



function closePayment() {
    document.getElementById('overlay').remove();
    document.getElementById('payModal').remove();
}
let userData = {}; // User ki info store karne ke liye

function checkout() {
    if (cart.length === 0) return alert("Your cart is empty!");

    const modalHTML = `
        <div class="overlay" id="overlay"></div>
        <div class="payment-modal" id="payModal">
            <div style="background:#2874f0; color:white; padding:15px; border-radius:8px 8px 0 0;">
                <h3>Shipping Details</h3>
            </div>
            <div style="padding:20px; display:flex; flex-direction:column; gap:10px;">
                <input type="text" id="custName" placeholder="Full Name" style="padding:10px;">
                <input type="text" id="custAddress" placeholder="Full Address (House No, Street, City)" style="padding:10px;">
                <input type="text" id="custPhone" placeholder="Mobile Number" style="padding:10px;">
                
                <hr>
                <p><strong>Total Amount: ₹${document.getElementById('cart-total').innerText}</strong></p>
                
                <button onclick="saveAndPay()" style="padding:12px; background:#fb641b; color:white; border:none; font-weight:bold; cursor:pointer;">
                    PROCEED TO PAYMENT
                </button>
                <button onclick="closePayment()" style="background:none; border:none; color:grey; cursor:pointer;">Cancel</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}


function saveAndPay(){
    const name = custName.value.trim();
    const address = custAddress.value.trim();
    const phone = custPhone.value.trim();

    if(!name || !address || !phone){
        alert("Please fill all shipping details");
        return;
    }

    userData = { name, address, phone };

    document.getElementById("payModal").innerHTML = `
        <div style="background:#2874f0;color:white;padding:15px;">
            <h3>Select Payment Method</h3>
        </div>
        <div style="padding:20px;">
            <button onclick="showUPI()" style="width:100%;padding:12px;margin-bottom:10px;">
                📱 UPI (GPay / PhonePe)
            </button>
            <button onclick="showQR()" style="width:100%;padding:12px;">
   📷 Scan QR & Pay
</button>

            <button onclick="showCard()" style="width:100%;padding:12px;">
                💳 Debit / Credit Card
            </button>
        </div>
    `;
}
function showUPI(){
    document.getElementById("payModal").innerHTML = `
        <div style="padding:20px;">
            <h3>UPI Payment</h3>
            <input placeholder="Enter UPI ID" style="width:100%;padding:10px;">
            <button onclick="processPayment('UPI')" style="margin-top:10px;width:100%;">
                Pay Now
            </button>
        </div>
    `;
}

function showCard(){
    document.getElementById("payModal").innerHTML = `
        <div style="padding:20px;">
            <h3>Card Payment</h3>
            <input placeholder="Card Number" style="width:100%;padding:10px;"><br><br>
            <input placeholder="MM/YY" style="width:48%;padding:10px;">
            <input placeholder="CVV" style="width:48%;padding:10px;float:right;"><br><br>
            <button onclick="processPayment('CARD')" style="width:100%;">
                Pay Now
            </button>
        </div>
    `;
}

function processPayment(method){
    document.getElementById("payModal").innerHTML = `
        <div style="padding:40px;text-align:center;">
            <h3>Processing ${method} Payment...</h3>
        </div>
    `;

    setTimeout(()=>{
        let order = {
            id: "ORD" + Date.now(),
            user: userData,
            items: [...cart],
            payment: method,
            subtotal: cart.reduce((s,i)=>s+i.price*i.qty,0),
            gst: 0,
            total: 0,
            date: new Date().toLocaleString()
        };

        order.gst = Math.round(order.subtotal * 0.18);
        order.total = order.subtotal + order.gst;

        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));

        generateInvoice(order);

        cart = [];
        saveCart();
        closePayment();
        alert("Payment Successful!");
    },1500);
}


function showQR(){
  document.getElementById("payModal").innerHTML = `
    <div style="padding:20px;text-align:center;">
      <h3>Scan & Pay</h3>

      <!-- 🔴 YAHAN APNA PERSONAL QR IMAGE PASTE KARNA -->
      <img src="QR.png" alt="QR Code" style="width:220px;margin:15px auto;display:block;">

      <p>Scan this QR using any UPI App (GPay / PhonePe / Paytm)</p>

      <button onclick="confirmQRPayment()" 
        style="margin-top:15px;padding:12px;width:100%;background:#4caf50;color:white;border:none;">
        ✅ I HAVE PAID
      </button>

      <button onclick="closePayment()" style="margin-top:10px;">
        Cancel
      </button>
    </div>
  `;
}

function confirmQRPayment(){
  document.getElementById("payModal").innerHTML = `
    <div style="padding:40px;text-align:center;">
      <h3>Verifying Payment...</h3>
    </div>
  `;

  setTimeout(()=>{
    completeOrder("QR");
  },1000);
}


function showProfileTab(tab){
    const content = document.getElementById("profile-content");

    if(tab === "orders"){
        showOrders();
    }
    else if(tab === "wishlist"){
        showWishlist();   // ❤️ IMPORTANT
    }
    else if(tab === "settings"){
        content.innerHTML = `
            <h3>Account Settings</h3>
            <p>Name: ${userData.name || "User"}</p>
            <p>Address: ${userData.address || "-"}</p>
        `;
    }
}
function addToCart(id){
  let item = cart.find(p => p.id === id);
  if(item){
    item.qty++;
  } else {
    let product = products.find(p => p.id === id);
    cart.push({...product, qty:1});
  }
  saveCart();
}


function showWishlist(){
    const content = document.getElementById("profile-content");

    if(wishlist.length === 0){
        content.innerHTML = "<h3>My Wishlist</h3><p>No items in wishlist.</p>";
        return;
    }

    let html = wishlist.map((p,index)=>`
        <div class="order-card">
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>
            <button onclick="addToCart(${p.id}); showWishlist()">Add to Cart</button>

            <button onclick="removeWishlist(${index})">Remove</button>
        </div>
    `).join("");

    content.innerHTML = "<h3>My Wishlist</h3>" + html;
}



function addToWishlist(id){
  if(wishlist.find(p=>p.id===id)){
    alert("Already in Wishlist");
    return;
  }
  let product = products.find(p=>p.id===id);
  wishlist.push(product);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  alert("Added to Wishlist ❤️");
}
function completeOrder(method){
  let subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  let gst = Math.round(subtotal * 0.18);
  let total = subtotal + gst;

  let order = {
    id: "ORD"+Date.now(),
    user: userData,
    items: [...cart],
    payment: method,
    subtotal,
    gst,
    total,
    date: new Date().toLocaleString()
  };

  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  generateInvoice(order);

  cart = [];
  saveCart();
  closePayment();
  alert("Payment Successful!");
}
