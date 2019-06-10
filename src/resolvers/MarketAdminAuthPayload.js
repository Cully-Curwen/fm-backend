const { ObjectId } = require('mongodb');

async function markets(parent, args, context, info) {
  const Markets = context.db.collection('markets');
  const id = ObjectId(parent.marketAdmin._id);
  const cursor = await Markets.find({ admins: id });

  return cursor.toArray();
};

module.exports = {
  markets,
};