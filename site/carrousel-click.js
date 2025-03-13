document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".carousel")
    const carouselContainer = document.querySelector(".carousel-container")
    const cards = document.querySelectorAll(".card")
    const prevButton = document.querySelector(".carousel-button.prev")
    const nextButton = document.querySelector(".carousel-button.next")
    const indicatorsContainer = document.querySelector(".carousel-indicators")
  
    let currentIndex = 0
    let cardsPerSlide = 3 // Default, will be updated based on screen size
    let cardWidth = 0
    let carouselWidth = 0
    let slides = []
    let touchStartX = 0
    let touchEndX = 0
  
    // Function to determine how many cards to show based on screen width
    function calculateCardsPerSlide() {
      if (window.innerWidth < 480) {
        return 1 // Show 1 card on very small screens
      } else if (window.innerWidth < 768) {
        return 2 // Show 2 cards on mobile
      } else if (window.innerWidth < 1200) {
        return 3 // Show 3 cards on tablets and small desktops
      } else {
        return 3 // Show 3 cards on large screens
      }
    }
  
    // Function to calculate card dimensions and update carousel
    function setupCarousel() {
      // Update cards per slide based on current screen width
      cardsPerSlide = calculateCardsPerSlide()
  
      // Calculate card width including margins
      const cardStyle = window.getComputedStyle(cards[0])
      const cardMarginLeft = Number.parseInt(cardStyle.marginLeft) || 0
      const cardMarginRight = Number.parseInt(cardStyle.marginRight) || 0
      cardWidth = cards[0].offsetWidth + cardMarginLeft + cardMarginRight
  
      // Set carousel width based on cards per slide
      carouselWidth = cardWidth * cardsPerSlide
  
      // Create slides array based on cards per slide
      slides = []
      for (let i = 0; i < cards.length; i += cardsPerSlide) {
        const slideCards = []
        for (let j = i; j < i + cardsPerSlide && j < cards.length; j++) {
          slideCards.push(j)
        }
        slides.push(slideCards)
      }
  
      // Update indicators
      indicatorsContainer.innerHTML = ""
      for (let i = 0; i < slides.length; i++) {
        const indicator = document.createElement("div")
        indicator.classList.add("indicator")
        if (i === 0) indicator.classList.add("active")
        indicator.addEventListener("click", () => goToSlide(i))
        indicatorsContainer.appendChild(indicator)
      }
  
      // Reset to first slide when resizing
      currentIndex = 0
      updateCarousel()
    }
  
    function updateCarousel() {
      const translateValue = -currentIndex * carouselWidth
      carousel.style.transform = `translateX(${translateValue}px)`
  
      // Update indicators
      document.querySelectorAll(".indicator").forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentIndex)
      })
  
      // Update button visibility
      prevButton.style.visibility = currentIndex === 0 ? "hidden" : "visible"
      nextButton.style.visibility = currentIndex === slides.length - 1 ? "hidden" : "visible"
    }
  
    function goToSlide(index) {
      if (index >= 0 && index < slides.length) {
        currentIndex = index
        updateCarousel()
      }
    }
  
    function nextSlide() {
      if (currentIndex < slides.length - 1) {
        currentIndex++
        updateCarousel()
      }
    }
  
    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--
        updateCarousel()
      }
    }
  
    // Touch event handlers for mobile swipe
    function handleTouchStart(e) {
      touchStartX = e.touches[0].clientX
    }
  
    function handleTouchMove(e) {
      touchEndX = e.touches[0].clientX
    }
  
    function handleTouchEnd() {
      const touchDiff = touchStartX - touchEndX
  
      // If the touch was a significant swipe (more than 50px)
      if (Math.abs(touchDiff) > 50) {
        if (touchDiff > 0) {
          // Swipe left, go to next slide
          nextSlide()
        } else {
          // Swipe right, go to previous slide
          prevSlide()
        }
      }
    }
  
    // Event listeners
    prevButton.addEventListener("click", prevSlide)
    nextButton.addEventListener("click", nextSlide)
  
    // Add touch event listeners for mobile
    carouselContainer.addEventListener("touchstart", handleTouchStart, { passive: true })
    carouselContainer.addEventListener("touchmove", handleTouchMove, { passive: true })
    carouselContainer.addEventListener("touchend", handleTouchEnd)
  
    // Handle window resize
    let resizeTimer
    window.addEventListener("resize", () => {
      // Debounce resize event to prevent excessive recalculations
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setupCarousel()
      }, 250)
    })
  
    // Initialize carousel
    setupCarousel()
  
    // Add keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        prevSlide()
      } else if (e.key === "ArrowRight") {
        nextSlide()
      }
    })
  })
  
  