fetch("/api/paintings")
.then(res => res.json())
.then(data => {
const gallery = document.getElementById("gallery");
data.forEach(p => {
gallery.innerHTML += `
<div class="card">
<img src="${p.image}">
<h3>${p.title}</h3>
<p>₹${p.price}</p>
<p>👍 ${p.likes} 👎 ${p.dislikes}</p>
<button onclick="like('${p._id}')">Like</button>
<button onclick="dislike('${p._id}')">Dislike</button>
<a href="${p.image}" download>Download</a>
<button onclick="window.open('https://wa.me/91YOURNUMBER?text=I want to buy ${p.title}')">Purchase</button>
</div>
`;
});
});

function like(id){
fetch("/api/like/"+id,{method:"POST"})
.then(()=>location.reload());
}

function dislike(id){
fetch("/api/dislike/"+id,{method:"POST"})
.then(()=>location.reload());
}