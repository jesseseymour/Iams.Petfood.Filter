import { Component } from 'react'
import fetch from 'isomorphic-fetch'
import { withRouter } from 'react-router-dom'
import ProductFilter from './ProductFilter'
import { PanelGroup, Panel, Button } from 'react-bootstrap'


class ProductFilters extends Component {
  constructor(props) {
    super(props)
    this.state = {
      availableFilters: [],
      open: false
    }
  }
  
  //fetch filter data from json. this should be changed to fetch from the webservice when moved to client app
  componentDidMount() { 
    fetch('/api/Products/Filters?department=' + this.props.rootData.department.urlName,
    {
      method: 'GET',
      credentials: 'include',
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

  shouldComponentUpdate(nextProps, nextState){
    if(nextState.open !== this.state.open){
      return true
    }
    if(nextProps.activeFilters === this.props.activeFilters){
      return false
    }

    return true
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
      let parent = this.getFilterUrlnameById(filter.parent).split('/').pop()
      activeFiltersObj[parent] ? activeFiltersObj[parent].push(filter.urlname.split('/').pop()) : activeFiltersObj[parent] = [filter.urlname.split('/').pop()]

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

  listFilters({array=this.state.availableFilters, depth=0, parent=null, render=true} = {}) { 
    if (!array) return false
    return (array.map((node, i) => {
      return <ProductFilter key={i}
                            name={node.Title}
                            subtext={node.Description}
                            numChildren={node.Children.length}
                            active={this.props.activeFilters.some(filter => filter.id === node.Id)} //search map in list of active filters
                            parent={parent}
                            id={node.Id}
                            urlname={node.UrlName}
                            depth={depth}
                            toggleFilter={(e) => this.handleFilterClick(node.Title, node.Id, parent, node.UrlName)}
                            childrenClass={node.Children.length ? "has-children" : ""}
                            activeFilters={this.props.activeFilters}
                            images={[node.ImageActive.ThumbnailUrl,node.ImageInactive.ThumbnailUrl]}
                            catOrDog={this.props.rootData.department.urlName}
                            loaded={this.state.loaded}
                            //dataStr={parent ? "data-toggle='collapse' data-target=`${node.UrlName}-children`" : null}
                            >
                              { node.Children.length ? this.listFilters ({array:node.Children, depth:depth+1, parent:node.Id }) : null }
             </ProductFilter>
      }))
  }
  
  //list active filters below filter nav and bind toggleFilter click event
  renderActiveFilters(array) { 
    let separater = array.length == 2 ? " & " : array.length > 2 ? ", " : ""
    return (
        array.map((node, i) => {
          return (
            <span className="active-filter" 
                  onClick={(e) => this.handleFilterClick(node.name.toLowerCase(), node.id)}
                  key={Date.now() + i}>
              {node.name}
              <span>{i < array.length - 1 ? separater : null}</span>
            </span>
            
          )
      })
    )
  }
  
  render() {
    const noFilters = this.props.activeFilters.length === 0 ? " nofilters" : "";
    return (
      <div className="filters">
        <Panel id="FilterContainer" expanded={this.state.open}>
          <Panel.Collapse>
            <Panel.Body className="filter-panel-body">
              <div className="filter-container">
                <div className="close" onClick={() => this.setState({ open: false })}>&#x2715;</div>
                <div className="filters-list">{this.props.rootData.labels.filter}: {this.renderActiveFilters(this.props.activeFilters)}</div>
                <PanelGroup accordion className="filter-list" id="filterPanelGroup">
                  <div className="product-filter-item hidden-xs hidden-sm" onClick={this.props.clearFilters}><span className={this.props.rootData.department.urlName + noFilters}>{this.props.rootData.labels.allproducts}</span></div>
                    {this.listFilters()}
                  </PanelGroup>
                  <div className="bottom">
                    <span className={`clear-filters ${this.props.rootData.department.urlName}`} onClick={this.props.clearFilters}>{this.props.activeFilters.length ? (this.props.rootData.labels.clearfilters + " (" + this.props.activeFilters.length) + ")" : null}</span>          
                  <Button className={`see-products ${this.props.rootData.department.urlName}`} onClick={() => this.setState({open: !this.state.open})}>
                      See {this.props.productCount} Product{this.props.productCount === 1 ? "" : "s"}
                    </Button>
                  </div>
              </div>
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
        <Button className="show-filters" onClick={() => this.setState({ open: !this.state.open })}>
          {this.props.rootData.labels.filtertogglebutton}
        </Button>
        <div className="selected-clear">
          {this.props.activeFilters.length ? <div className="filters-list">Selected: {this.renderActiveFilters(this.props.activeFilters)}</div> : null}
          <span className={`clear-filters hidden-lg hidden-md ${this.props.rootData.department.urlName}`} onClick={this.props.clearFilters}>{this.props.activeFilters.length ? (this.props.rootData.labels.clearfilters + " (" + this.props.activeFilters.length) + ")" : null}</span>
          <span className={`clear-filters hidden-sm hidden-xs ${this.props.rootData.department.urlName}`} onClick={this.props.clearFilters}>{this.props.activeFilters.length ? "Reset Filters" : null}</span>
        </div>
      </div>
    )
  }

}

const ProductFiltersWithRouter = withRouter(ProductFilters)
export default ProductFiltersWithRouter