import { Component } from 'react'
import { Panel } from 'react-bootstrap'

class ProductFilter extends Component {
  constructor(props) {
    super(props)
    this.el = document.getElementById("filterPanelGroup")
  }
 
  exited(){
    const tree = Array.from(this.el.childNodes)
    const classes = ["in", "collapsing"]
    const open = tree.filter(child => Array.from(child.lastChild.classList).some(v => classes.includes(v)))

    open.length ? this.el.classList.add("open") : this.el.classList.remove("open")
  }

  enter(){
    this.el.classList.add("open")
  }

  render() {
    const { catOrDog, images, subtext, id, name, active, parent, children, toggleFilter, dataStr, urlname, childrenClass, activeFilters, numChildren } = this.props
    if (children){
      return (
        <Panel eventKey={name}>
            <Panel.Heading>
              <Panel.Title toggle>
                <span className={catOrDog}>{name}</span>
                <span className={`count ${catOrDog}`}>
                  {activeFilters.length ? ` (${activeFilters.length})` : null}
                </span>
              </Panel.Title>
            </Panel.Heading>
            <Panel.Collapse onExited={() => this.exited()} onEnter={() => this.enter()}> 
              <Panel.Body className={`children-${numChildren.toString()} ${catOrDog}`}>{children}</Panel.Body>
            </Panel.Collapse>
          </Panel>
      )
    }
    else 
    {
      return (
        <div className={`product-filter-item ${catOrDog}`}
          key={ Date.now() }
          id={ id }
          data-active={active}
          data-parent={ (parent) ? parent : null } /*set data-parent to parent list item's id*/ 
          onClick={(e) => toggleFilter(name, id)}>
            <span className="active"><img src={images[0]} /></span>
            <span className="inactive"><img src={images[1]} /></span>
            <span className="name">{ name }</span>
            { subtext }
        </div>
      )
    }
  }
}



export default ProductFilter