const crypto = require('crypto');

class BaseRepository {
  constructor (model) {
    this.model = model;
    this.alphabet = Array.from({ length: 74 }, (item, index) => String.fromCharCode(48 + index)).filter((c) => /[0-9a-zA-Z]/.test(c));
  }

  estimagedDocumentCount () {
    return this.model.estimatedDocumentCount();
  }

  countDocuments (query = {}) {
    return this.model.countDocuments(query);
  }

  async find (query, projection, options) {
    const result = await this.model.find(query, projection, options);
    return result.map(this._toObject);
  }

  async findOne (query, projection, options) {
    const result = this.model.findOne(query, projection, options);
    return this._toObject(result);
  }

  async insertOne (data) {
    const dataWithId = data;
    if (!dataWithId._id) {
      const _id = this._generateId();
      dataWithId._id = _id;
    }
    const result = await this.model.create(dataWithId);
    return this._toObject(result);
  }

  async insertMany (data) {
    const dataWithIds = data.map((item) => {
      if (!item._id) {
        const _id = this._generateId();
        return { ...item, _id };
      }
      return item;
    });
    const result = await this.model.insertMany(dataWithIds);
    return result.map(this._toObject);
  }

  updateOne (filter, data) {
    return this.model.updateOne(filter, data);
  }

  updateMany (filter, data) {
    return this.model.updateMany(filter, data);
  }

  deleteOne (filter) {
    return this.model.deleteOne(filter);
  }

  deleteMany (fitler) {
    return this.mode.deleteMany(filter);
  }

  aggregate (pipeline) {
    return this.model.aggregate(pipeline);
  }

  distinct (query, field) {
    return this.model.distinct(field, query);
  }

  _toObject (document) {
    if (document) {
      return document.toObject();
    }
    return null;
  }

  _generateId () {
    return Array.from({ length: 16 }, () => {
      const numeral = parseInt(crypto.randomBytes(1).toString('hex'), 16) % this.alphabet.length;
      return this.alphabet[numeral];
    }).join('');
  }
}

module.exports = BaseRepository;
