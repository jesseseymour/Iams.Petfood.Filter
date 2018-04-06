import { Component } from 'react'
import fetch from 'isomorphic-fetch'
import { withRouter } from 'react-router-dom'


//individual product filter component
const ProductFilter = ({ id, name, active, parent, children, toggleFilter, dataStr, urlname, collapseChildren, collapsed, childrenClass }) => 
  <div className={collapsed === "in" ? `product-filter-item ${childrenClass}` : `product-filter-item is-collapsed ${childrenClass}`}
    key={ Date.now() }
    id={ id }
    data-active={active}
    data-parent={ (parent) ? parent : null } /*set data-parent to parent list item's id*/ >
      <span onClick={ (parent) ? (e) => toggleFilter(name, id) : (e) => collapseChildren(e,id) /*if item has a parent, bind toggleFilter handler*/ } 
        /* {dataStr} */>
        { name }
      </span>
    {children ? (<div className={`children collapse ${collapsed}`} id={ `${id}-children`}>{ children }</div>) : null}
  </div>


class ProductFilters extends Component {
  constructor(props) {
    super(props)
    this.state = {
      availableFilters: [],
      openParents: [],
      isCollapsed: true
    }
  }
  
  //fetch filter data from json. this should be changed to fetch from the webservice when moved to client app
  componentDidMount() { 
    fetch('/api/Products/Filters?department=' + this.props.rootData.department.urlName,
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
  setFilters({ filterArr, availableFilters = this.state.availableFilters, results = [] } = {}) {
    function searchFilterArray(filter, parent, availableFilters) {
      availableFilters.map((node, i) => {
        if (filter === node.Title.toLowerCase().replace(/[^0-9a-zA-Z]+/g, "-")) { //replace special characters with hyphen
          results.push({ name: node.Title.toLowerCase(), id: node.Id, parent: node.ParentId, urlname: node.UrlName })
        }
        if (node.Children.length) searchFilterArray(filter, parent, node.Children) //run function again if children found in object
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
    return filter.UrlName
  }

  findFilterById(id, availableFilters = this.state.availableFilters) {
    const match = availableFilters.filter(node => node.Id === id)
    
    if(match.length){
      return match[0]
    } else{ 
      availableFilters.map(node => {
        this.findFilterById(id,node.Children)
      })
    }
  }

  handleFilterClick(name,id,parent,urlname) {
    this.props.toggleFilter(name.toLowerCase(),id,parent,urlname)
  }

  collapseChildren(e,id) {
    if (window.jQuery){
      $(e.currentTarget.nextSibling).collapse('toggle')
      let openParents = this.state.openParents
      openParents.indexOf(id) >= 0 ? openParents.splice(openParents.indexOf(id),1) : openParents.push(id)
      this.setState({
        openParents
      })
    }
  }

  listFilters({array=this.state.availableFilters, depth=0, parent=null, render=true} = {}) { 
    if (!array) return false
    return (array.map((node, i) => {
      return <ProductFilter key={i}
                            name={node.Title}
                            numChildren={node.Children.length}
                            active={this.props.activeFilters.some(filter => filter.id === node.Id)} //search map in list of active filters
                            parent={parent}
                            id={node.Id}
                            urlname={node.UrlName}
                            depth={depth}
                            toggleFilter={(e) => this.handleFilterClick(node.Title, node.Id, parent, node.UrlName)}
                            collapseChildren={(e) => this.collapseChildren(e,node.Id)}
                            collapsed={this.state.openParents.includes(node.Id) ? "in" : ""}
                            childrenClass={node.Children.length ? "has-children" : ""}
                            //dataStr={parent ? "data-toggle='collapse' data-target=`${node.UrlName}-children`" : null}
                            >
                              { node.Children.length ? this.listFilters ({array:node.Children, depth:depth+1, parent:node.Id }) : null }
             </ProductFilter>
      }))
  }
  
  //list active filters below filter nav and bind toggleFilter click event
  renderActiveFilters(array) { 
    return (array.length) ?
      <div>
        <span className="clear-filters"
              onClick={this.props.clearFilters}>
                {this.props.rootData.labels.clearfilters}
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
      <span className="active-filter">{this.props.rootData.labels.noactivefilters}</span>
  }

  render() {
    const collapsed = this.state.isCollapsed ? "" : "in"
    return (
      <div className="filter-container">
        <div className="product-type"><h1>{this.props.rootData.department.title}</h1></div>
        <div onClick={() => this.setState({ isCollapsed: !this.state.isCollapsed })}
             className={this.state.isCollapsed ? "is-collapsed": ""}>{this.props.rootData.labels.filter}</div>
        <div className={`filter-list collapse ${collapsed}`} >
          <div className="product-filter-item" onClick={this.props.clearFilters}>{this.props.rootData.labels.allproducts}</div>
          {this.listFilters()} 
          <div className="active-filters">{this.renderActiveFilters(this.props.activeFilters)}</div>
        </div>
      </div>
    )
  }

}

const ProductFiltersWithRouter = withRouter(ProductFilters)
export default ProductFiltersWithRouter