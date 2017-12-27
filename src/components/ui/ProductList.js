import { Component } from 'react'
import Product from './Product'
import fetch from 'isomorphic-fetch'
import ReactPaginate from 'react-paginate'

class ProductList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      products: [],
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

  shouldProductRender(product) {
    const activeFilters = this.props.filters
    const productFilters = { "type": product.type.split(','), //create object with filters for product being tested
                             "age": product.age.split(','),
                             "size": product.size.split(','),
                             "need": product.need.split(','),
                             "flavors": product.flavors.split(',')}
    let match = false

    if (activeFilters.length) { //if there are active filters proceed to look for match with tested product
      Object.entries(productFilters).forEach(([key,value]) => //loop through filters for current product
        activeFilters.map((f) => //map through active filters
          value.map((v) => //now map through current product filter array and look for match with active filter
            (v === f.name) ?
              match = true :
              null
          )
        )
      ) 
      return match 
    }
    else {
      return true //return true if no filters selected
    }
  }

  render() {
    const { products } = this.state
    return (
      <div className="product-list">
        <h1>Products</h1>
        
        {
          (products.length) ?

            products.slice(0,10).map(
              (product, i) => 
                (this.shouldProductRender(product)) ?
                  
                  <Product key={i}
                           name={product.name}
                           thumbnail={product.thumbnail}
                           link={product.link}
                           bvID={product.bvID}
                           psID={product.psID}
                           type={product.type}
                           age={product.age}
                           flavors={product.flavors} />
                :
                  null

            )

            
          :
            <span>Currently 0 Products</span>
          
        }
        <ReactPaginate pageCount={10}
                       pageRangeDisplayed={10}
                       marginPagesDisplayed={10}
                       containerClassName={"pagination"}
                            />
      </div>
    )
  }
}

export default ProductList