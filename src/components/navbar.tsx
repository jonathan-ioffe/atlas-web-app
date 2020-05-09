import React, { FunctionComponent } from 'react'
import { AppName } from '../constants/app-constants'
import { AvailablePages } from './App'

export interface NavbarProps {
  setPageView: (page: AvailablePages) => void
}

export const Navbar: FunctionComponent<NavbarProps> = ({setPageView}) => (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
      <button className='navbar-brand btn btn-link'>{AppName}</button>
      <button className='btn btn-dark' onClick={() => setPageView(AvailablePages.main)}>Home</button>
      <button className='btn btn-dark' onClick={() => setPageView(AvailablePages.graph)}>Graph</button>
    </nav>
  )

