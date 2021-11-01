import Sketch from 'react-p5'

let inc = 0.01
let start = 0

interface LineProps {
  color?: number
  height?: number
  width?: number
}

export const Line = ({ color = 0, height, width }: LineProps) => {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(width || p5.displayWidth, height || p5.displayHeight).parent(canvasParentRef)
  }

  const draw = (p5) => {
    p5.stroke(color)
    p5.strokeWeight(10)
    p5.noFill()
    p5.beginShape()
    let xoff = start

    // noiseSeed('0x507F0daA42b215273B8a063B092ff3b6d27767aF')
    for (let x = 0; x < p5.width; x += 1) {
      let n = p5.map(p5.noise(xoff), 0, 1, -150, 150)
      let s = p5.map(p5.sin(xoff), -1, 1, -50, 50)
      let y = s + n
      p5.vertex(x, y + p5.height / 2)
      xoff += inc
    }
    p5.endShape()

    start += inc

    p5.noLoop()
  }

  return <Sketch setup={setup} draw={draw} />
}

export default Line
