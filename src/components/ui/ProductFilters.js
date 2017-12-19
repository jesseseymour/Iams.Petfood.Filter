import { Component } from 'react'
import fetch from 'isomorphic-fetch'


class ProductFilter extends Component {
  constructor(props) {
    super(props)
    
  }
  render() {
    const { toggleFilter } = this.props
    return (
      <li className="product-filter-item" id={ this.props.name }>
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

  list(filters) {
    let level = 1
    const children = (items) => {
      if (items) {
        level++
        return (<ul className={"submenu level-" + level}>
                 { this.list(items) }
               </ul>)
      }
    }

    return filters.map(( node, i ) => {
      return <ProductFilter key={i}
                            name={node.Title}
                            numChildren={node.Children.length}>
                            { children(node.Children) }
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