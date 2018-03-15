import C from './constants'
import { Component } from 'react'
import ProductFilters from './components/containers/ProductFilters'
import ProductList from './components/containers/ProductList'
import { BrowserRouter as Router } from 'react-router-dom'

class App extends Component {
  constructor(props){
    super(props)
  }

  render() {
    var rootData = JSON.parse(document.getElementById('react-container').dataset.root);
    return (
      <Router>
      <div className="NutroProductFilter">
        <ProductFilters rootData={rootData} />
        <ProductList rootData={rootData} />
        </div>
      </Router>
    )
  }
}

export default App