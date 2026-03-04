async function loadHero() {
  try {
    const res = await fetch("/api/paintings");
    const data = await res.json();

    const hero = data.find(p => p.isHero === true);

    if (hero) {
      const heroSection = document.getElementById("heroSection");
      heroSection.style.backgroundImage = `url(${hero.image})`;
      heroSection.style.backgroundSize = "cover";
      heroSection.style.backgroundPosition = "center";
    }

  } catch (err) {
    console.log("Hero load error:", err);
  }
}

loadHero();
async function loadFeaturedProducts(){

const res = await fetch("/api/paintings/featured")
const products = await res.json()

const container = document.getElementById("featured-products")

if(!container) return

container.innerHTML=""

products.forEach(p=>{

container.innerHTML += `
<div class="product-card">

<img src="${p.image}">

<h3>${p.title}</h3>

<p>₹${p.price}</p>

<button onclick="addToCart('${p._id}')">Add to Cart</button>

<button onclick="buyNow('${p._id}')">Buy Now</button>

</div>
`

})

}

loadFeaturedProducts()
