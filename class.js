class Glyph{
    constructor(letter, nChunks, direction, color){
        this.bounds = font.textBounds(letter, 0, 0, fontSize),
        this.points = font.textToPoints(letter, -this.bounds.w/2, this.bounds.h/2, fontSize, ttpOpts),
        this.nChunks = nChunks,
        this.chunkSize = this.points.length / this.nChunks,
        this.chunks = []
        this.direction = direction // phi and theta, kreiskoordinaten
        this.color = color

        for (let c = 0; c < this.points.length; c += this.chunkSize) {
            this.chunks.push(this.points.slice(c, c + this.chunkSize))
        }
    }
}