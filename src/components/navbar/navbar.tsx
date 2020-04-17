import React, { FunctionComponent } from 'react'
import { AppName } from '../../constants/app-constants'

export const Navbar: FunctionComponent = () => {
  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
      <button className='navbar-brand btn btn-link'>{AppName}</button>
    </nav>
  )
}
