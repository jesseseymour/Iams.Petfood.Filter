import ProductList from '../ui/ProductList'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    activeFilters: state.activeFilters
  }
}


export default connect(mapStateToProps)(ProductList)