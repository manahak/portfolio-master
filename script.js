//console.log("test");
//alert("test");

const sections = [
  { id: "accueil", label: "Accueil" },
  { id: "competences", label: "Compétences" },
  { id: "formation", label: "Formation" },
  { id: "experiences", label: "Expériences" },
  { id: "veille", label: "Veille" },
  { id: "cv", label: "CV" },
  { id: "contact", label: "Contact" }
];

const carouselTrack = document.getElementById("carousel-track");
let currentIndex = 0;
const visibleItems = 5; // nb d'éléments visibles à la fois
const totalItems = sections.length;
const buttonHeight = 90; // hauteur bouton + gap (ajustée aux boutons plus grands)

function getCarouselViewportHeight() { //hauteur visible du carousel
  const wrapper = document.querySelector(".carousel-wrapper");
  return wrapper ? wrapper.clientHeight : 600; // valeur fallback
}


function createButtons() {
  // plusieurs copies des boutons pr créer un effet de boucle infinie
  // 5 répétitions
  
  for (let cycle = -2; cycle <= 2; cycle++) {
	  
	  sections.forEach((section, index) => {
      const button = document.createElement("button");
      button.className = "carousel-button";
      button.textContent = section.label;
      button.dataset.index = index;
      button.onclick = () => { //scroll tt en haut de la page quand on clique sur bouton accueil -- Gestion du scroll de la page
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
		
		carouselTrack.appendChild(button);//Implémente le carousel de button à la page
	
    });
  }
}

function updateCarousel() {	

  const buttons = carouselTrack.querySelectorAll(".carousel-button"); //variable qui va contenir tt les boutons du carousel 

  // Calcul du décalage pour centrer le bouton actif dans le viewport
  const cycleOffset = totalItems * 2.05; // 2 cycles avant la centrale

  const viewportHeight = getCarouselViewportHeight();

  // position Y (transform translateY) pour centrer le bouton actif au milieu du viewport
  const centerPosition = (viewportHeight / 2) - (buttonHeight / 2);

  const translateY = centerPosition - (buttonHeight * (currentIndex + cycleOffset));
  carouselTrack.style.transform = `translateY(${translateY}px)`;

  // changer opacité et taille des boutons selon la distance au bouton actif
 
  buttons.forEach((btn, i) => {
	  
    // indice modulo pour retrouver l'index du bouton dans le set original
    const idx = i % totalItems;
	
    // distance en bouton par rapport à currentIndex
    let distance = Math.abs(idx - currentIndex);
	
    // prendre en compte le cycle pour distance (modulo totalItems)
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
  // scroll vers la section concernée
  const targetSection = sections[currentIndex];
  document.getElementById(targetSection.id).scrollIntoView({behavior: "smooth"});
}


window.addEventListener("load", () => {
    window.scrollTo(0, 0);
  createButtons();
  // centrer "Accueil" au chargement
  currentIndex = 0;
  updateCarousel();
});

window.addEventListener("scroll", () => {
  let closestIndex = 0;
  let minDistance = Infinity;

  sections.forEach((section, index) => {
    const el = document.getElementById(section.id);
	
	//Comment adapter le placement des boutons à la page
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
		modalImg.style.transform = 'translate(0px,100px) scale(1.5)'; // zoom 2x
		console.log
	} else {
		isZoomed = false;
		isDragging = false;
		modalImg.classList.remove('zoomed');		
		modalImg.style.transform = `translate(0px, 0px) scale(1)`;
		currentX = 0;
		currentY = 0;
	}
});

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

//// barre de progression
document.addEventListener('DOMContentLoaded', () => {
			  const circles = document.querySelectorAll('.progress-circle');

			  circles.forEach(circle => {
				const percent = parseInt(circle.getAttribute('data-percent'));
				const number = circle.querySelector('.number');
				let current = 0;

				const interval = setInterval(() => {
				  if (current >= percent) {
					clearInterval(interval);
				  } else {
					current++;
					circle.style.background = `conic-gradient(#7ebded 0% ${current}%, #2f2d3d ${current}% 100%)`;
					number.textContent = `${current}%`;
				  }
				}, 5);
			  });
			});

/// map
			var map = L.map('map').setView([44.20000, 0.63333], 13);

			var myIcon = L.icon({
				iconUrl: 'marker.png',
				iconSize: [40, 40]
			});

			 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			  }).addTo(map)
			  
			  
			  function CreateMarker(x,y){
				  
				  var marker = L.marker([x,y],{icon: myIcon});
				  var latLngs = [marker.getLatLng()];
				  var markerBounds = L.latLngBounds(latLngs);
				  
				  marker.addTo(map);
				  map.fitBounds(markerBounds);
				  
			  }
			  
			  function CalculDistance(){
					
				var latlngsLine =[
									[44.20219901112438,0.613596432464637],
									[48.84435810976229, 2.585499263256165],
								];
				var Line = L.polyline(latlngsLine, {color: 'blue'}).addTo(map);
				
				map.setView([46.79813189033166, 2.509669753820759], 6);

				 
			  }


