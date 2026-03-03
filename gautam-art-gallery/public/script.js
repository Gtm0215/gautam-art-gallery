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
