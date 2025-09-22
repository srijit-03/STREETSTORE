
let productHtml = document.querySelector('.category-grid');  
let listCartHTML = document.querySelector('.cart-sec');     
let products = [];
let carts = JSON.parse(localStorage.getItem("carts")) || []; 


const listProductHTML = (start = 0) => {
  if (!productHtml) return;  // ✅ prevent error on cart page
  productHtml.innerHTML = "";
  const limitedProducts = products.slice(start, start + 6);

  limitedProducts.forEach(product => {
    let newProduct = document.createElement("div");
    newProduct.classList.add("product-card");
    newProduct.dataset.id = product.id;
    newProduct.innerHTML = `
      <div class="card-pic">
        <img src="${product.img}" alt="${product.name}">
      </div>
      <p class="para" id="p-nam">${product.name}</p>
      <div class="price-cart">
        <p class="para">$${product.price}</p>
        <button class="add-to-cart">
          <i class="fa-solid fa-cart-shopping"></i> Cart
        </button>
      </div>
    `;
    productHtml.appendChild(newProduct);
  });
};





if (productHtml) {
  productHtml.addEventListener("click", (event) => {
    if (event.target.closest(".add-to-cart")) {
      let productCard = event.target.closest(".product-card");
      let product_id = productCard.dataset.id;
      addToCart(product_id);
    }
  });
}


const addToCart = (product_id) => {
  let positionThisProduct = carts.findIndex(item => item.product_id == product_id);
  if (positionThisProduct < 0) {
    carts.push({ product_id: product_id, quantity: 1 });
  } else {
    carts[positionThisProduct].quantity += 1;
  }
  alert("Product move to cart");
  saveCart();
  addToCartHTML();
};


const addToCartHTML = () => {
//  if (!listCartHTML) return; 
listCartHTML.innerHTML = "";

if (carts.length > 0) {
  let subtotal = 0;

  
  let cartContainer = document.createElement("div");
  cartContainer.classList.add("cart-page");
  cartContainer.classList.add("cart-container");
  cartContainer.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody class="cart-body"></tbody>
    </table>
  `;

  let tbody = cartContainer.querySelector(".cart-body");

  
  carts.forEach(cart => {
    let info = products.find(p => p.id == cart.product_id);
    if (!info) return;

    let itemSubtotal = info.price * cart.quantity;
    subtotal += itemSubtotal;

    let row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <div class="cart-info">
          <img src="${info.img}" alt="${info.name}">
          <p>${info.name}</p>
          <a href="#" class="remove-item" data-id="${cart.product_id}">Remove</a>
        </div>
      </td>
      <td>
        <input type="number" value="${cart.quantity}" min="1" 
          class="quantity-input" data-id="${cart.product_id}">
      </td>
      <td>$${itemSubtotal.toFixed(2)}</td>
    `;
    tbody.appendChild(row);
    });
     let totalDiv = document.createElement("div");
  totalDiv.classList.add("total-price");
  totalDiv.innerHTML = `
    <h1>Price Details</h1>
    <table>
      <tr>
        <td>Subtotal</td>
        <td>$${subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Total Amount</td>
        <td>$${subtotal.toFixed(2)}</td>
      </tr>
    </table>
    <button class="checkout">PLACE ORDER</button>
    <a href="index.html" class="Shopping">Continue Shopping</a>
  `;

  listCartHTML.appendChild(cartContainer);
  listCartHTML.appendChild(totalDiv);

  
    listCartHTML.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        let id = btn.dataset.id;
        carts = carts.filter(item => item.product_id != id);
        saveCart();
        addToCartHTML();
      });
    });

   
    listCartHTML.querySelectorAll(".quantity-input").forEach(input => {
      input.addEventListener("change", (e) => {
        let id = input.dataset.id;
        let cartItem = carts.find(item => item.product_id == id);
        if (cartItem) {
          cartItem.quantity = Math.max(1, parseInt(input.value) || 1);
          saveCart();
          addToCartHTML();
        }
      });
    });
  } else {
    
    let emptyRow = document.createElement("div");
    emptyRow.innerHTML = `
    <div style="text-align:center; font-size:2rem; height:65vh; width:100vw; margin-top:13rem">
    <span style="font-size:10rem;margin-bottom:1rem;">🛒</span>
      <p style="">
         Your cart is empty.
        </p> 
        <button onclick="window.location.href='index.html'" 
        style="padding:10px 20px;font-size:1rem;background:#007bff;color:white;border:none;border-radius:5px;cursor:pointer;">
        Shop Now
      </button>
      </div>
    `;
    listCartHTML.appendChild(emptyRow);
  }
};


const saveCart = () => {
  localStorage.setItem("carts", JSON.stringify(carts));
};


const params = new URLSearchParams(window.location.search);
const page = parseInt(params.get("page")) || 1;
const startIndex = (page - 1) * 6;

const initApp = () => {
  fetch("products.json")
    .then(response => response.json())
    .then(data => {
      products = data;

      if (productHtml) listProductHTML(startIndex);  // ✅ only if exists
      if (listCartHTML) addToCartHTML();             // ✅ only if exists
    })
    .catch(error => console.error("Error loading products:", error));
};


document.addEventListener("DOMContentLoaded", () => {
  initApp();
});


