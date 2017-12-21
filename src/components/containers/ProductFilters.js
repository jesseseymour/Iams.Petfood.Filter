import ProductFilters from '../ui/ProductFilters'
//import ToggleFilter from '../ui/ProductFilters'
import { connect } from 'react-redux'
import { toggleFilter } from '../../actions'

const mapStateToProps = (state) => {
  return {
    filters: state.allFilters
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onToggleFilter(name,parent) {
      dispatch(
        toggleFilter(name,parent)
      )
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductFilters)