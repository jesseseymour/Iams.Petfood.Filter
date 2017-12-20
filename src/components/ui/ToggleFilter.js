import { Component } from 'react'
import fetch from 'isomorphic-fetch'


const ToggleFilter = ({ onToggleFilter=f=>f }) =>
  <div key={1} onClick={ () => onToggleFilter("test filter",1) }>Testing</div>

export default ToggleFilter