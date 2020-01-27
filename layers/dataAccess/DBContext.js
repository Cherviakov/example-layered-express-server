const mongoose = require('mongoose');
const { MONGO_URL, NODE_ENV } = process.env;

const isTest = NODE_ENV === 'test';

class DbContext {
  constructor() {
    this._isConnected = false;
    this._connection = null;
  }

  connect(URL) {
    if (!this._isConnected) {
      mongoose.Promise = global.Promise;
      this._connection = mongoose.connection;
      return mongoose
        .connect(isTest ? URL : MONGO_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          autoIndex: false,
        })
    }
  }

  getConnection() {
    return new Promise((resolve) => {
      const connectionState = this._connection._readyState;
      if (connectionState === this._connection.states.connected) {
        resolve(this._connection);
      } else {
        this._connection.on('connected', () => {
          resolve(this._connection);
        });
      }
    });
  }
}

module.exports = new DbContext();
