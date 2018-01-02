import { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import App from './App'


class routes extends Component {
  render() {
    return (
      <Router basename="/dog-foods" >
        <App />
      </Router>
    )
  }
}

export default routes 