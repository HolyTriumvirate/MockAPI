import React from 'react';

const Product = (props) => {
  const { productId, name, description } = props;
  // console.log(props);
  return (
    <div className={`product-${productId} product`}>
      <p>{name}</p>
      <p>{description}</p>
    </div>
  );
};

export default Product;
