const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { getCustomerId, getMarketAdminId, getTraderAdminId } = require('../utils');
const { APP_SECRET } = require('../secrets');


async function customerRegister(parent, args, context, info) {
  const Customers = context.db.collection('customers');
  const password = await bcrypt.hash(args.password, 12);
  const testCustomer =  await Customers.findOne({ email: args.email });
  if (testCustomer) {
    throw new Error("An account already exists for this email address");
  };
  
  const rtnDoc = await Customers.insertOne({
    email: args.email,
    firstName: args.firstName,
    lastName: args.lastName,
    password,
    shoppingCarts: [],
  });
  
  const id = rtnDoc.insertedId
  const customer = await Customers.findOne({ _id: id });
  const token = jwt.sign({ customerId: id }, APP_SECRET);
  
  return {
    token,
    customer,
  };
};

async function customerLogin(parent, args, context, info) {
  const Customers = context.db.collection('customers');
  const customer = await Customers.findOne({ email: args.email });
  if (!customer) throw new Error('Email or Password details are invalid');
  
  const valid = await bcrypt.compare(args.password, customer.password);
  if (!valid) throw new Error('Email or Password details are invalid');

  const token = jwt.sign({ customerId: customer._id }, APP_SECRET);
  
  return {
    token,
    customer,
  };
};

async function customerUpdate(parent, args, context, info) {
  const Customers = context.db.collection('customers');
  const _id = ObjectId(getCustomerId(context));
  const customerAuth = await Customers.findOne({ _id });
  if (!customerAuth) throw new Error('Token invalid');

  const valid = await bcrypt.compare(args.password, customerAuth.password);
  if (!valid) throw new Error('Invalid password');

  const password = args.newPassword ? await bcrypt.hash(args.newPassword, 12) : customerAuth.password; 
  const { email, firstName, lastName } = args;
  const newDetails = { password };
  if (email) newDetails.email = email;
  if (firstName) newDetails.firstName = firstName;
  if (lastName) newDetails.lastName = lastName;
  Customers.updateOne({_id }, {$set: newDetails});
  
  return Customers.findOne({ _id });
};

async function marketAdminRegister(parent, args, context, info) {
  const MarketAdmins = context.db.collection('marketAdmins');
  const password = await bcrypt.hash(args.password, 12);
  const testMarketAdmin =  await MarketAdmins.findOne({ email: args.email });
  if (testMarketAdmin) {
    throw new Error("An account already exists for this email address");
  };
  
  const rtnDoc = await MarketAdmins.insertOne({
    email: args.email,
    firstName: args.firstName,
    lastName: args.lastName,
    password,
  });
  
  const id = rtnDoc.insertedId
  const marketAdmin = await MarketAdmins.findOne({ _id: id });
  const token = jwt.sign({ marketAdminId: id }, APP_SECRET);
  
  return {
    token,
    marketAdmin,
  };
};

module.exports = {
  customerRegister,
  customerLogin,
  customerUpdate,
  marketAdminRegister,
};