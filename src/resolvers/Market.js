const { ObjectId } = require('mongodb');

function id(parent, args, context, info) {
  return parent._id;
};

async function traders(parent, args, context, info) {
  const TraderCards = context.db.collection('traderCards');
  return parent.traders.map(id => TraderCards.findOne(ObjectId(id)));
};

module.exports = {
  id,
  traders,
};