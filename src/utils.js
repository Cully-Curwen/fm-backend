const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('./secrets');

function getCustomerId(context) {
  const Authorization = context.request.get('CustomerAuthorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { customerId } = jwt.verify(token, APP_SECRET);
    return customerId;
  };

  throw new Error('Not authenticated');
};

function getMarketAdminId(context) {
  const Authorization = context.request.get('MarketAdminAuthorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { marketAdminId } = jwt.verify(token, APP_SECRET);
    return marketAdminId;
  };

  throw new Error('Not authenticated');
};

function getTraderAdminId(context) {
  const Authorization = context.request.get('TraderAdminAuthorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { traderAdminId } = jwt.verify(token, APP_SECRET);
    return traderAdminId;
  };

  throw new Error('Not authenticated');
};

module.exports = {
  getCustomerId,
  getMarketAdminId,
  getTraderAdminId,
};