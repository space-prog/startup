//burger menu

const burgerBtn = document.getElementById("burgerBtn")
const mainMenu = document.getElementById("mainMenu")

if (burgerBtn && mainMenu) {
  burgerBtn.addEventListener("click", function () {
    burgerBtn.classList.toggle("active")
    mainMenu.classList.toggle("active")
  })

  mainMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function () {
      burgerBtn.classList.remove("active")
      mainMenu.classList.remove("active")
    })
  })
}

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

//slider

const track = document.getElementById('track')
const btnL = document.getElementById('btnLeft')
const btnR = document.getElementById('btnRight')
const fixedWrap = document.getElementById('fix')

const GAP = 30
const items = [...track.querySelectorAll('.itemTrack')]
const itemsLength = items.length

let SLIDE_W = 315
let isAnimating = false
let idx = 0

function getVisibleCount() {
  const w = window.innerWidth
  if (w <= 767) return 1
  if (w <= 1023) return 2
  if (w <= 1439) return 3
  if (w <= 1919) return 4
  if (w <= 2559) return 4
  return 4
}

function calcSlideWidth() {
  const visibleCount = getVisibleCount()
  const containerWidth = fixedWrap.clientWidth
  const cardWidth = (containerWidth - GAP * (visibleCount - 1)) / visibleCount
  SLIDE_W = cardWidth + GAP
  track.style.setProperty('--slide-w', `${cardWidth}px`)
}

function syncHeight() {
  const sample = track.querySelector('.itemTrack')
  if (!sample) return
  const h = sample.offsetHeight
  track.style.height = `${h}px`
  fixedWrap.style.height = `${h}px`
}

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

  syncHeight()
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
  if (isAnimating) return
  items.unshift(items.pop())
  gotoIndex(-1)
})

btnR.addEventListener("click", function (e) {
  e.preventDefault()
  if (isAnimating) return
  items.push(items.shift())
  gotoIndex(1)
})

calcSlideWidth()
updateSlider()

let resizeTimer
window.addEventListener('resize', function () {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    calcSlideWidth()
    syncHeight()
    updateSlider()
  }, 150)
})

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
    const categories = item.dataset.category.split(' ')
    if (filter === 'all' || categories.includes(filter)) {
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

  const savedOrder = JSON.parse(localStorage.getItem('puzzleOrder'));

  if (savedOrder && savedOrder.length === positionSlots.length) {
    restoreSolvedState(savedOrder);
    return;
  }

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
      return slot.querySelector('.dragblock')?.dataset.word;
    });

    const isCorrect = currentOrder.every((word, index) => word === correctOrder[index]);

    if (isCorrect) {
      filledSlots.forEach(slot => slot.classList.add('correct'));
      localStorage.setItem('puzzleOrder', JSON.stringify(currentOrder));
      showSuccess();
    }
  }

  function restoreSolvedState(order) {
    positionSlots.forEach((slot, index) => {
      slot.innerHTML = '';

      const block = document.createElement('div');
      block.className = 'dragblock filled dropped correct';
      block.dataset.word = order[index];
      block.textContent = order[index];
      block.setAttribute('draggable', 'false');

      slot.appendChild(block);
      slot.classList.add('filled', 'correct');

      dragblocks.forEach(item => {
        item.style.display = "none"
      })
    });

    showSuccess();
  }

  function showSuccess() {
    h1.textContent = "Hello Developer!!!!";
    document.querySelector('.authpopup').style.display = 'none';
    black.style.display = 'none';
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
  let maxHeight = 0
  
  quotes.forEach(quote => {
    quote.style.transition = 'none'
    quote.style.position = 'static'
    quote.style.opacity = '0'
    
    const h = quote.offsetHeight
    if (h > maxHeight) maxHeight = h
    
    quote.style.position = ''
    quote.style.opacity = ''
    quote.style.transition = ''
  })
  
  quotesTrack.style.height = `${maxHeight + 15}px`
}

let quotesResizeTimer
window.addEventListener('resize', function () {
  clearTimeout(quotesResizeTimer)
  quotesResizeTimer = setTimeout(updateTrackHeight, 150)
})

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
  threshold: 0.05,
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
    "quantity": 0,
    "price": 15000
  },
  2: {
    "id": 2,
    "name": "Birdie",
    "img": "img/work2.png",
    "quantity": 0,
    "price": 5260
  },
  3: {
    "id": 3,
    "name": "Notebook",
    "img": "img/work3.png",
    "quantity": 0,
    "price": 26890
  },
  4: {
    "id": 4,
    "name": "Digital Camera",
    "img": "img/work4.png",
    "quantity": 0,
    "price": 14300
  },
  5: {
    "id": 5,
    "name": "Bike",
    "img": "img/work5.png",
    "quantity": 0,
    "price": 1200
  },
  6: {
    "id": 6,
    "name": "Notebook with pen",
    "img": "img/work6.png",
    "quantity": 0,
    "price": 3500
  },
  7: {
    "id": 7,
    "name": "Flower pot",
    "img": "img/work7.png",
    "quantity": 0,
    "price": 9850
  },
  8: {
    "id": 8,
    "name": "Office tools",
    "img": "img/work8.png",
    "quantity": 0,
    "price": 4632
  },
  9: {
    "id": 9,
    "name": "Events calendar",
    "img": "img/work9.png",
    "quantity": 0,
    "price": 5648
  }
}

const parentcard = document.querySelectorAll(".gridItem")
const cartDiv = document.querySelector(".cartpopup")
const cartBtn = document.querySelector(".cart")
const cartEdit = cartDiv.querySelector(".prodDetails")
const totalPriceEl = document.querySelector(".total-price")

function addToCart(productId) {
  const product = Object.values(productsObj).find(item => item.id == productId)
  if (!product) return

  let cart = JSON.parse(localStorage.getItem("cart")) || []
  const existing = cart.find(item => item.id == product.id)

  if (existing) {
    existing.quantity++
  } else {
    cart.push({
      ...product,
      quantity: 1
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
}

function changeQuantity(productId, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  const item = cart.find(item => item.id == productId)
  if (!item) return

  item.quantity += delta

  if (item.quantity < 1) {
    item.quantity = 1
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  renderCart()
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  cart = cart.filter(item => item.id != productId)
  localStorage.setItem("cart", JSON.stringify(cart))
  renderCart()
}

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  if (cart.length > 0) {
    let html = ""
    let totalPrice = 0

    for (let i = 0; i < cart.length; i++) {
      html += `
        <div class="cart-item">
          <img src="${cart[i].img}">
          <div class="cart-item-info">
            <p>${cart[i].name}</p>
            <span>${cart[i].price * cart[i].quantity} грн</span>
            <div class="quantity-controls">
              <button class="qty-btn" data-id="${cart[i].id}" data-action="minus">−</button>
              <span>${cart[i].quantity}</span>
              <button class="qty-btn" data-id="${cart[i].id}" data-action="plus">+</button>
            </div>
          </div>
          <button class="remove-btn" data-id="${cart[i].id}">×</button>
        </div>
      `
      totalPrice += Number(cart[i].price) * cart[i].quantity
    }

    cartEdit.innerHTML = html
    if (totalPriceEl) totalPriceEl.textContent = totalPrice + " грн"

    document.querySelectorAll(".qty-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const id = btn.dataset.id
        const action = btn.dataset.action
        changeQuantity(id, action === "plus" ? 1 : -1)
      })
    })

    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        removeFromCart(btn.dataset.id)
      })
    })
  } else {
    cartEdit.innerHTML = "<p>У кошику немає товарів</p>"
    if (totalPriceEl) totalPriceEl.textContent = "0 грн"
  }
}

function flyToCart(imgEl, cartEl) {
  const imgRect = imgEl.getBoundingClientRect()
  const cartRect = cartEl.getBoundingClientRect()

  const flyer = imgEl.cloneNode(true)
  flyer.classList.add("fly-to-cart")
  flyer.style.top = imgRect.top + "px"
  flyer.style.left = imgRect.left + "px"
  flyer.style.width = imgRect.width + "px"
  flyer.style.height = imgRect.height + "px"

  document.body.appendChild(flyer)

  const deltaX = cartRect.left + cartRect.width / 2 - (imgRect.left + imgRect.width / 2)
  const deltaY = cartRect.top + cartRect.height / 2 - (imgRect.top + imgRect.height / 2)

  requestAnimationFrame(() => {
    flyer.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.15)`
    flyer.style.opacity = "0.3"
  })

  flyer.addEventListener("transitionend", function () {
    flyer.remove()
    cartEl.classList.add("cart-bump")
    setTimeout(() => cartEl.classList.remove("cart-bump"), 400)
  }, { once: true })
}

parentcard.forEach(item => {
  const btncard = item.querySelector(".view-btn")
  btncard.addEventListener("click", function (e) {
    e.preventDefault()
    const productId = btncard.dataset.id
    const imgEl = item.querySelector("img")
    if (imgEl) flyToCart(imgEl, cartBtn)
    addToCart(productId)
  })
})

cartBtn.addEventListener("click", function (e) {
  e.preventDefault()
  black.style.display = "block"
  cartDiv.style.display = "block"
  renderCart()
})

closepopup.forEach(item => {
  item.addEventListener("click", function () {
    black.style.display = "none"
    cartDiv.style.display = "none"
  })
})

//hide header

const headerEl = document.querySelector('.headerMain')

let lastScrollY = window.scrollY
let scrollTicking = false
const SCROLL_HIDE_OFFSET = 80

function handleHeaderScroll() {
  const currentScrollY = window.scrollY

  if (currentScrollY <= SCROLL_HIDE_OFFSET) {
    headerEl.classList.remove('hide-header')
  } else if (currentScrollY > lastScrollY) {
    headerEl.classList.add('hide-header')
  } else if (currentScrollY < lastScrollY) {
    headerEl.classList.remove('hide-header')
  }

  lastScrollY = currentScrollY
  scrollTicking = false
}

window.addEventListener('scroll', function () {
  if (!scrollTicking) {
    requestAnimationFrame(handleHeaderScroll)
    scrollTicking = true
  }
}, { passive: true })