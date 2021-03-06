const { ObjectId } = require('mongodb');

function id(parent, args, context, info) {
  return parent._id;
};

async function shoppingCarts(parent, args, context, into) {
  const Markets = context.db.collection('markets');
  return parent.shoppingCarts.map(async ({ marketId, items }) => { 
    const id = marketId;
    const market = await Markets.findOne({ _id: ObjectId(marketId) });
    return { id, market, items };
  });
};

module.exports = {
  id,
  shoppingCarts,
};