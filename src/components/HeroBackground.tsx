"use client"

import { useState, useEffect } from "react"

interface HeroBackgroundProps {
  imagePath: string
  overlayOpacity?: number
  showNoise?: boolean
}

export const HeroBackground = ({
  imagePath,
  overlayOpacity = 30, // Default to 30% opacity
  showNoise = true,
}: HeroBackgroundProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = imagePath
    img.onload = () => {
      setImageLoaded(true)
    }
    return () => {
      img.onload = null
    }
  }, [imagePath])

  return (
    <div className="absolute inset-0">
      {/* Placeholder color while image loads */}
      <div className={`absolute inset-0 bg-black ${imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}></div>
      
      {/* Actual image that fades in */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <img
          src={imagePath}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity / 100 }}></div>
      
      {/* Optional noise texture */}
      {showNoise && (
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
      )}
    </div>
  )
}
