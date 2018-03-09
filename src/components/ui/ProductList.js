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
      loading: true,
      offset: 0, //pagination offset
      currentPage: 0 //pagination current page
    }

    //this will be used to store active filter IDs
    this.activeFilterIds = []
  }


  componentDidMount() {

    /********************
    set payload and call api for available products
    ********************/
    const payload = {
                      ParentCategory: this.props.rootData.category.urlName,
                      Culture: 'en',
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
            .then(products => products.Products)
            .then(products => this.setState({
                products,
                loading: false,
                filteredProducts: this.updateProductList(products)
            }))
            .catch(err => console.error(err))
    /********************
    end set payload and call api for available products
    ********************/

    //update local array of active filter IDs
    this.activeFilterIds = this.getActiveFilterIds(this.props.activeFilters)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState !== this.state || nextProps !== this.props) 
  }

  componentWillReceiveProps(nextProps) {
    //update local array of active filter IDs
    this.activeFilterIds = this.getActiveFilterIds(nextProps.activeFilters)

    //get array of filtered products and set state with updated list
    this.setState({
      filteredProducts: this.updateProductList(null,nextProps.activeFilters),
      offset: 0,
      currentPage: 0
    })
  }

  //return array of active filter ids
  getActiveFilterIds(activeFilters){
    return activeFilters.map(activeFilter => (activeFilter.id))
  }

  //update product array based on selected filters
  updateProductList(products=null,nextFilters=null) {
    products = (products) ? products : this.state.products
    let filteredProducts = []

    //map through products array and test against active filters
    //if test passes, push to filteredProducts array
    products.map(
      (product) => {
        //if product matches filter, add it to the new array
        (this.shouldProductRender(product,nextFilters)) ? filteredProducts.push(product) : null
      }
    )

    return filteredProducts
  }

  //test to determine if product matches filters
  shouldProductRender(product,nextFilters=null) {
    const productFilters = product.Departments //use departments array from product object
    let match = false //default to false. will change to true if test passes
    

    if (this.activeFilterIds.length) { //test if all active filter ids are inluded in product id array
      this.activeFilterIds
            .every(filter => productFilters.includes(filter)) ? match = true : null

      return match 
    }
    else {
      return true //return true if no filters selected. this will render all products
    }
  }

  //get selection of items based on pagination
  getSlicedProductList(products,offset,all=false) { 
    const perPage = this.props.perPage
    const test = products.slice(offset,offset + perPage)
    return (all) ?
      products : 
      products.slice(offset,offset + perPage)

  }

  //pagination link click
  handlePageClick = (data) => { 
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
        <h1>{filteredProducts.length} {this.props.rootData.labels.productsfound}</h1>
        <ReactPaginate pageCount={Math.ceil(filteredProducts.length / this.props.perPage)}
                       pageRangeDisplayed={5}
                       marginPagesDisplayed={1}
                       nextLabel={this.props.rootData.labels.next}
                       previousLabel={this.props.rootData.labels.previous}
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
                         link={product.UrlName}
                         bvID={product.BazzarVoiceId}
                         psID={product.PriceSpiderId} />

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