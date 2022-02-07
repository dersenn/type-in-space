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
      colors[t]
      ) );
  }

  cam = createCamera()
}

// ANIMATION VARS
let current = 0 // formerly move_To


///////////////////////////////////////////////////////// P5 DRAW
function draw() {
  ortho()
  background(255)

  cam.dist = canW / 2
  cam.rest = 200 // frames
  cam.transition = 100 // frames
  cam.speed = frameCount / cam.transition

  cam.lookAt(glyphs[current].pos.x, glyphs[current].pos.y, glyphs[current].pos.z) // cam needs to look at the current glyphs init point. currently 0,0,0
 
  cam.x = sin(glyphs[current].dir.phi) * cam.dist
  cam.y = 0
  cam.z = cos(glyphs[current].dir.phi) * cam.dist
  
  cam.setPosition(cam.x, cam.y, cam.z)


  // need to change this into some timed thing
  if(frameCount % 100 == 0) {
    if (current < glyphs.length - 1) {
      current++
    } else {
      current = 0
    }  
  }

  strokeWeight(5)
  noFill()
  // for some reason the path is not connected... no idea why.
  // iterate thru glyphs and draw them
  for (let glyph of glyphs) {
    glyph.draw()
  }
}







// My only friend, the end.