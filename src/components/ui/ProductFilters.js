import { Component } from 'react'
import fetch from 'isomorphic-fetch'
import storeFactory from '../../store'


const ProductFilter = ({ id, name, active, parent, children, onToggleFilter }) =>
  <div className="product-filter-item" 
    key={ id }
    id={ id }
    data-active={active}
    data-parent={ (parent) ? 
      parent : null } //set data-parent to parent list item
    >
    <span onClick={ 
      (parent) ?
        (e) => onToggleFilter(name.toLowerCase(), id, e.target.parentNode) :
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

  componentDidMount() { //fetch filter data from json
    fetch('./data/filters.json')
         .then(response => response.json())
         .then(filters => this.setState({
            filters
         }))
  }

  list(array,depth=0,parent=null) {
    return array.map((node, i) => {
      return <ProductFilter key={i}
                            name={node.Title}
                            numChildren={node.Children.length}
                            active={this.props.filters.some(filter => filter.key === node.Id)}
                            parent={parent}
                            id={node.Id}
                            depth={depth}
                            onToggleFilter={this.props.onToggleFilter}>
                            { this.list(node.Children,depth+1,node.Id) }
                            </ProductFilter>
    }) 
  }

  activeFilters(array) { //list active filters below filter nav and bind onToggleFilter click event
    return (array.length) ?
      array.map((node, i) => {
        return <span className="active-filter" 
                     onClick={(e) =>
                      this.props.onToggleFilter(
                        node.name.toLowerCase(), 
                        node.key, 
                        e.target.parentNode)}
                     key={"active-" + node.key}>
                     {node.name}
               </span>
      }) :
      <span className="active-filter">No active filters</span>
  }

  render() {
    const { filters } = this.state
    return (
      <div className="filter-list" >
        {this.list(filters)}
        <div className="active-filters">{this.activeFilters(this.props.filters)}</div>
      </div>
    )
  }

}

export default ProductFilters