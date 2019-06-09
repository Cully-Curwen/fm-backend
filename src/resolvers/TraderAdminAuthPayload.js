const { ObjectId } = require('mongodb');

async function traderCards(parent, args, context, info) {
  const TraderCards = context.db.collection('traderCards');
  const id = ObjectId(parent.traderAdmin._id);
  const cursor = await TraderCards.find({ admins: id });

  return cursor.toArray();
};

module.exports = {
  traderCards,
};