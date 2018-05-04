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
    this.activeFilterObjects = []
  }


  componentDidMount() {

    /********************
    set payload and call api for available products
    ********************/
    const payload = {
                      ParentCategory: this.props.rootData.department.urlName,
                      Culture: 'en',
                      Filters: [] 
                    }

    fetch('/api/Products/Index?department=' + this.props.rootData.department.urlName,
          {
            method: 'GET',
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
            .then(() => this.props.setProductCount(this.state.filteredProducts.length))
            .catch(err => console.error(err))
    /********************
    end set payload and call api for available products
    ********************/

    //update local array of active filter IDs
    this.activeFilterObjects = this.getActiveFilterIds(this.props.activeFilters)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState !== this.state || nextProps !== this.props) 
  }

  componentWillReceiveProps(nextProps) {
    //update local array of active filter IDs
    this.activeFilterObjects = this.getActiveFilterIds(nextProps.activeFilters)

    //get array of filtered products and set state with updated list
    let filteredProducts = this.updateProductList(null, nextProps.activeFilters)    

    this.props.setProductCount(filteredProducts.length)

    //set state with new list of products
    this.setState({
      filteredProducts: filteredProducts,
      offset: 0,
      currentPage: 0
    })

    
  }

  //return array of active filter ids
  getActiveFilterIds(activeFilters){
    return activeFilters.map(activeFilter => ({
      "id": activeFilter.id,
      "parent": activeFilter.parent,
      "name": activeFilter.name
    }))
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
    
    let activeGroups = [...new Set(this.activeFilterObjects.map(filter => filter.parent))]
    let activeFilters = this.activeFilterObjects

    //create object tree of active filters so we can filter exclusively by parent groups
    let activeFilterTree = activeGroups.map(function(group){
      return {
        "parent": group,
        "children": activeFilters.filter(filter => filter.parent === group)
      }
    })

    //return true if product has department id included in each active filter group
    if (this.activeFilterObjects.length) {
      let matchArr = activeFilterTree.map(function(group){
        return productFilters.some(r => group.children.map(child => child.id).includes(r))
      })
      
      if (matchArr.indexOf(false) < 0) return true
      
    }
    else {
      //return true if no filters selected. this will render all products
      return true 
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
    const loading = this.state.loading ? (<div className="loading">{this.props.rootData.labels.loadingproducts}...</div>) : null
    return (
    
      <div className="product-list">
        {loading}
        {/* <ReactPaginate pageCount={Math.ceil(filteredProducts.length / this.props.perPage)}
                      pageRangeDisplayed={5}
                      marginPagesDisplayed={1}
                      nextLabel={this.props.rootData.labels.next}
                      previousLabel={this.props.rootData.labels.previous}
                      containerClassName={"pagination"}
                      onPageChange={this.handlePageClick}
                      forcePage={this.state.currentPage} /> */}
        {
          this.state.loading ? (<i className="loading animate-spin icon-spin5"></i>) : null
        }
        {
          (slicedProducts.length && !this.state.loading) ?
            slicedProducts.map(
              (product, i) => 
                <Product key={i}
                        name={product.Title}
                        formula={product.Formula}
                        thumbnail={product.Image.ThumbnailUrl}
                        link={this.props.rootData.baseUrl + "/" + product.FullUrl}
                        bvID={product.BazaarvoiceId}
                        psID={product.PriceSpiderId} />

            )
          :
            null
        }
      </div>
    )
  }
  
}

ProductList.defaultProps = {
  //perPage: 8 //number of products to show per page
  perPage: 100
}

export default ProductList