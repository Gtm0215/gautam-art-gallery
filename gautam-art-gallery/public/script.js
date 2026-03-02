function toggleMenu(){
  document.getElementById("navLinks").classList.toggle("active");
}

async function loadProducts(){
  const res = await fetch("/api/paintings");
  const products = await res.json();

  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  products.forEach(p=>{
    grid.innerHTML += `
      <div class="product-card">
        <img src="${p.image}">
        <div class="product-info">
          <h3>${p.title}</h3>
          <div class="price">₹${p.price}</div>
          <button class="btn">Add to Cart</button>
        </div>
      </div>
    `;
  });
}

loadProducts();
