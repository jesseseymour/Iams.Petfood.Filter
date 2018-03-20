const Product = ({ name, subtitle, thumbnail, bvID, link, psID }) =>
  <div className="product">
    <a href={link}>
      <h3>{name}</h3>
      <h4>{subtitle}</h4>
      <img src={thumbnail} />
      <div>{bvID}</div>
      <div>{psID}</div>
    </a>
  </div>



export default Product