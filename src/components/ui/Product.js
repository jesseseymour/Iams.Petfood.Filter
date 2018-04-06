const Product = ({ name, subtitle, thumbnail, bvID, link, psID }) =>
  <div className="product">
    <a href={link}>
      <div className="img-container"><img src={thumbnail} /></div>
      <div className="bv-container" bid={`BVVRInlineRating-${bvID}`}></div>
      <h2>{name}</h2>
      <h3>{subtitle}</h3>
      {/* <div>{psID}</div> */}
    </a>
  </div>



export default Product