import { Component } from 'react'
import fetch from 'isomorphic-fetch'


const ToggleFilter = ({ onToggleFilter=f=>f }) =>
  <div onClick={ () => onToggleFilter("test1","test2") }>Testing</div>

export default ToggleFilter