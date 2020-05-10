import { handleCSSAnimation } from "../cssAnimation.js"
import { handleCanvasAnimation } from "../canvasAnimation.js"
import { handleThreeAnimation, handlePrevAnimation } from "../threeAnimation.js"
import { SLIDES_COUNT } from "../utils.js"

const title = document.getElementById('title')

let slideIndex = 0

const changeSlide = () => {
  title.innerHTML = ''
  const text = document.createTextNode(`slide${slideIndex + 1}`)
  title.appendChild(text)

  handleCSSAnimation()
  handleCanvasAnimation(slideIndex)
}

export const nextSlide = () => {
  if (slideIndex >= SLIDES_COUNT) {
    slideIndex = 0
  } else {
    slideIndex++
  }
  changeSlide();
  handleThreeAnimation()
}

export const prevSlide = () => {
  if (slideIndex === 0) {
    slideIndex = SLIDES_COUNT
  } else {
    slideIndex--
  }
  changeSlide();
  handlePrevAnimation()
}

