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

async function marketAdminData(parnet, args, context, info) {
  const MarketAdmins = context.db.collection('marketAdmins');
  const _id = ObjectId(getMarketAdminId(context));

  const marketAdmin = await MarketAdmins.findOne({ _id });
  if (!marketAdmin) throw new Error('Token invalid');

  return marketAdmin;
};

async function traderAdminData(parnet, args, context, info) {
  const TraderAdmins = context.db.collection('traderAdmins');
  const _id = ObjectId(getTraderAdminId(context));

  const traderAdmin = await TraderAdmins.findOne({ _id });
  if (!traderAdmin) throw new Error('Token invalid');

  return traderAdmin;
};

async function administeredMarkets(parent, args, context, info) {
  const Markets = context.db.collection('markets');
  const _id = ObjectId(getMarketAdminId(context));
  const cursor = await Markets.find({ admins: ObjectId(_id) });
  const markets = cursor.toArray();
  if (!markets) throw new Error('Token invalid');

  return markets;
};

async function administeredTraders(parent, args, context, info) {
  const TraderCards = context.db.collection('traderCards');
  const _id = ObjectId(getTraderAdminId(context));
  const cursor = await TraderCards.find({ admins: ObjectId(_id) });
  const traderCards = cursor.toArray();
  if (!traderCards) throw new Error('Token invalid');

  return traderCards;
};

async function marketsList(parent, args, context, info) {
  const Markets = context.db.collection('markets');
  const cursor = await Markets.find({});
  const markets = cursor.toArray();
  if (!markets) throw new Error('Error; No Markets Found');

  return markets;
};

async function marketDetails(parent, args, context, info) {
  const Markets = context.db.collection('markets');
  const _id = ObjectId(args.marketId);
  const market = await Markets.findOne({ _id });
  if (!market) throw new Error('Error; No Market Found');

  return market;
};

async function traderCardDetails(parent, args, context, info) {
  const TraderCards = context.db.collection('traderCards');
  const _id = ObjectId(args.traderCardId);
  const traderCard = TraderCards.findOne({ _id });
  if (!traderCard) throw new Error('Error; No Trader Card Found');

  return traderCard;
};

module.exports = {
  customerData,
  marketAdminData,
  traderAdminData,
  administeredMarkets,
  administeredTraders,
  marketsList,
  marketDetails,
  traderCardDetails,
};