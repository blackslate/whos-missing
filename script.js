const shuffle = (a) => {
  let ii = a.length

  while (ii) {
    const jj = Math.floor(Math.random() * ii)
    ii -= 1;
    [a[ii], a[jj]] = [a[jj], a[ii]]
  }

  return a // for chaining
}

const solution = "4,2,5"
const options = [
  {
    color: "#fff",
    opacity: 0.05,
    foot: "A",
    body: "nk",
    head: "a",
    caption: "more than the ghost of a chance",
    image: {
      foot: "ghost3.webp",
      body: "ghost2.webp",
      head: "ghost1.webp",
    }
  }
, {
    color: "#0ff",
    opacity: 0.05,
    foot: "Ma",
    body: "lve",
    head: "en",
    caption: "oldest and wisest",
    image: {
      foot: "eagle3.webp",
      body: "eagle2.webp",
      head: "eagle1.webp",
    }
  }
, {
    color: "#009",
    opacity: 0.125,
    foot: "Do",
    body: "tt",
    head: "ie",
    caption: "trainee witchling",
    image: {
      foot: "witchgirl3.webp",
      body: "witchgirl2.webp",
      head: "witchgirl1.webp",
    }
  }
, {
    color: "#f0f",
    opacity: 0.05,
    foot: "Fe",
    body: "del",
    head: "ma",
    caption: "daughter of the Sorcerer of the Black Back Lands",
    image: {
      foot: "dancer3.webp",
      body: "dancer2.webp",
      head: "dancer1.webp",
    }
  }
, {
    color: "#900",
    opacity: 0.1,
    foot: "Bo",
    body: "ldr",
    head: "an",
    caption: "the Deep Minded",
    image: {
      foot: "dragon3.webp",
      body: "dragon2.webp",
      head: "dragon1.webp",
    }
  }
, {
    color: "#ff7f00",
    opacity: 0.05,
    foot: "Ro",
    body: "ya",
    head: "le",
    caption: "the unicorn brothers",
    image: {
      foot: "unicorn3.webp",
      body: "unicorn2.webp",
      head: "unicorn1.webp",
    }
  }
, {
    color: "#ff0",
    opacity: 0.05,
    foot: "Pi",
    body: "xie",
    head: "\u00a0kin",
    caption: "Where's the catch?",
    image: {
      foot: "pixies3.webp",
      body: "pixies2.webp",
      head: "pixies1.webp",
    }
  }
, {
    color: "#030",
    opacity: 0.667,
    foot: "Pa",
    body: "tri",
    head: "ck",
    caption: "And now I'll be giving you three wishes!",
    image: {
      foot: "leprechaun3.webp",
      body: "leprechaun2.webp",
      head: "leprechaun1.webp",
    }
  }
]


const strips = [ "head", "body", "foot" ]


const images = options.reduce(( images, { image } ) => {
  const { head, body, foot } = image
  images.head.push(`img/${head}`)
  images.body.push(`img/${body}`)
  images.foot.push(`img/${foot}`)

  return images
}, { head: [], body: [], foot: [] })



const stripStates = (() => {
  const creatureCount = images.head.length - 1
  const creatures = Array.from(
    { length: creatureCount },
    (_, index) => index
  )

  // Choose any random setting, except the solution
  let random
  do {
    random = shuffle([ ...creatures ])
  } while (random.toString() === solution)
  console.log("random:", random);

  // All the strips will show a different creature
  return strips.reduce(( states, strip, index ) => {
    const clone   = [...creatures]
    const offset  = clone.splice(0, random[index])
    states[strip] = [ ...clone, ...offset]

    return states
  }, {})
})()



const question = document.getElementById("question")
const bottle = document.getElementById("bottle")
const caption = document.getElementById("caption")

const arrows = document.getElementById("arrows")
arrows.addEventListener("pointerdown", cycle)



const elementMap = strips.reduce(( map, className ) => {
  const selector = `.${className}`
  const elements = Array.from(document.querySelectorAll(selector))
 
  map.images[className] = elements[2]
  map.texts[className] = elements[3]
  
  return map
}, { images: {}, texts: {} })



function cycle({ target }) {
  const [ part, way ] = target.className.animVal.split(/\s+/)
  const strip = stripStates[part]

  if (way === "up") {
    strip.push(strip.shift())
  } else {
    strip.unshift(strip.pop())
  }
  
  update()
  checkForMatch()
}



const update = () => {
  strips.forEach( part => {
    const index = stripStates[part][0]

    elementMap.texts[part].innerText = options[index][part]
    elementMap.images[part].src = images[part][index]
  })
}



function checkForMatch() {
  const head = stripStates.head[0]
  const body = stripStates.body[0]
  const foot = stripStates.foot[0]

  if (`${foot},${body},${head}` === solution) {
    // The label says "Bo.tt.le"
    showBottle()
    
  } else {
    bottle.onclick = null
    bottle.style.removeProperty("cursor")

    if (head === body && head === foot ) {
      // One of the creatures is complete.
      const { color, caption, opacity } = options[head]
      document.body.style.backgroundColor = color
      caption.innerText = caption
      bottle.style.opacity = opacity 
      bottle.src = "img/bottle.png"  

    } else {
      // Revert to chaos
      document.body.style.removeProperty("background-color")
      caption.innerText = ""
      bottle.style.removeProperty("opacity")
      bottle.src = "img/white_bottle.png"
    }
  }
}



function showBottle() {
  document.body.style.backgroundColor = options.slice(-1)[0].color

  bottle.src = "img/bottle.png"
  bottle.style.opacity = 0.667
  bottle.style.cursor = "pointer"
  caption.innerText = "Begorrah! You found me! Now let me out!"

  bottle.onclick = release
}



function release() {
  arrows.style.display = "none"
  question.style.display = "none"

  caption.innerText = options.slice(-1)[0].caption

  Object.values(stripStates).forEach( strip => {
    const index = strip.indexOf(7)
    if (index > -1) {
      strip.splice(index, 1)
    }
    strip.unshift(7)
  })
  update()
}


// On startup, show the randomly-selected strips
update()