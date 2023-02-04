import React, { useState, useRef } from "react";
import { useSprings } from '@react-spring/web'
import { useGesture } from "@use-gesture/react";
import Card from "./Card";
import { useSpring, animated, to} from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import clamp from 'lodash.clamp'
const pages = [
    'https://images.pexels.com/photos/62689/pexels-photo-62689.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'https://images.pexels.com/photos/733853/pexels-photo-733853.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'https://images.pexels.com/photos/4016596/pexels-photo-4016596.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
]



const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${r / 0}deg) rotateZ(${r}deg) scale(${s})`

const Deck = () => {
    const index = useRef(0)
    const width = window.innerWidth
    const height = window.innerHeight
    const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out
    const [props, api] = useSprings(pages.length, i => ({
        x: i * width,
        y:i*height,
        scale: 1,
        display: 'block',
      })) // Create a bunch of springs using the helpers above
    // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
    // const bind = useDrag(({ args: [index], active, movement: [mx], direction: [xDir], velocity: [vx], cancel }) => {
    //     const trigger = vx > 0.2 // If you flick hard enough it should trigger the card to fly out
    //     if (!active && trigger) gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
    //     api.start(i => {
    //     if (index !== i) return // We're only interested in changing spring-data for the current spring
    //     const isGone = gone.has(index)
    //     const x = isGone ? (200 + window.innerWidth) * xDir : active ? mx : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
    //     const rot = mx / 100 + (isGone ? xDir * 10 * vx : 0) // How much the card tilts, flicking it harder makes it rotate faster
    //     const scale = active ? 1.1 : 1 // Active cards lift up a bit
    //     return {
    //         x,
    //         rot,
    //         scale,
    //         delay: undefined,
    //         config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 },
    //     }
    //     })
    //     if (!active && gone.size === pages.length)
    //     setTimeout(() => {
    //         gone.clear()
    //         api.start(i => vis(i))
    //     }, 600)
    // })
    const bind = useDrag(({ active, movement: [mx,my], direction: [xDir, yDir], cancel }) => {
        if (active && Math.abs(my) > width / 2) {
            index.current = clamp(index.current + (yDir > 0 ? -1 : 1), 0, pages.length - 1)
            cancel()
        }
        api.start(i => {
          if (i < index.current - 1 || i > index.current + 1) return { display: 'none' }
            const y = (i - index.current) * height + (active ? my : 0)
          const scale = active ? 1 - Math.abs(y) / width / 2 : 1
          return { y , scale, display: 'block' }
        })
    })
    return (
        <div className="wrapper">
          {props.map(({ y, display, scale }, i) => (
            <animated.div className="page" {...bind()} key={i} style={{ display, y }}>
              <animated.div style={{ scale, backgroundImage: `url(${pages[i]})` }} />
            </animated.div>
          ))}
        </div>
    )
}

export default Deck