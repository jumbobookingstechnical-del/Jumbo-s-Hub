let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

/* ================= CART ================= */

function addToCart(name, price) {
  const item = cart.find((p) => p.name === name);

  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  updateCart();
  alert(name + " added to cart 🛒");
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

function increaseQty(index) {
  cart[index].qty++;
  updateCart();
}

function decreaseQty(index) {
  cart[index].qty--;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  updateCart();
}

/* ================= CART UI ================= */

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  const navCount = document.getElementById("nav-cart-count");
  const floatingCount = document.getElementById("floating-cart-count");
  const sideCount = document.getElementById("cartCount");

  if (!cartItems) return;

  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    count += item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <p>$${item.price.toFixed(2)}</p>

          <div class="qty-buttons">
            <button onclick="decreaseQty(${index})">-</button>
            <button>${item.qty}</button>
            <button onclick="increaseQty(${index})">+</button>
          </div>
        </div>

        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });

  if (navCount) navCount.textContent = count;
  if (floatingCount) floatingCount.textContent = count;
  if (sideCount) sideCount.textContent = count;
  if (cartTotal) cartTotal.textContent = total.toFixed(2);

  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ================= CART DRAWER ================= */

function toggleCart() {
  const cartBox = document.getElementById("cart");
  if (cartBox) cartBox.classList.toggle("active");
}

/* ================= WISHLIST ================= */

function addToWishlist(name) {
  if (!wishlist.includes(name)) {
    wishlist.push(name);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlist();
  alert(name + " added to wishlist ❤️");
}

function updateWishlist() {
  const wishlistItems = document.getElementById("wishlist-items");
  const wishlistCount = document.getElementById("wishlist-count");

  if (!wishlistItems) return;

  wishlistItems.innerHTML = "";

  wishlist.forEach((item, index) => {
    wishlistItems.innerHTML += `
      <div class="cart-item">
        <strong>${item}</strong>
        <button onclick="removeWishlistItem(${index})">Remove</button>
      </div>
    `;
  });

  if (wishlistCount) wishlistCount.textContent = wishlist.length;
}

function removeWishlistItem(index) {
  wishlist.splice(index, 1);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlist();
}

function toggleWishlist() {
  const panel = document.getElementById("wishlist-panel");
  if (panel) panel.classList.toggle("active");
}

/* ================= SEARCH ================= */

function searchProducts() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".product-card");

  cards.forEach((card) => {
    const product = card.querySelector("h4").innerText.toLowerCase();
    card.style.display = product.includes(input) ? "block" : "none";
  });
}

/* ================= CHECKOUT ================= */

function makePayment() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.qty;
  });

  FlutterwaveCheckout({
    public_key: "FLWPUBK_TEST-28df493296a944af41bb305f61a9d933-X", // 🔴 YOUR KEY HERE
    tx_ref: "TX-" + Date.now(),
    amount: total,
    currency: "USD",
    payment_options: "card, mobilemoney, ussd",

    customer: {
      email: "customer@example.com",
      name: "Trendify Customer",
    },

    callback: function (data) {
      alert("Payment successful ✅");

      console.log(data);

      cart = [];
      localStorage.removeItem("cart");
      updateCart();

      window.location.href = "success.html";
    },

    onclose: function () {
      console.log("Payment closed");
    },

    customizations: {
      title: "Trendify Store",
      description: "Order Payment",
      logo: "images/logo.png",
    },
  });
}

/* ================= OPTIONAL ================= */

function recommendProducts() {
  console.log("Recommended Products loaded...");
}

/* ================= INIT ================= */

window.onload = function () {
  updateCart();
  updateWishlist();
  recommendProducts();
};
