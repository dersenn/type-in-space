class Glyph{
    constructor(letter, nChunks, position, direction, color) {
        this.bounds = font.textBounds(letter, 0, 0, fontSize) 
        this.points = font.textToPoints(letter, -this.bounds.w/2, this.bounds.h/2, fontSize, ttpOpts)
        this.nChunks = nChunks
        this.chunkSize = this.points.length / this.nChunks
        this.chunks = []
        
        // where is the startpoint? maybe we can use this in cam.lookAt.
        // maybe we can use vectors for position and direction?
        this.position = position
        this.direction = direction // phi and theta, kreiskoordinaten
        
        this.color = color

        for (let c = 0; c < this.points.length; c += this.chunkSize) {
            this.chunks.push(this.points.slice(c, c + this.chunkSize))
        }
    }

    draw() {
        push()
        rotateY(this.direction.phi)

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