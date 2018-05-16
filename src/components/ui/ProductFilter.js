import { Component } from 'react'
import { Panel } from 'react-bootstrap'

class ProductFilter extends Component {
  constructor(props) {
    super(props)
    this.el = document.getElementById("filterPanelGroup")
    this.state = {
      componentLoaded: false
    }
  }
 
  componentDidMount(){
    this.setState({componentLoaded:true})
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
    const animal = catOrDog === 'dog-food' ? 'dog' : 'cat'
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
        <div className={`product-filter-item ${catOrDog} ${animal}-${urlname.split('/').pop()}`}
          key={ Date.now() }
          id={ id }
          data-active={active}
          data-parent={ (parent) ? parent : null } /*set data-parent to parent list item's id*/ 
          onClick={(e) => toggleFilter(name, id)}>
            <span className="active"><svg><use xlinkHref={`#${animal}-${urlname.split('/').pop()}-active`} /></svg></span>
            <span className="inactive"><svg><use xlinkHref={`#${animal}-${urlname.split('/').pop()}`} /></svg></span>
            <span className="name">{ name }</span>
            
            { subtext }
        </div>
      )
    }
  }
}



export default ProductFilter