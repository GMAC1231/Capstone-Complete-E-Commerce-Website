const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 59.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description: "Comfortable wireless headphones with strong bass, clear sound, and long battery life."
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    price: 89.99,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    description: "A modern smart watch with fitness tracking, notifications, and stylish design."
  },
  {
    id: 3,
    name: "Running Shoes",
    category: "Fashion",
    price: 74.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    description: "Lightweight running shoes made for comfort, speed, and daily use."
  },
  {
    id: 4,
    name: "Leather Backpack",
    category: "Fashion",
    price: 49.99,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    description: "A stylish leather backpack suitable for school, work, travel, and daily activities."
  },
  {
    id: 5,
    name: "Coffee Maker",
    category: "Home",
    price: 39.99,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=80",
    description: "Easy-to-use coffee maker for fresh coffee at home every morning."
  },
  {
    id: 6,
    name: "Desk Lamp",
    category: "Home",
    price: 24.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    description: "Adjustable desk lamp with soft lighting, perfect for studying and working."
  },
  {
    id: 7,
    name: "Gaming Keyboard",
    category: "Electronics",
    price: 69.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=900&q=80",
    description: "Mechanical gaming keyboard with responsive keys and a premium typing feel."
  },
  {
    id: 8,
    name: "Cotton T-Shirt",
    category: "Fashion",
    price: 19.99,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    description: "Soft cotton t-shirt with a clean design and comfortable everyday fit."
  },
  {
    id: 9,
    name: "Water Bottle",
    category: "Sports",
    price: 14.99,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
    description: "Reusable water bottle that keeps drinks fresh during gym, school, or travel."
  },
  {
    id: 10,
    name: "Yoga Mat",
    category: "Sports",
    price: 29.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=900&q=80",
    description: "Non-slip yoga mat suitable for yoga, stretching, fitness, and home workouts."
  },
  {
    id: 11,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 44.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
    description: "Portable Bluetooth speaker with loud sound and compact design."
  },
  {
    id: 12,
    name: "Office Chair",
    category: "Home",
    price: 129.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
    description: "Comfortable office chair with ergonomic support for long working hours."
  }
];

const cartKey = "shopease_cart";
const shippingFee = 5.00;

function getCart() {
  return JSON.parse(localStorage.getItem(cartKey)) || [];
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function formatPrice(value) {
  return Number(value).toFixed(2);
}

function getStars(rating) {
  const rounded = Math.round(rating);
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

function updateCartBadges() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelectorAll(".cart-count").forEach(badge => {
    badge.textContent = count;
  });
}

function addToCart(productId, quantity = 1) {
  const product = products.find(item => item.id === Number(productId));
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: Number(quantity)
    });
  }

  saveCart(cart);
  updateCartBadges();
  showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== Number(productId));

  saveCart(cart);
  renderCartPage();
  renderCheckoutPage();
  updateCartBadges();
}

function updateQuantity(productId, change) {
  const cart = getCart();
  const item = cart.find(product => product.id === Number(productId));

  if (!item) return;

  item.quantity += Number(change);

  if (item.quantity <= 0) {
    saveCart(cart.filter(product => product.id !== item.id));
  } else {
    saveCart(cart);
  }

  renderCartPage();
  renderCheckoutPage();
  updateCartBadges();
}

function cartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? shippingFee : 0;

  return {
    subtotal,
    shipping,
    total: subtotal + shipping
  };
}

function productCard(product) {
  return `
    <div class="col-sm-6 col-lg-4 col-xl-3">
      <div class="card product-card shadow-sm">
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}">
        </a>

        <div class="card-body d-flex flex-column">
          <p class="category-label mb-1">${product.category}</p>

          <h3 class="h5 fw-bold">
            <a class="text-decoration-none text-dark" href="product.html?id=${product.id}">
              ${product.name}
            </a>
          </h3>

          <p class="rating mb-2">
            ${getStars(product.rating)} <span class="text-muted">(${product.rating})</span>
          </p>

          <p class="price mb-3">$${formatPrice(product.price)}</p>

          <button class="btn btn-primary mt-auto" onclick="addToCart(${product.id})">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderFeaturedProducts() {
  const container = document.getElementById("featuredProducts");

  if (!container) return;

  container.innerHTML = products.slice(0, 4).map(productCard).join("");
}

function renderShopProducts() {
  const grid = document.getElementById("productsGrid");

  if (!grid) return;

  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortSelect = document.getElementById("sortSelect");
  const count = document.getElementById("productResultCount");

  const search = (searchInput?.value || "").toLowerCase().trim();
  const category = categoryFilter?.value || "all";
  const sort = sortSelect?.value || "default";

  let result = [...products];

  if (search) {
    result = result.filter(product =>
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search)
    );
  }

  if (category !== "all") {
    result = result.filter(product => product.category === category);
  }

  if (sort === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  }

  if (sort === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  }

  if (sort === "rating-desc") {
    result.sort((a, b) => b.rating - a.rating);
  }

  if (sort === "name-asc") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  count.textContent = `${result.length} product${result.length === 1 ? "" : "s"} found`;

  if (result.length === 0) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="empty-state bg-white rounded-4 shadow-sm">
          <h3>No products found</h3>
          <p class="text-muted">Try another search or category.</p>
        </div>
      </div>
    `;
    return;
  }

  grid.innerHTML = result.map(productCard).join("");
}

function initShopControls() {
  const categoryFilter = document.getElementById("categoryFilter");

  if (!categoryFilter) return;

  const categories = ["all", ...new Set(products.map(product => product.category))];

  categoryFilter.innerHTML = categories.map(category => {
    const text = category === "all" ? "All Categories" : category;
    return `<option value="${category}">${text}</option>`;
  }).join("");

  ["searchInput", "categoryFilter", "sortSelect"].forEach(id => {
    const element = document.getElementById(id);

    if (element) {
      element.addEventListener("input", renderShopProducts);
      element.addEventListener("change", renderShopProducts);
    }
  });

  const clearButton = document.getElementById("clearFilters");

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      document.getElementById("searchInput").value = "";
      document.getElementById("categoryFilter").value = "all";
      document.getElementById("sortSelect").value = "default";

      renderShopProducts();
    });
  }

  renderShopProducts();
}

function renderProductDetail() {
  const container = document.getElementById("productDetail");

  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const product = products.find(item => item.id === id) || products[0];

  container.innerHTML = `
    <div class="row g-5 align-items-start bg-white rounded-4 shadow-sm p-3 p-md-5">
      <div class="col-lg-6">
        <img class="detail-image" src="${product.image}" alt="${product.name}">
      </div>

      <div class="col-lg-6">
        <p class="category-label">${product.category}</p>
        <h1 class="fw-bold">${product.name}</h1>

        <p class="rating fs-5">
          ${getStars(product.rating)} <span class="text-muted">(${product.rating})</span>
        </p>

        <p class="price fs-2">$${formatPrice(product.price)}</p>
        <p class="lead text-muted">${product.description}</p>

        <div class="my-4">
          <label class="form-label fw-semibold">Quantity</label><br>

          <div class="quantity-control">
            <button type="button" id="detailMinus">−</button>
            <span id="detailQty">1</span>
            <button type="button" id="detailPlus">+</button>
          </div>
        </div>

        <button id="detailAdd" class="btn btn-primary btn-lg fw-semibold">Add to Cart</button>
        <a href="cart.html" class="btn btn-outline-dark btn-lg ms-sm-2 mt-2 mt-sm-0">Go to Cart</a>
      </div>
    </div>
  `;

  let qty = 1;
  const qtyText = document.getElementById("detailQty");

  document.getElementById("detailMinus").addEventListener("click", () => {
    if (qty > 1) {
      qty--;
    }

    qtyText.textContent = qty;
  });

  document.getElementById("detailPlus").addEventListener("click", () => {
    qty++;
    qtyText.textContent = qty;
  });

  document.getElementById("detailAdd").addEventListener("click", () => {
    addToCart(product.id, qty);
  });
}

function renderCartPage() {
  const container = document.getElementById("cartPageItems");

  if (!container) return;

  const cart = getCart();
  const totals = cartTotals();
  const checkoutBtn = document.getElementById("cartCheckoutBtn");

  document.getElementById("summarySubtotal").textContent = formatPrice(totals.subtotal);
  document.getElementById("summaryShipping").textContent = formatPrice(totals.shipping);
  document.getElementById("summaryTotal").textContent = formatPrice(totals.total);

  if (checkoutBtn) {
    checkoutBtn.classList.toggle("disabled", cart.length === 0);
  }

  if (!cart.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h2 class="h4 fw-bold">Your cart is empty</h2>
        <p class="text-muted">Add products from the shop page.</p>
        <a href="shop.html" class="btn btn-warning fw-semibold">Shop Now</a>
      </div>
    `;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-row">
      <img src="${item.image}" alt="${item.name}">

      <div>
        <div class="d-flex flex-column flex-md-row justify-content-between gap-2">
          <div>
            <h3 class="h5 fw-bold mb-1">${item.name}</h3>
            <p class="text-muted mb-2">$${formatPrice(item.price)} each</p>
          </div>

          <strong>$${formatPrice(item.price * item.quantity)}</strong>
        </div>

        <div class="d-flex flex-wrap align-items-center gap-2">
          <div class="quantity-control">
            <button type="button" onclick="updateQuantity(${item.id}, -1)">−</button>
            <span>${item.quantity}</span>
            <button type="button" onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>

          <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">
            Remove
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

function renderCheckoutPage() {
  const container = document.getElementById("checkoutItems");

  if (!container) return;

  const cart = getCart();
  const totals = cartTotals();

  document.getElementById("checkoutSubtotal").textContent = formatPrice(totals.subtotal);
  document.getElementById("checkoutShipping").textContent = formatPrice(totals.shipping);
  document.getElementById("checkoutTotal").textContent = formatPrice(totals.total);

  if (!cart.length) {
    container.innerHTML = `
      <div class="alert alert-warning">
        Your cart is empty. <a href="shop.html" class="alert-link">Add products first</a>.
      </div>
    `;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <img src="${item.image}" alt="${item.name}">

      <div>
        <strong>${item.name}</strong>
        <p class="mb-0 text-muted">Qty: ${item.quantity}</p>
      </div>

      <strong>$${formatPrice(item.price * item.quantity)}</strong>
    </div>
  `).join("");
}

function initCheckoutForm() {
  const form = document.getElementById("checkoutForm");

  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();
    event.stopPropagation();

    if (!getCart().length) {
      showToast("Your cart is empty. Add products before checkout.");
      return;
    }

    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      return;
    }

    localStorage.removeItem(cartKey);
    updateCartBadges();
    renderCheckoutPage();

    form.reset();
    form.classList.remove("was-validated");

    const message = document.getElementById("checkoutMessage");
    message.textContent = "Order placed successfully! This is UI only, so no real payment was processed.";
    message.classList.remove("d-none");
  });
}

function showToast(message) {
  let toast = document.getElementById("cartToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cartToast";
    toast.className = "position-fixed bottom-0 end-0 m-3 alert alert-success shadow";
    toast.style.zIndex = "2000";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.remove("d-none");

  setTimeout(() => {
    toast.classList.add("d-none");
  }, 1800);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadges();
  renderFeaturedProducts();
  initShopControls();
  renderProductDetail();
  renderCartPage();
  renderCheckoutPage();
  initCheckoutForm();
});