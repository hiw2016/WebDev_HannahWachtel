const galleries = {
  graphic: [
    { src: '../img/graphicDesign1.png', alt: 'Album cover design' },
    { src: '../img/graphicDesign2.png', alt: 'Advertisement design' },
    { src: '../img/graphicDesign3.png', alt: 'Poster design' },
    { src: '../img/graphicDesign4.png', alt: 'Magazine cover design' },
    { src: '../img/graphicDesign5.png', alt: 'Poster design' },
    { src: '../img/graphicDesign6.png', alt: 'Album cover design' },
  ],
  traditional: [
    { src: '../img/trad1.jpeg', alt: 'Traditional artwork' },
    { src: '../img/trad2.jpeg', alt: 'Traditional artwork' },
    { src: '../img/trad3.jpeg', alt: 'Traditional artwork' },
    { src: '../img/trad4.jpeg', alt: 'Traditional artwork' },
    { src: '../img/trad5.jpeg', alt: 'Traditional artwork' },
    { src: '../img/trad6.jpeg', alt: 'Traditional artwork' },
    { src: '../img/trad7.jpeg', alt: 'Traditional artwork' },
    { src: '../img/trad8.jpeg', alt: 'Traditional artwork' },
    { src: '../img/trad10.jpeg', alt: 'Traditional artwork' },
  ],
  digital: [
    { src: '../img/digitial1.PNG', alt: 'Digital illustration' },
    { src: '../img/digital2.PNG', alt: 'Digital illustration' },
    { src: '../img/digital3.jpg', alt: 'Digital illustration' },
    { src: '../img/digital4.PNG', alt: 'Digital illustration' },
    { src: '../img/digital5.PNG', alt: 'Digital illustration' },
    { src: '../img/digital6.PNG', alt: 'Digital illustration' },
  ],
}

if (window.gsap && document.querySelector('.hero-section')) {
  const heroTimeline = gsap.timeline({
    defaults: { duration: 0.9, ease: 'power2.out' },
  })

  heroTimeline
    .from('.site-header', { autoAlpha: 0, y: -18 })
    .from(
      '.hero-section h1, .hero-copy, .hero-section .custom-btn',
      {
        autoAlpha: 0,
        y: 26,
        stagger: 0.12,
      },
      '-=0.45',
    )
    .from(
      '.collage-img',
      {
        autoAlpha: 0,
        y: 34,
        rotation: 2,
        stagger: 0.14,
      },
      '-=0.55',
    )
    .from(
      '.collage-locket, .hero-flower, .hero-bow',
      {
        autoAlpha: 0,
        scale: 0.92,
        stagger: 0.1,
      },
      '-=0.55',
    )
}

const heroCollage = document.querySelector('.hero-collage')

if (window.gsap && heroCollage) {
  const movingPieces = heroCollage.querySelectorAll(
    '.collage-img, .collage-locket',
  )

  heroCollage.addEventListener('pointermove', (event) => {
    movingPieces.forEach((piece) => {
      const bounds = piece.getBoundingClientRect()
      const centerX = bounds.left + bounds.width / 2
      const centerY = bounds.top + bounds.height / 2
      const distanceX = centerX - event.clientX
      const distanceY = centerY - event.clientY
      const distance = Math.hypot(distanceX, distanceY) || 1
      const influence = Math.max(0, 1 - distance / 360)
      const push = 34 * influence

      gsap.to(piece, {
        x: (distanceX / distance) * push,
        y: (distanceY / distance) * push,
        duration: 0.45,
        ease: 'power2.out',
      })
    })
  })

  heroCollage.addEventListener('pointerleave', () => {
    gsap.to(movingPieces, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
    })
  })
}

const modal = document.getElementById('portfolioModal')
const modalTitle = document.getElementById('portfolioModalLabel')
const carouselElement = document.getElementById('portfolioCarousel')
const carouselInner = document.getElementById('portfolioCarouselInner')
const galleryThumbs = document.getElementById('portfolioGalleryThumbs')

function setActiveThumb(index) {
  if (!galleryThumbs) return

  galleryThumbs.querySelectorAll('button').forEach((button, buttonIndex) => {
    button.classList.toggle('active', buttonIndex === index)
  })
}

if (modal && modalTitle && carouselElement && carouselInner && galleryThumbs) {
  modal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget
    const galleryKey = button.dataset.gallery
    const gallery = galleries[galleryKey] || []
    const startIndex = Number(button.dataset.start || 0)

    modalTitle.textContent = button.dataset.galleryTitle || 'Portfolio Preview'
    carouselInner.innerHTML = gallery
      .map(
        (item, index) => `
          <div class="carousel-item${index === startIndex ? ' active' : ''}">
            <img src="${item.src}" class="d-block w-100" alt="${item.alt}" />
          </div>
        `,
      )
      .join('')

    galleryThumbs.innerHTML = gallery
      .map(
        (item, index) => `
          <button class="${index === startIndex ? 'active' : ''}" type="button" data-slide-to="${index}" aria-label="Open image ${index + 1}">
            <img src="${item.src}" alt="" />
          </button>
        `,
      )
      .join('')

    const carousel = bootstrap.Carousel.getOrCreateInstance(carouselElement, {
      interval: false,
      ride: false,
      touch: true,
    })

    carousel.to(startIndex)
    setActiveThumb(startIndex)
  })

  carouselElement.addEventListener('slid.bs.carousel', (event) => {
    setActiveThumb(event.to)
  })

  galleryThumbs.addEventListener('click', (event) => {
    const thumbButton = event.target.closest('button')
    if (!thumbButton) return

    const carousel = bootstrap.Carousel.getOrCreateInstance(carouselElement)
    carousel.to(Number(thumbButton.dataset.slideTo))
  })
}

const revealItems = document.querySelectorAll('.reveal')

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    { threshold: 0.25 },
  )

  revealItems.forEach((item) => observer.observe(item))
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'))
}
