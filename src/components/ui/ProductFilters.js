import { Component } from 'react'
import fetch from 'isomorphic-fetch'


class ProductFilter extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <li 
        className="product-filter-item" 
        id={ this.props.name.toLowerCase() }
        data-active={ (this.props.filters.map(filter => 
          filter.name === this.props.name.toLowerCase() //set data-active=true is filter name matches an active filter
        )) }
        data-parent={ (this.props.parent) ? 
          this.props.parent.toLowerCase() : null } //set data-parent to parent list item
        >
        { this.props.name }
        { this.props.children }
      </li>
    )
  }
}

class ProductFilters extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filters: []
    }
  }

  componentDidMount() {
    fetch('./data/filters.json')
         .then(response => response.json())
         .then(filters => this.setState({
            filters
         }))
  }

  onToggleFilter(){

  }

  list(filters,parent=null) {
    let level = 1
    const children = (items,parent) => {
      if (items) {
        level++
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
                            onClick={ onToggleFilter("test name", "test parent") }>
                            { children(node.Children,node.Title) }
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