const track = document.getElementById('track')
const btnL = document.getElementById('left')
const btnR = document.getElementById('right')

const SLIDE_W = 14.2
const GAP = 1.88
const STEP = SLIDE_W + GAP

let isAnimating = false
let direction = null

function getSlides() {
  return [...track.querySelectorAll('.itemTrack')]
}

function setPos(vw, animate) {
  track.style.transition = animate
    ? 'transform 0.45s ease'
    : 'none'
  track.style.transform = `translateX(${vw}vw)`
}

setPos(-STEP, false)

btnR.addEventListener('click', (e) => {
  e.preventDefault()
  if (isAnimating) return
  isAnimating = true
  direction = 'right'
  setPos(-STEP * 2, true)
})

btnL.addEventListener('click', (e) => {
  e.preventDefault()
  if (isAnimating) return
  isAnimating = true
  direction = 'left'
  setPos(0, true)
})

track.addEventListener('transitionend', (e) => {
  if (e.propertyName !== 'transform') return

  const slides = getSlides()

  if (direction === 'right') {
    track.appendChild(slides[0])
  } else if (direction === 'left') {
    track.insertBefore(slides[slides.length - 1], slides[0])
  }
  setPos(-STEP, false)
  
  direction = null
  isAnimating = false
})