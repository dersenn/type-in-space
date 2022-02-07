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
      txt[t],
      random(2, 4), // Anzahl Fragmente
      center, // Position, im Moment noch nicht gebraucht
      {phi: random(0, TAU), theta: random(0, TAU)}, // Momentan wird nur phi gebraucht, theta für 3D-Umsetzung
      colors[t],
      )
    )
  }

  cam = createCamera()
}

// ANIMATION VARS
let current = 0 // formerly move_To. current glyph.
let next

let cG // current Glyph
let nG // next Glyph

let angleX // kinda phi

let rest = true
let count = 0

///////////////////////////////////////////////////////// P5 DRAW
function draw() {
  ortho()
  background(255)

  // camera setup.
  cam.dist = canW / 2
  cam.rest = 200 // frames
  cam.transition = 100 // frames
  cam.interval = cam.rest + cam.transition
  cam.speed = frameCount / cam.transition // ?

  // movement variables. we need next for interpolation.
  if (current == glyphs.length - 1) {
    next = 0
  } else {
    next = current + 1
  }
  curG = glyphs[current]
  nxtG = glyphs[next]

  // we can ignore this for now, since all glyphs have the same initial position (center)
  cam.lookAt(curG.pos.x, curG.pos.y, curG.pos.z) // cam needs to look at the current glyphs init point. currently 0,0,0

  // move camera on specific points in time. working but gets bigger and bigger.
  if (frameCount % (cam.interval - cam.transition) == 0) {
    rest = false
    count++
  } else if (frameCount % cam.interval == 0) {
    rest = true
  }


  // this might be good. but the above part is shitty.
  if (rest) {
    cam.x = sin(curG.dir.phi) * cam.dist
    cam.y = 0
    cam.z = cos(curG.dir.phi) * cam.dist
  } else {
    // lerp(start, stop, amt)
    cam.x = sin( lerp(curG.dir.phi, nxtG.dir.phi, (nxtG.dir.phi - curG.dir.phi) / cam.transition) ) * cam.dist
    cam.y = 0
    cam.z = cos(curG.dir.phi) * cam.dist
  }

  // console.log(frameCount, rest, count)


  cam.setPosition(cam.x, cam.y, cam.z)

  // need to change this into some timed thing. needs to go into lerp above.
  // if(frameCount % cam.rest == 0) {
  //   if (current == glyphs.length - 1) {
  //     current = 0
  //   } else {
  //     current++
  //   }
  // }


  // iterate thru glyphs and draw them
  for (let glyph of glyphs) {
    glyph.draw()
  }
}







// My only friend, the end.