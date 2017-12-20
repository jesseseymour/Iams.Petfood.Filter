import { Component } from 'react'
import Product from './Product'
import ProductFilters from '../containers/ProductFilters'
import fetch from 'isomorphic-fetch'

class ProductList extends Component {
  constructor(props) {
    super(props)
    this.toggleFilter = this.toggleFilter.bind(this)
    this.state = {
      products: [],
      filters: [],
      loading: false
    }
  }

  componentDidMount() {
    this.setState({loading:true})
    fetch('./data/MOCK_DATA.json')
            .then(response => response.json())
            .then(products => this.setState({
                products,
                loading: false
            }))
  }

  toggleFilter(event) {
    alert('working')
    // const filters = [
    //   ...this.state.filters
    // ]
  }

  render() {
    const { products } = this.state
    return (
      <div className="product-list">
        <div className="product-filters">
          <ProductFilters />
        </div>
        <h1>Products</h1>
        {(products.length) ?
            products.slice(0,10).map(
              (product, i) =>
                <Product key={i}
                         name={product.name}
                         thumbnail={product.thumbnail}
                         link={product.link}
                         bvID={product.bvID}
                         psID={product.psID}
                         type={product.type}
                         age={product.age}
                         flavors={product.flavors} />
            ):
          <span>Currently 0 Products</span>



        }
      </div>
    )
  }
}

export default ProductList