async function loadPaintings() {
  const res = await fetch("/api/paintings");
  const paintings = await res.json();

  const container = document.getElementById("gallery");
  container.innerHTML = "";

  paintings.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image}">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <p><strong>₹ ${p.price}</strong></p>
        <p>❤️ ${p.likes}</p>
        <button onclick="likePainting('${p._id}')">Like</button>
      </div>
    `;
  });
}

async function likePainting(id) {
  await fetch("/api/paintings/like/" + id, {
    method: "POST"
  });
  loadPaintings();
}

if (document.getElementById("gallery")) {
  loadPaintings();
}
