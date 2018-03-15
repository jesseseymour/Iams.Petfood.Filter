import { Component } from 'react'
import fetch from 'isomorphic-fetch'
import { withRouter } from 'react-router-dom'


//individual product filter component
const ProductFilter = ({ id, name, active, parent, children, toggleFilter, dataStr }) => 
  <div className="product-filter-item" 
    key={ Date.now() }
    id={ id }
    data-active={active}
    data-parent={ (parent) ? parent : null } /*set data-parent to parent list item's id*/ >
      <span onClick={ (parent) ? (e) => toggleFilter(name, id) : null /*if item has a parent, bind toggleFilter handler*/ } 
        /* {dataStr} */>
        { name }
      </span>
    <div className="children" id={ `${id}-children`}>{ children }</div>
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
  
  //fetch filter data from json. this should be changed to fetch from the webservice when moved to client app
  componentDidMount() { 
    const data = this.props.isDog ? 'dog-products' : 'cat-products'
    fetch('/api/GetFilters/index/' + data,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(availableFilters => this.setState({ availableFilters }))
      .then(() => this.checkURLForFilters())
  }

  componentWillReceiveProps(nextProps){
    if(this.props.activeFilters !== nextProps.activeFilters) this.updateQuery(nextProps.activeFilters)
  }

  checkURLForFilters() { //check url path or hash for any preset filters
    //example query string: ?protein=beef~chicken&type=dry
    const search = this.props.location.search.substr(1).split('&')

    //turn query string into array of filters

    const searchGroups = search.map( searchTerm => {
        let searchGroup = {}
        searchGroup.parent = searchTerm.substr(0,searchTerm.indexOf('='))
        searchGroup.terms = searchTerm.substr(searchTerm.indexOf('=') + 1, searchTerm.length).split('~')
        return searchGroup
      }
    )
    //send query string filters to setFilters function
    if (searchGroups.length) {
      this.setFilters({filterArr:searchGroups})
    }
  }

  //set filters on page load if any found in the url path
  //set filters on page load if any found in the url path
  setFilters({ filterArr, availableFilters = this.state.availableFilters, results = [] } = {}) {
    function searchFilterArray(filter, parent, availableFilters) {
      availableFilters.map((node, i) => {
        if (filter === node.FilterTitle.toLowerCase().replace(/[^0-9a-zA-Z]+/g, "-")) { //replace special characters with hyphen
          results.push({ name: node.FilterTitle.toLowerCase(), id: node.FilterDevName, parent: parent })
        }
        if (node.SubChildFilters.length) searchFilterArray(filter, parent, node.SubChildFilters) //run function again if children found in object
      })
    }
    
    //map array of filters found in url
    filterArr.map((filterGroup) => {
      filterGroup.terms.map( filter => searchFilterArray(filter.toLowerCase(), filterGroup.parent, availableFilters) )
    })

    this.props.setFilters(results) //use setFilters dispatch
  }

  updateQuery(activeFilters) {
    //take all active filters and add to query string
    //first build the query string from active filters
    let activeFiltersObj = {}
    let filterStr = '?'
    activeFilters.map(filter => {
      let parent = filter.parent
      activeFiltersObj[parent] ? activeFiltersObj[parent].push(filter.id) : activeFiltersObj[parent] = [filter.id]

    })

    for (const set in activeFiltersObj){
      let seperator = filterStr.length > 1 ? '&' : ''
      filterStr += `${seperator}${set}=${activeFiltersObj[set].join('~')}`
    }

    this.props.history.replace({search: filterStr})
  }

  handleFilterClick(name,id,parent) {
    this.props.toggleFilter(name.toLowerCase(),id,parent)
  }

  listFilters({array=this.state.availableFilters, depth=0, parent=null, render=true} = {}) { 
    return (array.map((node, i) => {
      return <ProductFilter key={i}
                            name={node.FilterTitle}
                            numChildren={node.SubChildFilters.length}
                            active={this.props.activeFilters.some(filter => filter.id === node.FilterDevName)} //search map in list of active filters
                            parent={parent}
                            id={node.FilterDevName}
                            depth={depth}
                            toggleFilter={(e) => this.handleFilterClick(node.FilterTitle, node.FilterDevName, parent)}
                            dataStr={parent ? "data-toggle='collapse' data-target=`${node.FilterDevName}-children`" : null}>
                              { this.listFilters
                                ({array:node.SubChildFilters,
                                  depth:depth+1,
                                  parent:node.FilterDevName
                                })}
             </ProductFilter>
      }))
  }
  
  //list active filters below filter nav and bind toggleFilter click event
  renderActiveFilters(array) { 
    return (array.length) ?
      <div>
        <span className="clear-filters"
              onClick={this.props.clearFilters}>
                Clear All Filters
        </span>
        {
          array.map((node, i) => {
            return <span className="active-filter" 
                         onClick={(e) => this.handleFilterClick(node.name.toLowerCase(), node.id)}
                         key={Date.now() + i}>
                       {node.name} 
                   </span>
        })}
      </div> :
      <span className="active-filter">{this.props.rootData.noactivefilters}</span>
  }

  render() {
    return (
      <div className="filter-container">
        <div className="product-type">{this.props.isDog ? this.props.rootData.dogfood : this.props.rootData.catfood}</div>
        <div>{this.props.rootData.filter}</div>
        <div className="filter-list" >
          <div className="product-filter-item" onClick={this.props.clearFilters}>{this.props.rootData.allproducts}</div>
          {this.listFilters()} 
          <div className="active-filters">{this.renderActiveFilters(this.props.activeFilters)}</div>
        </div>
      </div>
    )
  }

}

const ProductFiltersWithRouter = withRouter(ProductFilters)
export default ProductFiltersWithRouter