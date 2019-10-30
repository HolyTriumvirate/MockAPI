module.exports = {
  Query: {
    // query to lookup a cart by customerId
    cart: async (parent, args, { mongo }) => { // paren creates a multiline return
      // use findOne to return a single mongo document which will use
      // the default resolver from GraphQL that looks up parameters via keys.
      const queryResult = await mongo.CartModel.findOne({ customerId: args.customerId },
        (err, data) => {
          if (err) return console.log('ERROR IN MONOG QUERY cart Query: ', err);
          if (!data) {
            return console.log('cart does not exist');
          }
          // return console.log('the found cart is', data);
          return data; // I'm pretty sure this is doing nothing...
        });

      // defualtCart object made to be returned if the query returns null
      // not all users need to have carts so this is possible and avoids an error
      const defaultCart = { customerId: args.customerId, products: [], wishlist: [] };

      // return the queryResult if it's truthy (i.e. not null),
      // otherwise return the defaultCart
      return queryResult || defaultCart;
    },
  },

  Mutation: {
    createOrUpdateCart: async (parent, args, { mongo }) => mongo.CartModel.findOneAndUpdate({
      // conditions
      customerId: args.customerId,
    }, {
      // update (push into products array), used addToSet instead..
      // which treats the products value as a set and doesn't allow duplicates..
      $addToSet: { products: args.newItem },
    }, {
      // options
      lean: true,
      new: true, //
      upsert: true, // adds the docuemnt if one is not found
      useFindAndModify: false, // this has to do with some deprecation thing
    }, (err, data) => {
      if (err) return console.log('ERROR in addOrUpdateCart mutation', err);
      // return console.log('data is', data);
      return data; // this really doesn't do anything...
    }),

    // mutation to remove items from a cart
    // inputted arguments are the customerId and an array of itemsToRemove (all strings)
    removeItemsFromCart: async (parent, args, { mongo }) => mongo.CartModel.findOneAndUpdate(
      // leveraging implicit return of arrow function to return the promise of findOneAndUpdate
      {
      // conditions
        customerId: args.customerId,
      },
      { $pullAll: { products: args.itemsToRemove } }, // updateObject
      { new: true, useFindAndModify: false }, // options
      (err, data) => {
      // callback
        if (err) return console.log(err);
        // return console.log('data found is ', data);
        return data; // this really doesn't do anything...
      },
    ),

  },


};
