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
  }

  componentDidMount() { //fetch filter data from json. this should be changed to fetch from the webservice when moved to client app
    fetch('./data/filters-dog.json')
         .then(response => response.json())
         .then(availableFilters => this.setState({
            availableFilters
         }))
         .then(() => this.checkURLForFilters())
  }

  checkURLForFilters() { //check url path or hash for any preset filters
    const path = window.location.pathname
    const hash = window.location.hash
    const base = "dog-foods/"
    const filterHashStr = hash.substr(hash.indexOf(base) + base.length, hash.length)
    const filterPathStr = path.substr(path.indexOf(base) + base.length, path.length)

    if (filterHashStr.length || filterPathStr.length) {
      const unique = (arrArg) => arrArg.filter((elem,pos,arr) => arr.indexOf(elem) == pos) //de-dupe array function
      const filterArr = unique(filterHashStr.split("/").concat(filterPathStr.split("/"))) //concat hash and path strings and create de-duped array
      this.setFilter({test:filterArr})
    } else {
      return
    }
  }


  setFilter({test,array=this.state.availableFilters,results=[]} = {}) { //set filters on page load if any found in the url path
    function searchFilterArray(array, test) {    
      array.map((node,i) => {
        if(test.toLowerCase() === node.Title.toLowerCase().replace(/[^0-9a-zA-Z]+/g,"-")) { //replace special characters with hyphen
          results.push({name: node.Title.toLowerCase(), id: node.Id})
        }
        searchFilterArray(node.Children, test) //run function again if children found in object
      })
    }

    test.map((filter) => { //map array of filters found in url
      searchFilterArray(array,filter)
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