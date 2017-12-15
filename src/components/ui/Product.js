import { Component } from 'react'

class Product extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {

    const { name, thumbnail, bvID, link, psID } = this.props

    return (
      <div className="product">
        <a href={link}>
          <h3>{name}</h3>
          <img src={thumbnail} />
          <div>{bvID}</div>
          <div>{psID}</div>
        </a>
      </div>
    )
  }
}

export default Product