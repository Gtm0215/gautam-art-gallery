async function loadHero() {
  const res = await fetch("/api/paintings");
  const data = await res.json();

  const hero = data.find(p => p.isHero === true);

  if (hero) {
    document.getElementById("heroSection").style.background =
      `url(${hero.image}) center/cover no-repeat`;
  }
}

loadHero();
