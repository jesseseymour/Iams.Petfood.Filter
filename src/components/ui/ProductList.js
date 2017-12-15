import { Component } from 'react'
import Product from './Product'
import fetch from 'isomorphic-fetch'

class ProductList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      /*products: [
        {
          name: "Pedigree Dry Dog Food",
          thumbnail: "https://www.pedigree.com/images/default-source/default-album/logo.png",
          bvID: "6",
          psID: "023100102801"
        },
        {
          name: "Pedigree Wet Dog Food",
          thumbnail: "https://www.pedigree.com/images/default-source/default-album/logo.png",
          bvID: "6",
          psID: "023100102801"
        },
        {
          name: "Pedigree Treats",
          thumbnail: "https://www.pedigree.com/images/default-source/default-album/logo.png",
          bvID: "6",
          psID: "023100102801"
        }
      ]*/
      products: [],
      loading: false
    }
  }

  componentDidMount() {
    this.setState({loading:true})
    fetch('./data/MOCK_DATA.json')
            .then(response => response.json())
            .then(products => this.setState({
                products,
                loading: false
            }))
  }

  render() {
    const { products } = this.state
    return (
      <div className="product-list">
        <h1>Products</h1>
        {(products.length) ?
            products.slice(0,10).map(
              (product, i) =>
                <Product key={i}
                         name={product.name}
                         thumbnail={product.thumbnail}
                         link={product.link}
                         bvID={product.bvID}
                         psID={product.psID}
                         type={product.type}
                         age={product.age}
                         flavors={product.flavors} />
            ):
          <span>Currently 0 Products</span>



        }
      </div>
    )
  }
}

export default ProductList