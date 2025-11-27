import React from 'react'

export default function Avatar({ name, size=48, className='', src }){
  const letter = name ? name.charAt(0).toUpperCase() : 'U'
  if(src){
    return (
      <div className={`rounded-full overflow-hidden bg-neutral-100 ${className}`} style={{width:size, height:size}}>
        <img src={src} alt={name||'avatar'} className="object-cover w-full h-full" />
      </div>
    )
  }
  return (
    <div className={`rounded-full bg-neutral-100 flex items-center justify-center text-lg ${className}`} style={{width:size, height:size}}>
      {letter}
    </div>
  )
}
