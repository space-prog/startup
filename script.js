const track = document.getElementById('track')
const btnL = document.getElementById('btnLeft')
const btnR = document.getElementById('btnRight')

const SLIDE_W = 315
const items = [...track.querySelectorAll('.itemTrack')]
const itemsLength = items.length

let isAnimating = false
let idx = 0

function updateSlider() {
  while (track.firstChild) {
    track.removeChild(track.firstChild)
  }
  const firstClone = items[itemsLength - 1].cloneNode(true)
  const lastClone = items[0].cloneNode(true)
  firstClone.style.left = `${-SLIDE_W}px`
  lastClone.style.left = `${SLIDE_W * itemsLength}px`
  track.insertAdjacentElement('afterbegin', firstClone)
  track.appendChild(lastClone)

  for (let i = 0; i < itemsLength; i++) {
    let item = items[i].cloneNode(true)
    item.style.left = `${SLIDE_W * i}px`
    track.appendChild(item)
  }
}

function gotoIndex(index) {
  isAnimating = true
  let distance = -index * SLIDE_W
  idx = (idx + itemsLength + index) / itemsLength
  track.style.transition = "all .5s ease"
  track.style.transform = `translateX(${distance}px)`
  setTimeout(() => {
    track.style.transform = "none"
    track.style.transition = "none"
    isAnimating = false
    updateSlider()
  }, 500)
}

btnL.addEventListener("click", function (e) {
  e.preventDefault()
  items.unshift(items.pop())
  gotoIndex(-1)
})

btnR.addEventListener("click", function (e) {
  e.preventDefault()
  items.push(items.shift())
  gotoIndex(1)
})

updateSlider()

//category change

document.querySelector('.works ul').addEventListener('click', function (e) {
  e.preventDefault();
  const link = e.target.closest('a');
  if (!link) return;

  this.querySelectorAll('a').forEach(a => a.classList.remove('active'));
  link.classList.add('active');

  const filter = link.dataset.filter;

  document.querySelectorAll('.gridItem').forEach(item => {
    if (filter === 'all' || item.dataset.category === filter) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
});