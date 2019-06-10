const { ObjectId } = require('mongodb');

function id(parent, args, context, info) {
  return parent._id;
};

async function inventory(parent, args, context, info) {
  const Items = context.db.collection('items');
  const traderCardId = ObjectId(parent._id);
  const cursor = await Items.find({ traderCardId });
  
  return cursor.toArray();
};

module.exports = {
  id,
  inventory,
};