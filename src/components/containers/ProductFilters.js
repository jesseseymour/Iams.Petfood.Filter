import ProductFilters from '../ui/ProductFilters'
import { connect } from 'react-redux'
import { toggleFilter, setFilters, clearFilters } from '../../actions'

const mapStateToProps = (state) => {
  return {
    filters: state.allFilters
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onToggleFilter(name,id,e) {
      dispatch(
        toggleFilter(name,id)
      )
    },
    setFilters(array) {
      dispatch(
        setFilters(array)
      )
    },
    clearFilters() {
      dispatch(
        clearFilters()
      )
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductFilters)