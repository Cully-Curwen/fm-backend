const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

  const token = jwt.sign({ customerId: customer.id }, APP_SECRET);

  return {
    token,
    customer,
  };
};

module.exports = {
  customerRegister,
  customerLogin,
};