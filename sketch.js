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

/*
THOUGHTS:
— the letters stay put. only the camera moves.
— maybe the cam position etc. can also go into the Glyph class, so we can only update this.
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
        phi: random(0, PI), // changed to non-random values for debugging...
        theta: random(0, PI)
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
let next // next Glyph (somewhat redundant with the one below...)

let curG // current Glyph
let nxtG // next Glyph

let timer = 0 // used to get different intervals of animating and static states (other approaches?). I tried to base it on frameCount, but didn't get it to work.


///////////////////////////////////////////////////////// P5 DRAW
function draw() {
  ortho()
  background(255)

  // camera setup.
  cam.dist = canW / 2
  cam.restTime = 200 // frames
  cam.transitionTime = 200 // frames. off for now. 
  cam.interval = cam.restTime + cam.transitionTime

  // get the next glyph. so we know where to move/interpolate to.
  // could maybe go into nextGlyph() function at the end...
  if (current == glyphs.length - 1) {
    next = 0
  } else {
    next = current + 1
  }
  curG = glyphs[current]
  nxtG = glyphs[next]


  // we can ignore this for now, since all glyphs have the same initial position (center)
  cam.lookAt(curG.pos.x, curG.pos.y, curG.pos.z) // cam needs to look at the current glyphs init point. currently: 0,0,0 (center)


  // ok. somehow working.
  if (timer < cam.restTime) {
    // we are in rest mode. use current glyph direction for camera angle.

    // https://stackoverflow.com/questions/52781607/3d-point-from-two-angles-and-a-distance
    cam.x = -sin(curG.dir.phi) * cos(curG.dir.theta) * cam.dist
    cam.y = -sin(curG.dir.theta) * cam.dist
    cam.z = -cos(curG.dir.phi) * sin(curG.dir.theta) * cam.dist


    timer++
    // console.log('rest')



  // this can be ignored for debugging... the angles are off generally.
  } else if (timer < cam.interval) {
    // we are moving. interpolate between next and current glyph's angles.
    let aPos = (timer - cam.restTime) / 100 // something's still a bit jumpy
    // console.log(aStep)
    cam.x = lerp(
      sin(curG.dir.phi) * cos(curG.dir.theta) * cam.dist,
      sin(nxtG.dir.phi) * cos(nxtG.dir.theta) * cam.dist,
      aPos
    )
    cam.y = lerp(
      sin(curG.dir.theta) * cam.dist,
      sin(nxtG.dir.theta) * cam.dist,
      aPos
    )
    cam.z = lerp(
      cos(curG.dir.phi) * sin(curG.dir.theta) * cam.dist,
      cos(nxtG.dir.phi) * sin(nxtG.dir.theta) * cam.dist,
      aPos
    )

    // cam.x = sin( lerp(curG.dir.phi, nxtG.dir.phi, aPos) ) * cam.dist
    // cam.y = 0
    // cam.z = cos( lerp(curG.dir.phi, nxtG.dir.phi, aPos) ) * cam.dist

    timer++
    // console.log('transition')

  } else {
    // we are done moving. reset timer and move to next glyph.
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