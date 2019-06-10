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

module.exports = {
  customerData,

};