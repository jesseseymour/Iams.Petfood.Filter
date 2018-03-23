import ProductFilters from '../ui/ProductFilters'
import { connect } from 'react-redux'
import { toggleFilter, setFilters, clearFilters } from '../../actions'
import { withRouter } from 'react-router-dom'

const mapStateToProps = (state) => {
  return {
    activeFilters: state.activeFilters
  }
}

const mapDispatchToProps = dispatch => { //attach dispatch actions to ProductFilters ui component
  return {
    toggleFilter(name,id,parent,urlname) {
      dispatch(
        toggleFilter(name,id,parent,urlname)
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