import ProductList from '../ui/ProductList'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    filters: state.allFilters
  }
}


export default connect(mapStateToProps)(ProductList)