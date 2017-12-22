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

  list_old(filters,parent=null,level=0) {
    //console.log('parent: ' + parent + ' | level: ' + level)
    console.log(filters)
    const children = (items,parent) => {

      if (items) {
        return (
          (items.length)?
            <div className={"submenu level-" + level}>
                 { this.list(items,parent, level++) }
               </div> :
            null)
      }
    }

    return filters.map(( node, i ) => {
      return <ProductFilter key={i}
                            name={node.Title}
                            numChildren={node.Children.length}
                            active={this.props.filters.some(filter => filter.key === node.Id)}
                            parent="test"
                            id={node.Id}
                            onToggleFilter={this.props.onToggleFilter}>
                            { children(node.Children,node.Title) }
                            </ProductFilter>
    })
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

  render() {
    const { filters } = this.state
    return (
      <div className="filter-list" >{this.list(filters)}</div>
    )
  }

}

export default ProductFilters