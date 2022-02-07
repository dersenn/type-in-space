class Glyph {
    constructor(letter, nChunks, position, direction, color) {
        this.pos = position // the point in space where the letter "starts". can be used later to point the camera at. probably.
        this.dir = direction // phi and theta, kreiskoordinaten

        this.bounds = font.textBounds(letter, this.pos.x, this.pos.y, fontSize) 
        this.points = font.textToPoints(letter, -this.bounds.w/2, this.bounds.h/2, fontSize, ttpOpts)
        this.nChunks = nChunks
        this.chunkSize = this.points.length / this.nChunks
        this.chunks = []

        this.color = color

        for (let c = 0; c < this.points.length; c += this.chunkSize) {
            this.chunks.push(this.points.slice(c, c + this.chunkSize))
        }
    }

    draw() {
        push()
        rotateY(this.dir.phi)
        // rotateX(this.dir.theta)

        stroke(this.color)

        for (let i = 0; i < this.chunks.length; i++) {
          beginShape()
          for (let p = 0; p < this.chunks[i].length; p++) {
            let pt = this.chunks[i][p]
            vertex(pt.x, pt.y, (i - this.chunks.length/2 + 0.5) * 100 )
          }
          endShape()
        }
        pop()
    }
}