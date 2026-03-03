async function loadHome() {

  const res = await fetch("/api/paintings");
  const data = await res.json();

  const heroSection = document.getElementById("heroSection");
  const exploreGrid = document.getElementById("exploreGrid");
  const productGrid = document.getElementById("productGrid");

  exploreGrid.innerHTML = "";
  productGrid.innerHTML = "";

  data.forEach(item => {

    // HERO
    if(item.isHero){
      heroSection.style.background =
        `url(${item.image}) center/cover no-repeat`;
    }

    // EXPLORE
    if(item.section === "explore"){
      exploreGrid.innerHTML += `
        <div class="explore-card">
          <img src="${item.image}">
          <span>${item.title}</span>
        </div>
      `;
    }

    // FEATURED
    if(item.section === "featured"){
      productGrid.innerHTML += `
        <div class="product-card">
          <img src="${item.image}">
          <div class="product-info">
            <h3>${item.title}</h3>
            <div class="price">₹${item.price}</div>
            <button class="btn">Add to Cart</button>
          </div>
        </div>
      `;
    }

  });

}

loadHome();
