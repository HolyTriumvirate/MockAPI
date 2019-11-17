import React, { Component } from 'react';
import Product from './Product';

function graphQuill() {}


class ProductsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
    };
  }

  componentDidMount() {
    // fetch id, name, and description for all products
    fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ products { productId name description } }' }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ products: data.data.products });
      })
      .catch((err) => console.log('ERROR!!!', err));
  }

  render() {
    const { products } = this.state;

    if (products) {
      return (
        <div className="products-container">
          {products.map((productObject, index) => {
            const { productId, name, description } = productObject;
            return <Product index={index} productId={productId} name={name} description={description} key={`product-${productObject.productId}`} />;
          })}
        </div>
      );
    }
    return (
      <div className="products-container">
          wait a tick
      </div>
    );
  }
}

graphQuill(`{
  products{
    name
    description
  }
}`);

export default ProductsContainer;
