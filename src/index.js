import React from 'react'
import { render } from 'react-dom'
// import routes from './routes'
import ProductList from './components/ui/ProductList'
import './stylesheets/style.scss'

window.React = React

render(
  <ProductList />, 
  document.getElementById('react-container'))
