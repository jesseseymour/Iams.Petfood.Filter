import C from './constants'
import { Component } from 'react'
import ProductFilters from './components/containers/ProductFilters'
import ProductList from './components/containers/ProductList'
import { BrowserRouter as Router } from 'react-router-dom'

class App extends Component {
  
  constructor(props) {
    super(props)
    this.setProductCount = this.setProductCount.bind(this)
    this.state = {
      productCount: 0
    }
    //this.setProductCount(0)
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   //if (nextState === this.state) return false
  //   return true
  // }
  setProductCount(productCount){
    if (productCount !== this.state.productCount){
      this.setState({
        productCount: productCount
      })
    }
  }

  render() {
    var rootData = JSON.parse(document.getElementById('react-container').dataset.root);
    return (
      <Router>
      <div className="IamsProductFilter">
        <ProductFilters 
          rootData={rootData}
          productCount={this.state.productCount} />
        <ProductList 
          rootData={rootData}
          sendProductCount={this.setProductCount}
          />
        </div>
      </Router>
    )
  }
}

export default App