import { Component } from 'react'
import Product from './Product'
import ProductFilters from '../containers/ProductFilters'
import fetch from 'isomorphic-fetch'

class ProductList extends Component {
  constructor(props) {
    super(props)
  }

  toggleFilter = (e) => {
    console.log(e)
  }

  render() {
    //const { products } = this.state
    return (
      <div className="product-list">
        <ProductFilters />
      </div>
    )
  }
}

export default ProductList