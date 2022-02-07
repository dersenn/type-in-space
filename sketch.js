/* 
CODING CHALLENGE:
https://twitter.com/zachlieberman/status/1489113833419517953
BLUEPRINT BY MIKE:
0. Buchstabe am Punkt 0,0,0 erstellen 
1. Buchstaben in Fragmente teilen
2. Richtungsvektor definieren
uuh, vor 3 noch den Buchstaben im Raum drehen so dass er iN richtung Richtungsvektor schaut
3. Fragmente vom Nullpunkt aus in plus/minus Richtingsvektor bewegen
4. Fragmente skalieren wegen Perspektive (alternativ orthogonal arbeiten weil einfacher)
5. Kamersposition berechnen (auf Linie des Richtingsvektors in Richtung 0,0,0)
6. Alles in einem Objekt speichern, mehrere Buchstabenobjekte machen
7. Kamerabewegung animieren
*/

// CANVAS VARS
const container = document.getElementById('p5-container')
let canW = container.offsetWidth //canvas Width
let canH = container.offsetHeight //canvas Height
let canMax = Math.max(canW, canH) //longer canvas side
let canMin = Math.min(canW, canH) //shorter canvas side
let landscape = false
if (canW > canH) landscape = true

// PRELOAD
function preload() {
  font = loadFont('assets/MunkenSans-Medium.otf')
}

// "GLOBAL" VARS
let center

let font
let fontSize = canW / 2
let txt = ['C','4', 'T', 'A']

let cam

let glyphs = []
let ttpOpts = {
  sampleFactor: .3,
  simplifyThreshold: 0
}

// STYLE
let colors

///////////////////////////////////////////////////////// P5 SETUP
function setup() {
  let canvas = createCanvas(canW,canH,WEBGL)
  canvas.parent(container)

  center = createVector(0,0,0)
  colors = [
    color(255, 0, 0),
    color(0, 255, 0),
    color(0, 0, 255),
    color (0,0,0)
  ]

  // create glyph objects
  for (let t = 0; t < txt.length; t++ ){
    glyphs.push( new Glyph(
      t,
      txt[t],
      random(2, 4), // Anzahl Fragmente
      center, // Position, im Moment noch nicht gebraucht
      { 
        phi: TAU/txt.length * t, // changed to non-random values for debugging...
        theta: 0
      },
      // {phi: random(0, TAU), theta: random(0, TAU)}, // Momentan wird nur phi gebraucht, theta für 3D-Umsetzung
      colors[t],
      )
    )
  }

  cam = createCamera()
}

// ANIMATION VARS
let current = 0 // formerly move_To. current glyph.
let next

let curG // current Glyph
let nxtG // next Glyph

let timer = 0 // used to get different intervals for animation and static (other approaches?)


///////////////////////////////////////////////////////// P5 DRAW
function draw() {
  ortho()
  background(255)

  // camera setup.
  cam.dist = canW / 2
  cam.restTime = 200 // frames
  cam.transitionTime = 100 // frames
  cam.interval = cam.restTime + cam.transitionTime

  // get the next glyph. so we know where to move/interpolate to.
  // could maybe go into nextGlyph() function...
  if (current == glyphs.length - 1) {
    next = 0
  } else {
    next = current + 1
  }
  curG = glyphs[current]
  nxtG = glyphs[next]


  // we can ignore this for now, since all glyphs have the same initial position (center)
  cam.lookAt(curG.pos.x, curG.pos.y, curG.pos.z) // cam needs to look at the current glyphs init point. currently: 0,0,0 (center)



// ok. somehow working. but.......
  if (timer < cam.restTime) {
    cam.x = sin(curG.dir.phi) * cam.dist
    cam.y = 0
    cam.z = cos(curG.dir.phi) * cam.dist

    timer++
    // console.log('rest')

  } else if (timer < cam.interval) {
    let aStep = ( (nxtG.dir.phi - curG.dir.phi) / cam.transitionTime ) * (timer - cam.restTime) // i have a feeling this is wrong.
    // console.log(aStep)
    cam.x = sin( lerp(curG.dir.phi, nxtG.dir.phi, aStep) ) * cam.dist
    cam.y = 0
    cam.z = cos( lerp(curG.dir.phi, nxtG.dir.phi, aStep) ) * cam.dist

    timer++
    // console.log('transiton')

  } else {
    timer = 0
    // console.log('reset')
    nextGlyph()
  }

  // set the position of camera...
  cam.setPosition(cam.x, cam.y, cam.z)


  // iterate thru glyphs and draw them. this works.
  for (let g = 0; g < glyphs.length; g++) {
    glyphs[g].draw(current)
  }

}

function nextGlyph() {
  if (current == glyphs.length - 1) {
    current = 0
  } else {
    current++
  }
}





// My only friend, the end.