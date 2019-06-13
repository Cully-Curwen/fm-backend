const { ObjectId } = require('mongodb');

function id(parent, args, context, info) {
  return parent._id;
};

async function traders(parent, args, context, info) {
  const TraderCards = context.db.collection('traderCards');
  const marketId = ObjectId(parent._id);
  const cursor = await TraderCards.find({ marketId });
  
  return cursor.toArray();
};

module.exports = {
  id,
  traders,
};