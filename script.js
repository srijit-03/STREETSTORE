let productHtml = document.querySelector('.category-grid');
let products = [];

const addDataToHtml = () => {
  productHtml.innerHTML = ""; 
  if (products.length > 0) {
    products.forEach(product => {
      let newProduct = document.createElement('div');
      newProduct.classList.add('product-card');
      newProduct.dataset.id = product.id;

      newProduct.innerHTML = `
        <div class="card-pic">
          <img src="${product.img}" alt="${product.name}">
        </div>
        <p class="para">${product.name}</p>
        <div class="price-cart">
          <p class="para">$${product.price}</p>
          <button class="add-to-cart">
            <i class="fa-solid fa-cart-shopping"></i> Cart
          </button>
        </div>
      `;

      productHtml.appendChild(newProduct);
    });
  }
};

productHtml.addEventListener('click', (event) => {
  let positionClick = event.target;
  if (positionClick.closest('.add-to-cart')) {
    let productCard = positionClick.closest('.product-card');
    let product_id = productCard.dataset.id;
  let product_name = productCard.querySelector('.para').textContent;
    alert(product_name);
  }
});


const initApp = () => {
  fetch('products.json')
    .then(response => response.json())
    .then(data => {
      products = data;
      addDataToHtml(); 
    })
    .catch(error => console.error("Error loading products:", error));
};

initApp(); 

