// FOOD CORNER - simple cart and page interactions

// Highlight the current page in the navigation.
const activePage = document.body.dataset.active;
const navLinks = document.querySelectorAll(".main-nav a");

navLinks.forEach(function(link) {
  if (link.dataset.page === activePage) {
    link.classList.add("active");
  }
});

// Mobile navigation menu.
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle) {
  menuToggle.addEventListener("click", function() {
    mainNav.classList.toggle("show");
    menuToggle.setAttribute("aria-expanded", mainNav.classList.contains("show"));
  });
}

// Read saved cart items from localStorage.
// This lets the cart stay available when the visitor changes pages.
let cart = JSON.parse(localStorage.getItem("foodCornerCart")) || [];

function saveCart() {
  localStorage.setItem("foodCornerCart", JSON.stringify(cart));
}

function updateCart() {
  const cartCount = document.querySelector(".cart-count");
  const cartItems = document.querySelector(".cart-items");
  const cartTotal = document.querySelector(".cart-total strong");

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(function(item) {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;
  });

  cartCount.textContent = totalItems;
  cartTotal.textContent = "Rs. " + totalPrice.toLocaleString("en-PK");

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Add something delicious!</p>';
    return;
  }

  cartItems.innerHTML = "";

  cart.forEach(function(item, index) {
    cartItems.innerHTML += `
      <div class="cart-item">
        <div>
          <h4>${item.name} × ${item.quantity}</h4>
          <p>Rs. ${(item.price * item.quantity).toLocaleString("en-PK")}</p>
        </div>
        <button class="remove-item" data-index="${index}">Remove</button>
      </div>
    `;
  });
}

// Add a product to the cart.
const addButtons = document.querySelectorAll(".add-button");

addButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    const productName = button.dataset.name;
    const productPrice = Number(button.dataset.price);

    const existingItem = cart.find(function(item) {
      return item.name === productName;
    });

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name: productName,
        price: productPrice,
        quantity: 1
      });
    }

    saveCart();
    updateCart();

    const oldText = button.textContent;
    button.textContent = "Added!";
    button.classList.add("added");
    setTimeout(function() {
      button.textContent = oldText;
      button.classList.remove("added");
    }, 900);
  });
});

// Remove products from the cart.
const cartItemsArea = document.querySelector(".cart-items");

cartItemsArea.addEventListener("click", function(event) {
  if (event.target.classList.contains("remove-item")) {
    const itemIndex = Number(event.target.dataset.index);
    cart.splice(itemIndex, 1);
    saveCart();
    updateCart();
  }
});

// Open and close the cart panel.
const cartOpenButton = document.querySelector(".cart-open");
const cartCloseButton = document.querySelector(".cart-close");
const cartOverlay = document.querySelector(".cart-overlay");

function openCart() {
  document.body.classList.add("cart-opened");
}

function closeCart() {
  document.body.classList.remove("cart-opened");
}

cartOpenButton.addEventListener("click", openCart);
cartCloseButton.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Demo checkout message.
document.querySelector(".checkout-button").addEventListener("click", function() {
  if (cart.length === 0) {
    alert("Your cart is empty. Please add a product first.");
  } else {
    alert("Thank you! This is a demo website, so no real order has been placed.");
  }
});

// Simple contact form validation and success message.
const contactForm = document.querySelector("#contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (contactForm.checkValidity()) {
      document.querySelector(".form-message").textContent =
        "Thank you! Your message has been received in this demo.";
      contactForm.reset();
    } else {
      contactForm.reportValidity();
    }
  });
}

// Show the saved cart as soon as any page loads.
updateCart();