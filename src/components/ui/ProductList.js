import { Component } from 'react'
import Product from './Product'
import fetch from 'isomorphic-fetch'
import ReactPaginate from 'react-paginate'

class ProductList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      products: [], //all products
      filteredProducts: [], //filtered products
      loading: false,
      offset: 0,
      currentPage: 0
    }
  }

  componentDidMount() {
    this.setState({loading:true})
    const payload = {
                      ParentCategory: 'dogfood',
                      Culture: 'en-US',
                      Filters: [] 
                    }

    fetch('/api/GetProductsByFilter',
          {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          }
          )
            .then(response => response.json())
            .then(products => products.Products.slice(0,50))
            .then(products => this.setState({
                products,
                loading: false,
                filteredProducts: this.updateProductList(products)
            }))
            .catch(err => console.error(err))
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState !== this.state || nextProps !== this.props) 
  }

  componentWillReceiveProps(nextProps) {
    const filteredProducts = this.updateProductList(null,nextProps.activeFilters)
    this.setState({
      filteredProducts,
      offset: 0,
      currentPage: 0
    })
  }

  updateProductList(products=null,nextFilters=null) {
    products = (products) ? products : this.state.products
    let filteredProducts = []
    products.map(
      (product) => {
        //if product matches filter, add it to the new array
        (this.shouldProductRender(product,nextFilters)) ? filteredProducts.push(product) : null
      }
    )

    return filteredProducts
  }

  getSlicedProductList(products,offset,all=false) { //get selection of items based on pagination
    const perPage = this.props.perPage
    const test = products.slice(offset,offset + perPage)
    return (all) ?
      products : 
      products.slice(offset,offset + perPage)

  }

  shouldProductRender(product,nextFilters=null) {

    const activeFilters = (nextFilters) ? nextFilters : this.props.activeFilters
    const productFilters = product.Departments //use departments array from product object

    let match = false


    

    /********************************************/
    //NEED TO GET THIS WORKING TO MOVE FORWARD
    /********************************************/
    if (activeFilters.length) { //if there are active filters proceed to look for match with tested product
      productFilters.map((f) => {
        activeFilters.includes(f) ? match = true : null
      })

      /*Object.entries(productFilters).forEach(([key,value]) => //loop through filters for current product
        activeFilters.map((f) => //map through active filters
          value.map((v) => {//now map through current product filter array and look for match with active filter
            (v === f.name) ? match = true : null
          }
          )
        )
      ) */
      /********************************************/
      /********************************************/
      /********************************************/





      return match 
    }
    else {
      return true //return true if no filters selected
    }
  }

  handlePageClick = (data) => { //pagination link click
    let selected = data.selected
    let offset = Math.ceil(selected * this.props.perPage)
    
    this.setState({
      offset: offset,
      currentPage: Math.floor(offset / this.props.perPage)
    })
  }

  render() {
    const { filteredProducts } = this.state
    const slicedProducts = this.getSlicedProductList(filteredProducts,this.state.offset)

    return (
      <div className="product-list">
        <h1>Products</h1>
        <ReactPaginate pageCount={Math.ceil(filteredProducts.length / this.props.perPage)}
                       pageRangeDisplayed={5}
                       marginPagesDisplayed={1}
                       containerClassName={"pagination"}
                       onPageChange={this.handlePageClick}
                       forcePage={this.state.currentPage} />
        {
          (slicedProducts.length) ?
            slicedProducts.map(
              (product, i) => 
                <Product key={i}
                         name={product.FullTitle}
                         thumbnail={product.ImagePath}
                         link={product.ProductUrl}
                         bvID={product.BazzarVoiceId}
                         psID={product.PriceSpiderId} />
                         //type={product.type}
                         //age={product.age}
                         //flavors={product.flavors} />

            )
          :
            <span>Currently 0 Products</span>
          
        }
        
      </div>
    )
  }
}

ProductList.defaultProps = {
  perPage: 8 //number of products to show per page
}

export default ProductList