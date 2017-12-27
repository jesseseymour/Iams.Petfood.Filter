import ProductList from '../ui/ProductList'
import { connect } from 'react-redux'
import { toggleFilter } from '../../actions'

const mapStateToProps = (state) => {
  return {
    filters: state.allFilters
  }
}

const mapDispatchToProps = dispatch => {
  return {
    test(name,id,e) {
      dispatch(
        toggleFilter(name,id)
      )
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductList)