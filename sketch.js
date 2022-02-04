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

// "GLOBAL" VARS
let center

let font
let fontSize = canW / 2
let txt = ['C','4', 'T', 'A']

let cam

// PRELOAD
function preload() {
  font = loadFont('assets/MunkenSans-Medium.otf')
}

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

  // create glyp objects
  for (let t = 0; t < txt.length; t++ ){
    glyphs.push( new Glyph(
      txt[t],
      random(2, 4), // Anzahl Fragmente
      p5.Vector.random2D(), // Drehvektor, funktioniert noch nicht so wie ich will
      colors[t]
      ) );
  }

  
  
  cam = createCamera()
}

// ANIMATION VARS


///////////////////////////////////////////////////////// P5 DRAW
function draw() {
  // orhtographic for now...
  // this maybe, for scaling of chunks:
  // https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/building-basic-perspective-projection-matrix
  ortho()

  background(255)

  cam.dist = canW / 2
  cam.speed = frameCount / 300
  
  cam.x = cos(cam.speed) * cam.dist
  cam.y = 0
  cam.z = sin(cam.speed) * cam.dist

  cam.lookAt(0,0,0)
  cam.setPosition(cam.x, cam.y, cam.z)


  strokeWeight(5)
  noFill()


  // for some reason the path is not connected... no idea why.
  // iterate thru glyphs
  for ( let glyph of glyphs) {
    push()

    // rotation um die y achse gemäss richtungsvektor
    rotateY( acos(glyph.direction.dot(0,1,0)))

    stroke(glyph.color)
    for (let i = 0; i < glyph.chunks.length; i++) {
      beginShape()
      for (let p = 0; p < glyph.chunks[i].length; p++) {
        let pt = glyph.chunks[i][p]
        vertex(pt.x, pt.y, (i - glyph.chunks.length/2 + 0.5) * 100 )
      }
      endShape()
    }
    pop()
  }
} 