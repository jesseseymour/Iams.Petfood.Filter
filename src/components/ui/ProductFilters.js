import { Component } from 'react'
import fetch from 'isomorphic-fetch'

const ProductFilter = ({ id, name, active, parent, children, onToggleFilter }) => //individual product filter component
  <div className="product-filter-item" 
    key={ id }
    id={ id }
    data-active={active}
    data-parent={ (parent) ? 
      parent : null } //set data-parent to parent list item
    >
    <span onClick={ 
      (parent) ?
        (e) => onToggleFilter(name.toLowerCase(), id) :
        null 
    }>{ name }</span>
    { children }
  </div>



class ProductFilters extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filters: []
    }
  }

  componentDidMount() { //fetch filter data from json. this should be changed to fetch from the webservice when moved to client app
    fetch('./data/filters.json')
         .then(response => response.json())
         .then(filters => this.setState({
            filters
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


  setFilter({test,array=this.state.filters,results=[]} = {}) { //set filters on page load if any found in the url path
    function searchFilterArray(array, test) {    
      array.map((node,i) => {
        if(test.toLowerCase() === node.Title.toLowerCase().replace(/[^0-9a-zA-Z]+/g,"-")) { //replace special characters with hyphen
          results.push({name: node.Title.toLowerCase(), key: node.Id})
        }
        searchFilterArray(node.Children, test) //run function again if children found in object
      })
    }

    test.map((filter) => { //map array of filters found in url
      searchFilterArray(array,filter)
    })
    
    this.props.setFilters(results)
  }



  list({array=this.state.filters, depth=0, parent=null, render=true} = {}) { 
    return (array.map((node, i) => {
      return <ProductFilter key={i}
                      name={node.Title}
                      numChildren={node.Children.length}
                      active={this.props.filters.some(filter => filter.key === node.Id)}
                      parent={parent}
                      id={node.Id}
                      depth={depth}
                      onToggleFilter={this.props.onToggleFilter}>
                      { this.list({
                        array:node.Children,
                        depth:depth+1,
                        parent:node.Id
                      }) }
                      </ProductFilter>
      }))
  }

  activeFilters(array) { //list active filters below filter nav and bind onToggleFilter click event
    return (array.length) ?
      <div>
        <span className="clear-filters"
              onClick={this.props.clearFilters}>Clear All Filters</span>
        {array.map((node, i) => {
          return <span className="active-filter" 
                       onClick={(e) =>
                        this.props.onToggleFilter(
                          node.name.toLowerCase(), 
                          node.key, 
                          e.target.parentNode)}
                       key={"active-" + node.key}>
                       {node.name}
                 </span>
        })}</div> :
        <span className="active-filter">No active filters</span>
  }

  render() {
    const { filters } = this.state
    return (
      <div className="filter-list" >
        {this.list()}
        <div className="active-filters">{this.activeFilters(this.props.filters)}</div>
      </div>
    )
  }

}

export default ProductFilters