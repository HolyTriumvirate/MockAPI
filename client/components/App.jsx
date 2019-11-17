import React, { Component } from 'react';
import ProductsContainer from './ProductsContainer';

// function graphQuill() {}


class App extends Component {
  constructor() {
    super();
    this.state = {
      my: 'state',
    };
  }

  render() {
    const { my } = this.state;

    return (
      <div>
        {my}
        <ProductsContainer />
      </div>
    );
  }
}

export default App;
