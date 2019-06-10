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
  
  const _id = rtnDoc.insertedId
  const customer = await Customers.findOne({ _id });
  const token = jwt.sign({ customerId: _id }, APP_SECRET);
  
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
  
  return await Customers.findOne({ _id });
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
  
  const _id = rtnDoc.insertedId
  const marketAdmin = await MarketAdmins.findOne({ _id });
  const token = jwt.sign({ marketAdminId: _id }, APP_SECRET);
  
  return {
    token,
    marketAdmin,
  };
};

async function marketAdminLogin(parent, args, context, info) {
  const MarketAdmins = context.db.collection('marketAdmins');
  const marketAdmin = await MarketAdmins.findOne({ email: args.email });
  if (!marketAdmin) throw new Error('Email or Password details are invalid');
  
  const valid = await bcrypt.compare(args.password, marketAdmin.password);
  if (!valid) throw new Error('Email or Password details are invalid');

  const token = jwt.sign({ marketAdminId: marketAdmin._id }, APP_SECRET);
  
  return {
    token,
    marketAdmin,
  };
};

async function marketAdminUpdate(parent, args, context, info) {
  const MarketAdmins = context.db.collection('marketAdmins');
  const _id = ObjectId(getMarketAdminId(context));
  const marketAdminAuth = await MarketAdmins.findOne({ _id });
  if (!marketAdminAuth) throw new Error('Token invalid');

  const valid = await bcrypt.compare(args.password, marketAdminAuth.password);
  if (!valid) throw new Error('Invalid password');

  const password = args.newPassword ? await bcrypt.hash(args.newPassword, 12) : marketAdminAuth.password; 
  const { email, firstName, lastName } = args;
  const newDetails = { password };
  if (email) newDetails.email = email;
  if (firstName) newDetails.firstName = firstName;
  if (lastName) newDetails.lastName = lastName;
  MarketAdmins.updateOne({_id }, {$set: newDetails});
  
  return await MarketAdmins.findOne({ _id });
};

async function traderAdminRegister(parent, args, context, info) {
  const TraderAdmins = context.db.collection('traderAdmins');
  const password = await bcrypt.hash(args.password, 12);
  const testTraderAdmin =  await TraderAdmins.findOne({ email: args.email });
  if (testTraderAdmin) {
    throw new Error("An account already exists for this email address");
  };
  
  const rtnDoc = await TraderAdmins.insertOne({
    email: args.email,
    firstName: args.firstName,
    lastName: args.lastName,
    password,
  });
  
  const _id = rtnDoc.insertedId
  const traderAdmin = await TraderAdmins.findOne({ _id });
  const token = jwt.sign({ traderAdminId: _id }, APP_SECRET);
  
  return {
    token,
    traderAdmin,
  };
};

async function traderAdminLogin(parent, args, context, info) {
  const TraderAdmins = context.db.collection('traderAdmins');
  const traderAdmin = await TraderAdmins.findOne({ email: args.email });
  if (!traderAdmin) throw new Error('Email or Password details are invalid');
  
  const valid = await bcrypt.compare(args.password, traderAdmin.password);
  if (!valid) throw new Error('Email or Password details are invalid');
  
  const token = jwt.sign({ traderAdminId: traderAdmin._id }, APP_SECRET);
  
  return {
    token,
    traderAdmin,
  };
};

async function traderAdminUpdate(parent, args, context, info) {
  const TraderAdmins = context.db.collection('traderAdmins');
  const _id = ObjectId(getTraderAdminId(context));
  const traderAdminAuth = await TraderAdmins.findOne({ _id });
  if (!traderAdminAuth) throw new Error('Token invalid');

  const valid = await bcrypt.compare(args.password, traderAdminAuth.password);
  if (!valid) throw new Error('Invalid password');

  const password = args.newPassword ? await bcrypt.hash(args.newPassword, 12) : traderAdminAuth.password; 
  const { email, firstName, lastName } = args;
  const newDetails = { password };
  if (email) newDetails.email = email;
  if (firstName) newDetails.firstName = firstName;
  if (lastName) newDetails.lastName = lastName;
  TraderAdmins.updateOne({_id }, {$set: newDetails});
  
  return await TraderAdmins.findOne({ _id });
};

async function marketCreate(parent, args, context, info) {
  const Markets = context.db.collection('markets');
  const admin = ObjectId(getMarketAdminId(context));

  const rtnDoc = await Markets.insertOne(
    {
      admins: [admin], 
      ...args, 
      traders: [], 
      traderApplicants: [],
    }
  );
  const _id = rtnDoc.insertedId;

  return await Markets.findOne({ _id });
};

async function marketUpdate(parent, args, context, info) {
  const Markets = context.db.collection('markets');
  const admin = ObjectId(getMarketAdminId(context));
  const _id = ObjectId(args.id);
  
  const newDetails = {};
  const { name, blurb, address, geoLocation, directions, imgUrl, openHours } = args;
  if (name) newDetails.name = name;
  if (blurb) newDetails.blurb = blurb;
  if (address) newDetails.address = address;
  if (geoLocation) newDetails.geoLocation = geoLocation;
  if (directions) newDetails.directions = directions;
  if (imgUrl) newDetails.imgUrl = imgUrl;
  if (openHours) newDetails.openHours = openHours;
  // May need to change, as will not be able to pass null or empty strings.
  // What if you need to make a field blank?
  
  const rtnDoc = await Markets.findOneAndUpdate(
    { _id , admins: admin }, 
    { $set: newDetails }, 
    { returnOriginal: false }
  );
  const market = rtnDoc.value;
  
  if (market) {
    return market;
  } else throw new Error('Update failed; you do not have admin rights for this task');
};

async function marketAddTraderTo(parent, args, context, info) {
  const Markets = context.db.collection('markets');
  const admin = ObjectId(getMarketAdminId(context));
  const _id = ObjectId(args.id);

  const checkDB = await Markets.findOne(
    { _id, admins: admin, traders: ObjectId(args.traderCardId) }
  );
  if (checkDB) throw new Error('Operation Failed; Trader is allready associated')

  const rtnDoc = await Markets.findOneAndUpdate(
    { _id, admins: admin },
    { $push: { traders: ObjectId(args.traderCardId) } }, 
    { returnOriginal: false }
  );
  const market = rtnDoc.value;
  
  if (market) {
    return market;
  } else throw new Error('Operation failed;');
};

async function marketRemoveTraderFrom(parent, args, context, info) {
  const Markets = context.db.collection('markets');
  const admin = ObjectId(getMarketAdminId(context));
  const _id = ObjectId(args.id);

  const rtnDoc = await Markets.findOneAndUpdate(
    { _id, admins: admin },
    { $pull: { traders: ObjectId(args.traderCardId) } }, 
    { returnOriginal: false }
  );
  const market = rtnDoc.value;
  
  if (market) {
    return market;
  } else throw new Error('UOperation failed;');
};
  
async function traderCardCreate(parent, args, context, info) {
  const TraderCards = context.db.collection('traderCards');
  const admin = ObjectId(getTraderAdminId(context));
  
  const rtnDoc = await TraderCards.insertOne({ admins: [admin], ...args });
  const _id = rtnDoc.insertedId;

  return await TraderCards.findOne({ _id });
};

async function traderCardUpdate(parent, args, context, info) {
  const TraderCards = context.db.collection('traderCards');
  const admin = ObjectId(getTraderAdminId(context));
  const _id = ObjectId(args.id);

  const newDetails = {};
  const { name, blurb, imgUrl, links, produceTags } = args;
  if (name) newDetails.name = name;
  if (blurb) newDetails.blurb = blurb;
  if (imgUrl) newDetails.imgUrl = imgUrl;
  if (links) newDetails.links = links;
  if (produceTags) newDetails.produceTags = produceTags;
  // May need to change, as will not be able to pass null or empty strings.
  // What if you need to make a field blank?
  
  const rtnDoc = await TraderCards.findOneAndUpdate(
    { _id , admins: admin}, 
    { $set: newDetails }, 
    { returnOriginal: false }
  );
  const traderCard = rtnDoc.value;
  
  if (traderCard) {
    return traderCard;
  } else throw new Error('Update failed; you do not have admin rights for this task');
};

async function itemCreate(parent, args, context, info) {
  const Items = context.db.collection('items');
  const admin = ObjectId(getTraderAdminId(context));
  const traderCardId = ObjectId(args.traderCardId);

  const rtnDoc = await Items.insertOne({ ...args, traderCardId });
  const _id = rtnDoc.insertedId;

  return await Items.findOne({ _id});
};

async function itemUpdate(parent, args, context, info) {
  const Items = context.db.collection('items');
  const admin = ObjectId(getTraderAdminId(context));
  const _id = ObjectId(args.id);

  const { name, description, stock, price } = args;
  const rtnDoc = await Items.findOneAndUpdate(
    { _id }, 
    {
      $set: {
        name,
        description,
        stock,
        price,
      }
    }, 
    { returnOriginal: false }
  );
  const item = rtnDoc.value;
  
  if (item) {
    return item;
  } else throw new Error('Update failed; Item could not be found');
};

async function cartAddItem(parent, args, context, info) {
  const Customers = context.db.collection('customers');
  const _id = ObjectId(getCustomerId(context));
  const customerAuth = await Customers.findOne({ _id });
  if (!customerAuth) throw new Error('Token invalid');

  const { traderCardId, itemId, name, description, price, quantity } = args.item
  const newItem = {
    traderCardId: ObjectId(traderCardId),
    itemId: ObjectId(itemId),
    name,
    description,
    price,
    quantity,
  };

  // Will increment the existing Item in existing MarketCart
  const rtnDoc = await Customers.findOneAndUpdate(
    { 
      _id, 
      "shoppingCarts.marketId": ObjectId(args.marketId), 
      "shoppingCarts.items.itemId": ObjectId(itemId) 
    },
    { $inc: { "shoppingCarts.$[marketCart].items.$[item].quantity": 1 } },
    {
      arrayFilters: [
        {"marketCart.marketId": ObjectId(args.marketId)},
        {"item.itemId": ObjectId(itemId)}
      ],
      returnOriginal: false
    }
  );
  
  if (rtnDoc.value) {
    return rtnDoc.value;
  } else {
    // Will find existing MarketCart, but not Item and push in the Item
    const rtnDoc2 = await Customers.findOneAndUpdate(
      { _id, "shoppingCarts.marketId": ObjectId(args.marketId) },
      { $push: { "shoppingCarts.$[market].items": newItem } },
      {
        arrayFilters: [{"market.marketId": ObjectId(args.marketId) }],
        returnOriginal: false
      }
    );

    if (rtnDoc2.value) {
      return rtnDoc2.value;
    } else {
      // will create a new MarketCart and insert Item
      const rtnDoc3 = await Customers.findOneAndUpdate(
        { _id },
        { $push: { shoppingCarts: { marketId: ObjectId(args.marketId), items: [newItem] } } },
        { returnOriginal: false }
      );
      if (rtnDoc3.value) {
        return rtnDoc3.value;
      } else throw new Error('Update failed; Item could not be found');
    };
  };
};

async function cartUpdateItem(parent, args, context, info) {
  const Customers = context.db.collection('customers');
  const _id = ObjectId(getCustomerId(context));
  const customerAuth = await Customers.findOne({ _id });
  if (!customerAuth) throw new Error('Token invalid');

  const { traderCardId, itemId, name, description, price, quantity } = args.item
  if (quantity === 0) return cartRemoveItem(parent, args, context, info);
  
  const rtnDoc = await Customers.findOneAndUpdate(
    { 
      _id, 
      "shoppingCarts.marketId": ObjectId(args.marketId), 
      "shoppingCarts.items.itemId": ObjectId(itemId) 
    },
    { $set: { "shoppingCarts.$[marketCart].items.$[item].quantity": quantity } },
    {
      arrayFilters: [
        {"marketCart.marketId": ObjectId(args.marketId)},
        {"item.itemId": ObjectId(itemId)}
      ],
      returnOriginal: false
    }
  );
  if (rtnDoc.value) {
    return rtnDoc.value;
  } else throw new Error('Update failed; Item could not be found');
};

async function cartRemoveItem(parent, args, context, info) {
  const Customers = context.db.collection('customers');
  const _id = ObjectId(getCustomerId(context));
  const customerAuth = await Customers.findOne({ _id });
  if (!customerAuth) throw new Error('Token invalid');

  const { traderCardId, itemId, name, description, price, quantity } = args.item
  
  const rtnDoc = await Customers.findOneAndUpdate(
    { 
      _id, 
      "shoppingCarts.marketId": ObjectId(args.marketId), 
      "shoppingCarts.items.itemId": ObjectId(itemId) 
    },
    { $pull: { "shoppingCarts.$[marketCart].items": { itemId: ObjectId(itemId) } } },
    {
      arrayFilters: [ {"marketCart.marketId": ObjectId(args.marketId)}, ],
      returnOriginal: false
    }
  );
  if (rtnDoc.value) {
    return rtnDoc.value;
  } else throw new Error('Update failed; Item could not be found');
};

module.exports = {
  customerRegister,
  customerLogin,
  customerUpdate,
  marketAdminRegister,
  marketAdminLogin,
  marketAdminUpdate,
  marketAddTraderTo,
  marketRemoveTraderFrom,
  traderAdminRegister,
  traderAdminLogin,
  traderAdminUpdate,
  marketCreate,
  marketUpdate,
  traderCardCreate,
  traderCardUpdate,
  itemCreate,
  itemUpdate,
  cartAddItem,
  cartUpdateItem,
  cartRemoveItem,
};