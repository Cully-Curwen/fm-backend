const { ObjectId } = require('mongodb');

function id(parent, args, context, info) {
  return parent._id;
};

async function traders(parent, args, context, info) {
  const TraderCards = context.db.collection('traderCards');
  const ids = parent.traders.map(ObjectId);
  const cursor = await TraderCards.find({ _id: { $in: ids } });
  console.log(cursor);
  
  return cursor.toArray();
};

module.exports = {
  id,
  traders,
};