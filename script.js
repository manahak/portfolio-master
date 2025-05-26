//console.log("test");
//alert("test");

const sections = [
  { id: "accueil", label: "Accueil" },
  { id: "competences", label: "Compétences" },
  { id: "formation", label: "Formations" },
  { id: "experiences", label: "Expériences" },
  { id: "veille", label: "Veille" },
  { id: "cv", label: "CV" },
  { id: "contact", label: "Contact" }
];

const carouselTrack = document.getElementById("carousel-track");
let currentIndex = 0;
const visibleItems = 5; // Nombre d'éléments visibles à la fois
const totalItems = sections.length;
const buttonHeight = 90; // Hauteur d'un bouton + gap (ajustée aux boutons plus grands)

function getCarouselViewportHeight() { //hauteur visible du carousel
  const wrapper = document.querySelector(".carousel-wrapper");
  return wrapper ? wrapper.clientHeight : 600; // valeur fallback
}


function createButtons() {
  // On crée plusieurs copies des boutons pour créer un effet de boucle infinie
  // Nous créons 5 cycles pour assurer un défilement fluide et continu
  for (let cycle = -2; cycle <= 2; cycle++) {
    sections.forEach((section, index) => {
      const button = document.createElement("button");
      button.className = "carousel-button";
      button.textContent = section.label;
      button.dataset.index = index;

      button.onclick = () => { //scroll tt en haut de la page quand on clique sur bouton accueil
        currentIndex = index;
        updateCarousel();

        if (section.id === "accueil") {
            // Fait défiler tout en haut de la page
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            // Sinon, scroll vers la section correspondante
            document.getElementById(section.id).scrollIntoView({ behavior: "smooth" });
        }
    };

      carouselTrack.appendChild(button);
    });
  }
}

function updateCarousel() {
  const buttons = carouselTrack.querySelectorAll(".carousel-button");
  // Nombre total de boutons = totalItems * 5 (pour 5 cycles)

  // Calcul du décalage pour centrer le bouton actif dans le viewport
  // Le bouton actif est dans le cycle central (3ème cycle = index 2)
  const cycleOffset = totalItems * 2.05; // 2 cycles avant la centrale

    const viewportHeight = getCarouselViewportHeight();
  // La position Y (transform translateY) pour centrer le bouton actif au milieu du viewport
  const centerPosition = (viewportHeight / 2) - (buttonHeight / 2);

    const translateY = centerPosition - (buttonHeight * (currentIndex + cycleOffset));
    carouselTrack.style.transform = `translateY(${translateY}px)`;

  // Mettre à jour l'opacité et la taille des boutons selon la distance au bouton actif
  buttons.forEach((btn, i) => {
    // L'indice modulo pour retrouver l'index du bouton dans le set original
    const idx = i % totalItems;
    // Distance en bouton par rapport à currentIndex
    let distance = Math.abs(idx - currentIndex);
    // Prendre en compte le cycle pour distance (modulo totalItems)
    if (distance > totalItems / 2) distance = totalItems - distance;

    // boutons cliquables ou non ds le carousel. gestion des classes
    if (idx === currentIndex) {
        btn.classList.add("active");
        btn.style.opacity = 1;
        btn.style.transform = "scale(1.2)";
        btn.style.pointerEvents = "auto";
    } else if (distance <= 1) {
        btn.classList.remove("active");
        btn.style.opacity = 0.5;
        btn.style.transform = "scale(1)";
        btn.style.pointerEvents = "auto";
    } else if (distance <= 2) {
        btn.classList.remove("active");
        btn.style.opacity = 0.4;
        btn.style.transform = "scale(0.9)";
        btn.style.pointerEvents = "auto";
    } else {
        btn.classList.remove("active");
        btn.style.opacity = 0.2;
        btn.style.transform = "scale(0.8)";
        btn.style.pointerEvents = "auto";
    }

  });
}

function moveCarousel(direction) {
  currentIndex = (currentIndex + direction + totalItems) % totalItems;
  updateCarousel();
  // Scroll vers la section correspondante
  const targetSection = sections[currentIndex];
  document.getElementById(targetSection.id).scrollIntoView({behavior: "smooth"});
}

window.addEventListener("load", () => {
    window.scrollTo(0, 0);
  createButtons();
  // Centrer "Accueil" au chargement
  currentIndex = 0;
  updateCarousel();
});

window.addEventListener("scroll", () => {
  let closestIndex = 0;
  let minDistance = Infinity;

  sections.forEach((section, index) => {
    const el = document.getElementById(section.id);
    const rect = el.getBoundingClientRect();
    const distance = Math.abs(rect.top - window.innerHeight / 5);

    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  });

  if (closestIndex !== currentIndex) {
    currentIndex = closestIndex;
    updateCarousel();
  }
});

// pour prévisualisation d'images
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.querySelector(".close");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const images = [...document.querySelectorAll(".clickable-img")];
let modalCurrentIndex = 0;

function openModal(index) {
    currentIndex = index;
    modal.style.display = "block";
    modalImg.src = images[currentIndex].src;
}

function closeModal() {
    modal.style.display = "none";
}

function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentIndex].src;
}

function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    modalImg.src = images[currentIndex].src;
}

images.forEach((img, idx) => {
    img.addEventListener("click", () => openModal(idx));
});

closeBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
});

nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
});

//gérer zoom + drag (clic-glissé pour déplacer l’image zoomée)

let isZoomed = false;
let isDragging = false;
let startX, startY, currentX = 0, currentY = 0;

modalImg.style.transform = "translate(0px, 0px) scale(1)";

modalImg.addEventListener('click', () => {
	if (!isZoomed) {
		isZoomed = true;
		modalImg.classList.add('zoomed');
		modalImg.style.transform = `translate(0px, 0px) scale(2)`; // zoom 2x
	} else {
		isZoomed = false;
		isDragging = false;
		modalImg.classList.remove('zoomed', 'dragging');
		modalImg.style.transform = `translate(0px, 0px) scale(1)`;
		currentX = 0;
		currentY = 0;
	}
});

modalImg.addEventListener('mousedown', (e) => {
	if (!isZoomed) return;
	isDragging = true;
	startX = e.clientX - currentX;
	startY = e.clientY - currentY;
	modalImg.classList.add('dragging');
});

window.addEventListener('mouseup', () => {
	if (!isDragging) return;
	isDragging = false;
	modalImg.classList.remove('dragging');
});

window.addEventListener('mousemove', (e) => {
	if (!isDragging) return;
	currentX = e.clientX - startX;
	currentY = e.clientY - startY;
	modalImg.style.transform = `translate(${currentX}px, ${currentY}px) scale(2)`;
});/////////////////

// scroll smooth au clic (bouton "retour haut de la page" sur mobile)
document.getElementById('scrollToTopBtn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

///// écran de chargement

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  loader.style.opacity = "0";
  setTimeout(() => {
    loader.style.display = "none";
  }, 500);
});


