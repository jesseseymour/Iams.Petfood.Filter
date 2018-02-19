import { Component } from 'react'
import fetch from 'isomorphic-fetch'

const ProductFilter = ({ id, name, active, parent, children, toggleFilter }) => //individual product filter component
  <div className="product-filter-item" 
    key={ id }
    id={ id }
    data-active={active}
    data-parent={ (parent) ? parent : null } //set data-parent to parent list item's id 
  >
    <span onClick={ 
      (parent) ?
        (e) => toggleFilter(name.toLowerCase(), id) : //if item has a parent, bind toggleFilter handler
        null 
    }>{ name }</span>
    { children }
  </div>



class ProductFilters extends Component {
  constructor(props) {
    super(props)
    this.state = {
      availableFilters: []
    }
    this.path = window.location.pathname.substr(1).split('/') //convert path to array and remove first empty item
    this.base = this.path[0] //use first item as base (natural-cat-food or natural-dog-food)
  }

  componentDidMount() { //fetch filter data from json. this should be changed to fetch from the webservice when moved to client app
    const data = this.base.indexOf('dog') >= 0 ? 'dog' : 'cat'

    fetch('/data/filters-' + data + '.json')
         .then(response => response.json())
         .then(availableFilters => this.setState({
            availableFilters
         }))
         .then(() => this.checkURLForFilters())
  }

  //check url path or hash for any preset filters
  checkURLForFilters() { 
    const path = this.path
    const base = this.base

    const unique = arrArg => arrArg.filter((elem,pos,arr) => arr.indexOf(elem) == pos) //de-dupe array function
    const filterArr = unique(path.slice(1,path.length))//array of filters includes every item in path after 0

    
    //return
    if (filterArr.length) {
      this.setFilters({filterArr:filterArr})
    } else {
      return
    }
  }


  setFilters({filterArr,availableFilters=this.state.availableFilters,results=[]} = {}) { //set filters on page load if any found in the url path
    function searchFilterArray(filter, availableFilters) {    
      availableFilters.map((node,i) => {
        if(filter === node.FilterTitle.toLowerCase().replace(/[^0-9a-zA-Z]+/g,"-")) { //replace special characters with hyphen
          results.push({name: node.FilterTitle.toLowerCase(), id: node.FilterId})
        }
        if(node.SubChildFilters.length) searchFilterArray(filter, node.SubChildFilters) //run function again if children found in object
      })
    }

    filterArr.map((filter) => { //map array of filters found in url
      searchFilterArray(filter.toLowerCase(), availableFilters)
    })
    
    this.props.setFilters(results) //use setFilters dispatch
  }



  listFilters({array=this.state.availableFilters, depth=0, parent=null, render=true} = {}) { 
    return (array.map((node, i) => {
      return <ProductFilter key={i}
                            name={node.FilterTitle}
                            numChildren={node.SubChildFilters.length}
                            active={this.props.activeFilters.some(filter => filter.id === node.FilterId)} //search map in list of active filters
                            parent={parent}
                            id={node.FilterId}
                            depth={depth}
                            toggleFilter={this.props.toggleFilter}>
                            { this.listFilters({
                              array:node.SubChildFilters,
                              depth:depth+1,
                              parent:node.FilterId
                            }) }
             </ProductFilter>
      }))
  }

  renderActiveFilters(array) { //list active filters below filter nav and bind toggleFilter click event
    return (array.length) ?
      <div>
        <span className="clear-filters"
              onClick={this.props.clearFilters}>
                Clear All Filters
        </span>
        {
          array.map((node, i) => {
            return <span className="active-filter" 
                         onClick={(e) => this.props.toggleFilter(node.name.toLowerCase(), node.id, e.target.parentNode)}
                         key={"active-" + node.id}>
                       {node.name} 
                   </span>
        })}
      </div> :
      <span className="active-filter">No active filters</span>
  }

  render() {
    return (
      <div className="filter-list" >
        {this.listFilters()} 
        <div className="active-filters">{this.renderActiveFilters(this.props.activeFilters)}</div>
      </div>
    )
  }

}

export default ProductFilters