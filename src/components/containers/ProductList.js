import ProductList from '../ui/ProductList'
import { setProductCount } from '../../actions'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    activeFilters: state.activeFilters,
    productCount: state.productCount
  }
}

const mapDispatchToProps = dispatch => { //attach dispatch actions to ProductList ui component
  return {
    setProductCount(count) {
      dispatch(
        setProductCount(count)
      )
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductList)