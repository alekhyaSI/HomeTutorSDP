import React from 'react'

export default function Button({ children, variant='primary', className='', ...rest }){
  const base = 'btn '
  const v = variant === 'primary' ? 'btn-primary' : variant === 'secondary' ? 'btn-secondary' : 'btn-ghost'
  return (
    <button className={`${base} ${v} ${className}`} {...rest}>{children}</button>
  )
}
