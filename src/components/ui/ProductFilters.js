import { Component } from 'react'
import fetch from 'isomorphic-fetch'


const ProductFilter = ({ id, name, filters, parent, children, onToggleFilter }) =>
  <li className="product-filter-item" 
    key={ id }
    id={ name.toLowerCase() }
    data-active={ (filters.map(filter => 
      filter.name === name.toLowerCase() //set data-active=true is filter name matches an active filter
    )) }
    data-parent={ (parent) ? 
      parent.toLowerCase() : null } //set data-parent to parent list item
    >
    <span onClick={ 
      (parent) ?
        () => onToggleFilter(name.toLowerCase(), id) :
        null 
    }>{ name }</span>
    { children }
  </li>



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

  list(filters,parent=null,level=0) {
    
    const children = (items,parent,level) => {
      if (items) {
        return (<ul className={"submenu level-" + level}>
                 { this.list(items,parent) }
               </ul>)
      }
    }

    return filters.map(( node, i ) => {
      return <ProductFilter key={i}
                            name={node.Title}
                            numChildren={node.Children.length}
                            filters={this.props.filters}
                            parent={parent}
                            id={node.Id}
                            onToggleFilter={this.props.onToggleFilter}>
                            { children(node.Children,node.Title,level++) }
                            </ProductFilter>
    })
  }

  render() {
    const { filters } = this.state
    return (
      <ul className="filter-list" >{this.list(filters)}</ul>
    )
  }

}

export default ProductFilters