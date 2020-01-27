const BaseRepository = require('../BaseRepository');
const Item = require('../models/Item');

class ItemRepository extends BaseRepository {
  constructor () {
    super(Item);
  }
}

module.exports = new ItemRepository;
