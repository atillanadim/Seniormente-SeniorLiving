document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".carousel")
    const carouselContainer = document.querySelector(".carousel-container")
    const cards = carousel.querySelectorAll(".card")
    const prevButton = document.querySelector(".carousel-button.prev")
    const nextButton = document.querySelector(".carousel-button.next")
    const indicatorsContainer = document.querySelector(".carousel-indicators")
  
    let currentIndex = 0
    let visibleCards = 3 // Default value, will be updated based on screen size
    const totalCards = cards.length
  
    // Touch variables
    let touchStartX = 0
    let touchEndX = 0
    let isDragging = false
    let startTranslate = 0
  
    // Function to determine how many cards to show based on screen width
    function getVisibleCards() {
      if (window.innerWidth < 480) {
        return 1 // Show 1 card on very small screens
      } else if (window.innerWidth < 768) {
        return 2 // Show 2 cards on mobile
      } else {
        return 3 // Show 3 cards on larger screens
      }
    }
  
    // Function to calculate card dimensions and update carousel
    function getCardWidth() {
      const cardStyle = window.getComputedStyle(cards[0])
      const marginLeft = Number.parseInt(cardStyle.marginLeft) || 0
      const marginRight = Number.parseInt(cardStyle.marginRight) || 0
      return cards[0].offsetWidth + marginLeft + marginRight
    }
  
    function updateCarousel(animate = true) {
      // Update visible cards based on current screen size
      visibleCards = getVisibleCards()
  
      // Calculate card width with actual margins
      const cardWidth = getCardWidth()
  
      // Apply or remove transition based on animate parameter
      carousel.style.transition = animate ? "transform 0.5s ease" : "none"
  
      // Update transform
      carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`
  
      // Enable/disable buttons based on current position
      // Only disable if we're not using infinite loop
      if (currentIndex <= 0) {
        prevButton.classList.add("disabled")
      } else {
        prevButton.classList.remove("disabled")
      }
  
      if (currentIndex >= totalCards - visibleCards) {
        nextButton.classList.add("disabled")
      } else {
        nextButton.classList.remove("disabled")
      }
    }
  
    function showCards(index, animate = true) {
      // Implement infinite loop with boundaries
      if (index < 0) {
        currentIndex = totalCards - visibleCards
      } else if (index > totalCards - visibleCards) {
        currentIndex = 0
      } else {
        currentIndex = index
      }
  
      updateCarousel(animate)
    }
  
    // Touch event handlers
    function handleTouchStart(e) {
      touchStartX = e.type === "mousedown" ? e.clientX : e.touches[0].clientX
      isDragging = true
      startTranslate = -currentIndex * getCardWidth()
  
      // Remove transition during drag
      carousel.style.transition = "none"
  
      // Prevent default only for mouse events to avoid interfering with scroll
      if (e.type === "mousedown") {
        e.preventDefault()
      }
    }
  
    function handleTouchMove(e) {
      if (!isDragging) return
  
      const currentX = e.type === "mousemove" ? e.clientX : e.touches[0].clientX
      const diff = currentX - touchStartX
  
      // Move the carousel with the finger/mouse
      carousel.style.transform = `translateX(${startTranslate + diff}px)`
  
      // Prevent default only for mouse events
      if (e.type === "mousemove") {
        e.preventDefault()
      }
    }
  
    function handleTouchEnd(e) {
      if (!isDragging) return
  
      isDragging = false
      touchEndX = e.type === "mouseup" ? e.clientX : e.changedTouches ? e.changedTouches[0].clientX : touchStartX
  
      // Calculate the distance swiped
      const diff = touchEndX - touchStartX
      const cardWidth = getCardWidth()
  
      // Re-enable transition
      carousel.style.transition = "transform 0.5s ease"
  
      // If swiped more than 1/3 of card width, move to next/prev card
      if (Math.abs(diff) > cardWidth / 3) {
        if (diff > 0) {
          // Swiped right - go to previous
          showCards(currentIndex - 1)
        } else {
          // Swiped left - go to next
          showCards(currentIndex + 1)
        }
      } else {
        // Not swiped far enough, snap back
        updateCarousel()
      }
  
      // Prevent default only for mouse events
      if (e.type === "mouseup") {
        e.preventDefault()
      }
    }
  
    // Event listeners for buttons
    prevButton.addEventListener("click", () => {
      showCards(currentIndex - 1)
    })
  
    nextButton.addEventListener("click", () => {
      showCards(currentIndex + 1)
    })
  
    // Touch and mouse event listeners
    carouselContainer.addEventListener("touchstart", handleTouchStart, { passive: true })
    carouselContainer.addEventListener("touchmove", handleTouchMove, { passive: true })
    carouselContainer.addEventListener("touchend", handleTouchEnd)
  
    // Mouse events for desktop drag support
    carouselContainer.addEventListener("mousedown", handleTouchStart)
    window.addEventListener("mousemove", handleTouchMove)
    window.addEventListener("mouseup", handleTouchEnd)
  
    // Handle window resize
    let resizeTimer
    window.addEventListener("resize", () => {
      // Debounce resize event to prevent excessive recalculations
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        // Update without animation on resize
        updateCarousel(false)
      }, 250)
    })
  
    // Add keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        showCards(currentIndex - 1)
      } else if (e.key === "ArrowRight") {
        showCards(currentIndex + 1)
      }
    })
  
    // Add CSS for button disabled state if not already in your CSS
    const style = document.createElement("style")
    style.textContent = `
      .carousel-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
      }
      
      .carousel-container {
          cursor: grab;
      }
      
      .carousel-container:active {
          cursor: grabbing;
      }
  `
    document.head.appendChild(style)
  
    // Initialize carousel
    updateCarousel(false)
  })
  
  