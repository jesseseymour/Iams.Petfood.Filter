const Product = ({ name, subtitle, thumbnail, bvID, link, psID, formula }) =>
  <div className="product">
    <a href={link}>
      <div className="img-container"><img src={thumbnail} /></div>
      <div className="bv-container" id={`BVRRInlineRating-${bvID}`} data-iams-bvid={bvID}></div>
      <span className="pl-prodcutFormula">{formula}</span>
      <span className="pl-name">{name}</span>
    </a>
    <div className="pl-buynow"><div className="ps-widget" data-ps-sku={psID}><span className="ps-button-label">BUY NOW</span></div>{PriceSpider.insertWidget({"sku":psID})}</div>
  </div>



export default Product