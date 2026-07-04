const sortBtn = document.querySelectorAll(".cardLinks"),
  sortItem = document.querySelectorAll(".gridItem")

sortBtn.forEach(itemBtn => {
  if (itemBtn.classList.contains("activeBtn")) {
    sortItem.forEach(bl => {
      if (itemBtn.textContent == bl.dataset.category || itemBtn.textContent == "All") {
        bl.classList.add("active")
      } else {
        bl.classList.remove("bl")
      }
    })
  }
  itemBtn.addEventListener("click", function (e) {
    sortBtn.forEach(item => {
      item.classList.remove("activeBtn")
    })
    console.log("+");
    e.preventDefault()
    sortItem.forEach(bl => {
      if (itemBtn.textContent == bl.dataset.category || itemBtn.textContent == "All") {
        console.log(bl)
        bl.classList.add("active")
      } else {
        bl.classList.remove("active")
      }
      if (!itemBtn.classList.contains("activeBtn")) {
        itemBtn.classList.add("activeBtn")
      }
    })
  })
})

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

let touchStartX = 0
let touchCurrentX = 0
let isSwiping = false
const SWIPE_THRESHOLD = 50

track.addEventListener('touchstart', function (e) {
  if (isAnimating) return
  touchStartX = e.touches[0].clientX
  touchCurrentX = touchStartX
  isSwiping = true
  track.style.transition = "none"
}, {
  passive: true
})

track.addEventListener('touchmove', function (e) {
  if (!isSwiping) return
  touchCurrentX = e.touches[0].clientX
  const delta = touchCurrentX - touchStartX
  track.style.transform = `translateX(${delta}px)`
}, {
  passive: true
})

track.addEventListener('touchend', function () {
  if (!isSwiping) return
  isSwiping = false

  const delta = touchCurrentX - touchStartX

  track.style.transition = "all .5s ease"

  if (Math.abs(delta) < SWIPE_THRESHOLD) {
    track.style.transform = "none"
    return
  }

  if (delta < 0) {
    items.push(items.shift())
    gotoIndex(1)
  } else {
    items.unshift(items.pop())
    gotoIndex(-1)
  }
})

//category change

const worksFilterList = document.querySelector('.works ul')
const gridItems = document.querySelectorAll('.gridItem')

function applyFilter(filter) {
  worksFilterList.querySelectorAll('a').forEach(a => {
    a.classList.toggle('active', a.dataset.filter === filter)
  })

  gridItems.forEach(item => {
    if (filter === 'all' || item.dataset.category === filter) {
      item.classList.remove('hidden')
    } else {
      item.classList.add('hidden')
    }
  })
}

worksFilterList.addEventListener('click', function (e) {
  e.preventDefault()
  const link = e.target.closest('a')
  if (!link) return

  const filter = link.dataset.filter
  localStorage.setItem('worksFilter', filter)
  applyFilter(filter)
})

const savedFilter = localStorage.getItem('worksFilter')
applyFilter(savedFilter || 'all')

//parallax

const parallaxBackgrounds = document.querySelectorAll(".parallax-bg")

document.addEventListener("mousemove", parallax)

function parallax(event) {
  const depth = 15

  const x = (event.clientX / window.innerWidth - 0.5) * depth
  const y = (event.clientY / window.innerHeight - 0.5) * depth

  parallaxBackgrounds.forEach(item => {
    item.style.transform = `scale(1.08) translate(${x}px, ${y}px)`
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
  const h1 = document.getElementById("edith1");
  const black = document.getElementById("blackbg");

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
        newBlock.setAttribute('draggable', 'true');
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
      return slot.querySelector('.dragblock') ?.dataset.word;
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

//formpopup

const formpop = document.querySelector(".formpopup"),
  formsub = document.querySelector(".submit"),
  req = document.querySelectorAll(".reqinpform"),
  errform = document.querySelector(".errorform"),
  closepopup = document.querySelectorAll('.closepopup'),
  namein = document.getElementById("namein"),
  mailin = document.getElementById("mailin"),
  subjin = document.getElementById("subjin"),
  compin = document.getElementById("compin"),
  messin = document.getElementById("messin"),
  editableinfo = document.getElementById("editableinfo"),
  submitform = document.querySelector(".submitform")

formsub.addEventListener("click", function (e) {
  let isValid = true;

  req.forEach((item) => {
    if (item.value.trim() === "") {
      isValid = false;
      item.classList.add("errorinp");
    } else {
      item.classList.remove("errorinp");
    }
  });

  if (isValid) {
    e.preventDefault();
    editableinfo.innerHTML = `<p>Ви впевнені? Первірте ще раз введену інформацію</p><form action="" method="post" id="forminfo"><p name="name"><span style="font-weight: bold;">Ваше ім'я:</span> ${namein.value}</p><p name="mail"><span style="font-weight: bold;">Ваша ел. адреса:</span> ${mailin.value}</p><p name="subj"><span style="font-weight: bold;">Тема вашого повідомлення:</span> ${subjin.value}</p><p name="comp"><span style="font-weight: bold;">Назва вашої компанії:</span> ${compin.value}</p><div><p name="mess"><span style="font-weight: bold;">Ваше повідомлення:</span></p><p>${messin.value}</p><div></form>`;
    formpop.style.display = "block";
    black.style.display = "block";
  } else {
    errform.style.display = "block";
    black.style.display = "block";
    e.preventDefault();
  }
});

closepopup.forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault()
    errform.style.display = "none"
    black.style.display = "none"
    formpop.style.display = "none"
  })
})

submitform.addEventListener("click", function (e) {
  e.preventDefault();

  const data = {
    name: namein.value,
    mail: mailin.value,
    subject: subjin.value,
    company: compin.value,
    message: messin.value
  };

  localStorage.setItem('formData', JSON.stringify(data));
  submitform.style.display = "none"
  editableinfo.innerHTML = "<p>Надіслано! Тепер ви можете закрити це вікно на хрестик</p>"

});

window.addEventListener('DOMContentLoaded', function () {
  const savedData = localStorage.getItem('formData');

  if (savedData) {
    const formData = JSON.parse(savedData);

    namein.value = formData.name || '';
    mailin.value = formData.mail || '';
    subjin.value = formData.subject || '';
    compin.value = formData.company || '';
    messin.value = formData.message || '';
  }
});

//quote slider

const quotesTrack = document.querySelector('.quotes-track')
const quotesSlider = document.querySelector('.quotes-slider')
const quotes = [...document.querySelectorAll('.quote-item')]
const quotesbuttons = [...document.querySelectorAll('.quote-btn')]

let quoteindex = 0
let animatingquote = false
const DURATION = 250
const AUTOPLAY_DELAY = 4000

let autoplayInterval = null

function updateTrackHeight() {
  const active = quotes[quoteindex]
}

function goToSlide(index) {
  if (animatingquote || index === quoteindex) return
  animatingquote = true

  const current = quotes[quoteindex]
  const next = quotes[index]

  current.classList.remove('is-active')

  quotesbuttons[quoteindex].classList.remove('is-active')
  quotesbuttons[index].classList.add('is-active')

  setTimeout(() => {
    next.classList.add('is-active')
    quoteindex = index
    animatingquote = false
    updateTrackHeight()
  }, DURATION)
}

function nextSlide() {
  const nextIndex = (quoteindex + 1) % quotes.length
  goToSlide(nextIndex)
}

function startAutoplay() {
  stopAutoplay()
  autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY)
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

quotesbuttons.forEach((btn, i) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    goToSlide(i)
    startAutoplay()
  })
})

quotesSlider.addEventListener('mouseenter', stopAutoplay)
quotesSlider.addEventListener('mouseleave', startAutoplay)

updateTrackHeight()
startAutoplay()

//logo slider

const logosWrapper = document.querySelector('.reviewLogos')
const logosTrack = document.getElementById('logosTrack')


logosTrack.innerHTML += logosTrack.innerHTML

let logoSpeed = 60
let logoPosition = 0
let logoPaused = false
let lastTimestamp = null
let singleSetWidth = 0

function calculateSingleSetWidth() {
  const allItems = [...logosTrack.children]
  const half = allItems.length / 2
  const gap = parseFloat(getComputedStyle(logosTrack).gap) || 0
  let width = 0
  for (let i = 0; i < half; i++) {
    width += allItems[i].getBoundingClientRect().width + gap
  }
  return width
}

function animateLogos(timestamp) {
  if (lastTimestamp === null) lastTimestamp = timestamp
  const delta = (timestamp - lastTimestamp) / 1000
  lastTimestamp = timestamp

  if (!logoPaused) {
    logoPosition -= logoSpeed * delta

    if (Math.abs(logoPosition) >= singleSetWidth) {
      logoPosition += singleSetWidth
    }

    logosTrack.style.transform = `translateX(${logoPosition}px)`
  }

  requestAnimationFrame(animateLogos)
}

window.addEventListener('load', () => {
  singleSetWidth = calculateSingleSetWidth()
  requestAnimationFrame(animateLogos)
})

window.addEventListener('resize', () => {
  singleSetWidth = calculateSingleSetWidth()
})

logosWrapper.addEventListener('mouseenter', () => {
  logoPaused = true
})

logosWrapper.addEventListener('mouseleave', () => {
  logoPaused = false
  lastTimestamp = null
})

//fade

const fadeSections = document.querySelectorAll('.fade-section')

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.toggle('is-visible', entry.isIntersecting)
  })
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -100px 0px'
})

fadeSections.forEach(section => {
  fadeObserver.observe(section)
})

//read more

const parentread = document.querySelectorAll(".blogItemContent")

parentread.forEach(item => {
  const textread = item.querySelector(".contentMore"),
    btnread = item.querySelector(".readmore")

  btnread.addEventListener("click", function (e) {
    e.preventDefault()
      textread.classList.toggle("visibleread")
      if (textread.classList.contains("visibleread")) {
        btnread.textContent = "close"
      } else {
        btnread.textContent = "read more"
      }
  })
});

//cart

const productsObj = {
  1: {
    "id": 1,
    "name": "Hair Dresser",
    "img": "img/work1.png",
    "quantity": "1",
    "price": "15000"
  },
  2: {
    "id": 2,
    "name": "",
    "img": "",
    "quantity": "",
    "price": ""
  },
  3: {
    "id": 3,
    "name": "",
    "img": "",
    "quantity": "",
    "price": ""
  },
  4: {
    "id": "",
    "name": "",
    "img": "",
    "quantity": "",
    "price": ""
  },
  5: {
    "id": "",
    "name": "",
    "img": "",
    "quantity": "",
    "price": ""
  },
  6: {
    "id": "",
    "name": "",
    "img": "",
    "quantity": "",
    "price": ""
  },
  7: {
    "id": "",
    "name": "",
    "img": "",
    "quantity": "",
    "price": ""
  },
  8: {
    "id": "",
    "name": "",
    "img": "",
    "quantity": "",
    "price": ""
  },
  9: {
    "id": "",
    "name": "",
    "img": "",
    "quantity": "",
    "price": ""
  }
}

const parentcard = document.querySelectorAll(".gridItem")

parentcard.forEach(item => {
  const btncard = item.querySelector(".view-btn")
  btncard.addEventListener("click", function(e) {
    e.preventDefault()
    let productId = btncard.dataset.id
    // for(let product of productsObj) {
    //   console.log(product)
    // }
    const product = Object.values(productsObj).find(item => productId == item.id)
    localStorage.setItem("cart", JSON.stringify(product))
    if(localStorage.getItem("cart") != null) {
      
    }
    console.log(product)
  })
})