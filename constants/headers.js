const xName = (process.env.HEADERS_X_NAME || 'my-app').toUpperCase();

const HEADERS = [
  'ITEM_ID',
  'PONG',
].reduce((result, key) => {
  const updatedResult = { ...result };
  const value = `X-${xName}-${key.replace(/_/g, '-')}`;
  updatedResult[key] = value;
  return updatedResult;
}, {});

module.exports = HEADERS;
