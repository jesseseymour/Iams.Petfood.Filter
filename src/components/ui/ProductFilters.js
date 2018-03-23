import { Component } from 'react'
import fetch from 'isomorphic-fetch'
import { withRouter } from 'react-router-dom'

const ProductFilter = ({ id, name, active, parent, children, toggleFilter, urlname }) => //individual product filter component
  <div className="product-filter-item" 
    key={ id }
    id={ urlname }
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
    fetch('/data/filters.json')
      .then(response => response.json())
      .then(availableFilters => this.setState({
        availableFilters
      }))
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
  setFilters({ filterArr, availableFilters = this.state.availableFilters, results = [] } = {}) {
    function searchFilterArray(filter, parent, availableFilters) {
      availableFilters.map((node, i) => {
        if (filter === node.FilterTitle.toLowerCase().replace(/[^0-9a-zA-Z]+/g, "-")) { //replace special characters with hyphen
          results.push({ name: node.FilterTitle.toLowerCase(), id: node.FilterId, parent: node.ParentFilter, urlname: node.FilterDevName })
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
      let parent = this.getFilterUrlnameById(filter.parent)
      activeFiltersObj[parent] ? activeFiltersObj[parent].push(filter.urlname) : activeFiltersObj[parent] = [filter.urlname]

    })

    for (const set in activeFiltersObj){
      let seperator = filterStr.length > 1 ? '&' : ''
      filterStr += `${seperator}${set}=${activeFiltersObj[set].join('~')}`
    }

    this.props.history.replace({search: filterStr})
  }

  getFilterUrlnameById(id){
    const filter = this.findFilterById(id,this.state.availableFilters)
    return filter.FilterDevName
  }

  findFilterById(id, availableFilters = this.state.availableFilters) {
    const match = availableFilters.filter(node => node.FilterId === id)
    
    if(match.length){
      return match[0]
    } else{ 
      availableFilters.map(node => {
        this.findFilterById(id,node.SubChildFilters)
      })
    }
  }

  handleFilterClick(name,id,parent,urlname) {
    this.props.toggleFilter(name.toLowerCase(),id,parent,urlname)
  }

  list({array=this.state.availableFilters, depth=0, parent=null, render=true} = {}) { 
    return (array.map((node, i) => {
      return <ProductFilter key={i}
                            name={node.FilterTitle}
                            numChildren={node.SubChildFilters.length}
                            active={this.props.activeFilters.some(filter => filter.id === node.FilterId)} //search map in list of active filters
                            parent={parent}
                            id={node.FilterId}
                            urlname={node.FilterDevName}
                            depth={depth}
                            toggleFilter={(e) => this.handleFilterClick(node.FilterTitle, node.FilterId, parent,node.FilterDevName)}>
                            { this.list({
                              array:node.SubChildFilters,
                              depth:depth+1,
                              parent:node.FilterId
                            }) }
             </ProductFilter>
      }))
  }

  activeFilters(array) { //list active filters below filter nav and bind toggleFilter click event
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
        {this.list()} 
        <div className="active-filters">{this.activeFilters(this.props.activeFilters)}</div>
      </div>
    )
  }

}

const ProductFiltersWithRouter = withRouter(ProductFilters)
export default ProductFiltersWithRouter