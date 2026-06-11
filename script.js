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

//parallax

document.addEventListener("mousemove", parallax);

function parallax(event) {
  const block = document.querySelectorAll(".parallax-block");
  const depth = 0.5;

  const x = (window.innerWidth - event.pageX * depth) / 120;
  const y = (window.innerHeight - event.pageY * depth) / 120;

  block.forEach(item => {
    item.style.backgroundPosition = `${x}px ${y}px`;
  })
}

//popup

const closeBtn = document.querySelector(".closepopup"),
  popup = document.querySelector('.authpopup'),
  black = document.querySelector('.blackbg'),
  start = document.getElementById('start')

closeBtn.addEventListener('click', function () {
  popup.style.display = "none"
  black.style.display = "none"
})
start.addEventListener('click', function (e) {
  e.preventDefault()
  popup.style.display = "block"
  black.style.display = "block"
})

//drag'n drop

document.addEventListener('DOMContentLoaded', function () {

  const dragblocks = document.querySelectorAll('.dragblock');
  const positionSlots = document.querySelectorAll('.dragblockpos');
  const closepopup = document.querySelector('.closepopup');
  const successMessage = document.querySelector('.success-message');
  const h1 = document.getElementById("edith1")

  const correctOrder = ['StartUp', 'Is', 'The', 'Best'];

  let draggedBlock = null;

  dragblocks.forEach(block => {
    block.addEventListener('dragstart', function (e) {
      draggedBlock = this;
      this.classList.add('dragging');
      e.dataTransfer.setData('text/plain', this.dataset.word);
      this.style.opacity = '0.5';
    });

    block.addEventListener('dragend', function (e) {
      this.classList.remove('dragging');
      this.style.opacity = '1';
      draggedBlock = null;

      positionSlots.forEach(slot => {
        slot.classList.remove('hover-slot');
      });
    });
  });

  positionSlots.forEach(slot => {
    slot.addEventListener('dragover', function (e) {
      e.preventDefault();
    });

    slot.addEventListener('dragenter', function (e) {
      e.preventDefault();
      if (!slot.classList.contains('filled')) {
        slot.classList.add('hover-slot');
      }
    });

    slot.addEventListener('dragleave', function (e) {
      slot.classList.remove('hover-slot');
    });

    slot.addEventListener('drop', function (e) {
      e.preventDefault();
      slot.classList.remove('hover-slot');

      const word = e.dataTransfer.getData('text/plain');

      if (slot.classList.contains('filled')) {
        return;
      }

      if (draggedBlock) {
        draggedBlock.remove();

        const newBlock = document.createElement('div');
        newBlock.className = 'dragblock filled dropped';
        newBlock.dataset.word = word;
        newBlock.textContent = word;
        newBlock.style.cursor = 'grab';
        slot.appendChild(newBlock);
        slot.classList.add('filled');
        addDragEventsToMovedBlock(newBlock, slot);
        checkSentenceCompletion();
      }
    });
  });

  function addDragEventsToMovedBlock(block, currentSlot) {
    block.addEventListener('dragstart', function (e) {
      draggedBlock = this;
      this.classList.add('dragging');
      e.dataTransfer.setData('text/plain', this.dataset.word);
      this.style.opacity = '0.5';
      currentSlot.classList.remove('filled');
    });

    block.addEventListener('dragend', function (e) {
      this.classList.remove('dragging');
      this.style.opacity = '1';
      draggedBlock = null;

      positionSlots.forEach(slot => {
        slot.classList.remove('hover-slot');
      });

      if (!this.parentElement.classList.contains('dragblockpos')) {
        currentSlot.classList.add('filled');
      }
    });
  }

  function checkSentenceCompletion() {
    const filledSlots = Array.from(positionSlots).filter(slot => slot.classList.contains('filled'));

    if (filledSlots.length !== 4) return;

    const currentOrder = filledSlots.map(slot => {
      return slot.querySelector('.dragblock')?.dataset.word;
    });

    const correctOrder = ['StartUp', 'Is', 'The', 'Best'];
    const isCorrect = currentOrder.every((word, index) => word === correctOrder[index]);

    if (isCorrect) {
      filledSlots.forEach(slot => slot.classList.add('correct'));
      showSuccess();
    }
  }

  function showSuccess() {
    h1.textContent = "Hello Developer!!!!"
    document.querySelector('.authpopup').style.display = 'none';
    successMessage.style.display = 'none';
    black.style.display = 'none'
  }
});


//tripple

const trippleClick = document.querySelector('.trippleclick'),
      changeText = document.querySelectorAll('.change3Text')

trippleClick.addEventListener('click', function (e) {
  if (e.detail === 3) {
    changeText.forEach(item => {
      item.textContent = "Hack This Site"
      item.style.color = "#c0301c"
      item.style.fontWeight = "900"
    })
  }
})