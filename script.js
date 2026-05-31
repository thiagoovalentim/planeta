// =========================================
// HEADER SCROLL
// =========================================

const header = document.querySelector(".header");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileMenu = document.getElementById("mobileMenu");

window.addEventListener("scroll", () => {
  if (!header) return;

  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// =========================================
// MENU MOBILE
// =========================================

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");

    const icon = mobileMenuButton.querySelector("i");

    if (icon) {
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-xmark");
    }
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetSelector = link.getAttribute("href");

    if (targetSelector === "#") return;

    const target = document.querySelector(targetSelector);

    if (target) {
      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      if (mobileMenu) {
        mobileMenu.classList.remove("active");
      }

      const icon = mobileMenuButton?.querySelector("i");

      if (icon) {
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-xmark");
      }
    }
  });
});

// =========================================
// CARROSSEL
// =========================================

const carousel = document.getElementById("destinationsCarousel");
const prevButton = document.querySelector(".carousel-prev");
const nextButton = document.querySelector(".carousel-next");
const dotsContainer = document.getElementById("carouselDots");

function getCardScrollSize() {
  if (!carousel) return 0;

  const card = carousel.querySelector(".destination-card");
  if (!card) return 0;

  const gap = parseInt(window.getComputedStyle(carousel).gap) || 0;
  return card.offsetWidth + gap;
}

function getVisibleCards() {
  if (!carousel) return 1;

  const cardSize = getCardScrollSize();
  if (cardSize === 0) return 1;

  return Math.max(1, Math.round(carousel.offsetWidth / cardSize));
}

function getTotalPages() {
  if (!carousel) return 1;

  const totalCards = carousel.querySelectorAll(".destination-card").length;
  const visibleCards = getVisibleCards();

  return Math.ceil(totalCards / visibleCards);
}

function getCurrentPage() {
  if (!carousel) return 0;

  const cardSize = getCardScrollSize();
  const visibleCards = getVisibleCards();

  if (cardSize === 0) return 0;

  return Math.round(carousel.scrollLeft / (cardSize * visibleCards));
}

function createDots() {
  if (!dotsContainer || !carousel) return;

  dotsContainer.innerHTML = "";

  const totalPages = getTotalPages();

  for (let index = 0; index < totalPages; index++) {
    const dot = document.createElement("button");

    dot.classList.add("carousel-dot");
    dot.setAttribute("aria-label", `Ir para página ${index + 1}`);

    if (index === 0) {
      dot.classList.add("active");
    }

    dot.addEventListener("click", () => {
      const cardSize = getCardScrollSize();
      const visibleCards = getVisibleCards();

      carousel.scrollTo({
        left: index * cardSize * visibleCards,
        behavior: "smooth"
      });
    });

    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  if (!dotsContainer) return;

  const dots = dotsContainer.querySelectorAll(".carousel-dot");
  const currentPage = getCurrentPage();

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentPage);
  });
}

if (carousel && prevButton && nextButton) {
  nextButton.addEventListener("click", () => {
    const cardSize = getCardScrollSize();
    const visibleCards = getVisibleCards();

    carousel.scrollBy({
      left: cardSize * visibleCards,
      behavior: "smooth"
    });
  });

  prevButton.addEventListener("click", () => {
    const cardSize = getCardScrollSize();
    const visibleCards = getVisibleCards();

    carousel.scrollBy({
      left: -cardSize * visibleCards,
      behavior: "smooth"
    });
  });

  carousel.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateDots);
  });

  window.addEventListener("resize", () => {
    createDots();
    updateDots();
  });

  createDots();
}
