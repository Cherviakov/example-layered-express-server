const { logDecorator, GETHelper } = require('^layers/domain/utilities');
const { ItemRepository } = require('^layers/dataAccess/repositories');

class ItemService {
  async getItems (headers, queryParams) {
    const GetHelper = new GETHelper(headers, queryParams);
    const { query, projection, options } = GetHelper.parse();
    return ItemRepository.find(query, projection, params);
  }

  async setItem (label, userId) {
    return ItemRepository.insertOne({
      label,
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: new Date,
      updatedBy: new Date,
    });
  }
  
  async deleteItem (itemId) {
    return ItemRepository.deleteOne({ _id: itemId }); 
  }
}

module.exports = logDecorator(ItemService);
