const { ObjectId } = require('mongodb');
const { getCustomerId, getMarketAdminId, getTraderAdminId } = require('../utils');
const { APP_SECRET } = require('../secrets');

async function customerData(parent, args, context, info) {
  const Customers = context.db.collection('customers');
  const _id = ObjectId(getCustomerId(context));

  const customer = await Customers.findOne({ _id });
  if (!customer) throw new Error('Token invalid');
  
  return customer;
};

async function administeredMarkets(parent, args, context, info) {
  const Markets = context.db.collection('markets');
  const _id = ObjectId(getMarketAdminId(context));
  const cursor = await Markets.find({ admins: ObjectId(_id) });
  const markets = cursor.toArray();
  if (!markets) throw new Error('Token invalid');

  return markets;
}

module.exports = {
  customerData,
  administeredMarkets,
};