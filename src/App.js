import C from './constants'
import { Component } from 'react'
import ProductFilters from './components/containers/ProductFilters'
import ProductList from './components/containers/ProductList'
import { BrowserRouter as Router } from 'react-router-dom'
import './stylesheets/style.scss'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      isDog: window.location.pathname.substr(1).split('/')[0].indexOf('dog') >= 0 ? true : false
    }
  }

  render() {
    return (
      <Router>
      <div className="NutroProductFilter">
        <ProductFilters isDog={this.state.isDog} rootData={document.getElementById('react-container').dataset} />
        <ProductList isDog={this.state.isDog} rootData={document.getElementById('react-container').dataset} />
        </div>
      </Router>
    )
  }
}

export default App