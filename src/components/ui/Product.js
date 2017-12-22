import { Component } from 'react'


const Product = ({ name, thumbnail, bvID, link, psID }) =>
  <div className="product">
    <a href={link}>
      <h3>{name}</h3>
      <img src={thumbnail} />
      <div>{bvID}</div>
      <div>{psID}</div>
    </a>
  </div>



export default Product