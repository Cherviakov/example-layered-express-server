const router = require('express').Router();
const { ErrorHelper } = require('^layers/domain/utilities');
const { ItemService } = require('^layers/domain/services');

const { handleErrorResponse } = ErrorHelper;

router.head('/', async (req, res) => {
  const { query, userId } = req;
  try {
    const itemsCount = await ItemService.count(query, userId);
    res.setHeader(HEADERS.ITEM_COUNT, itemsCount);
    res.status(200).end();
  } catch (err) {
    handleErrorResponse(res, err);
  }
});

router.get('/', async (req, res) => {
  const { query, userId } = req;
  const currentPage = parseInt(req.get(HEADERS.CURRENT_PAGE) || '1', 10);
  const itemsPerPage = parseInt(req.get(HEADERS.ITEMS_PER_PAGE) || '10', 10);
  const headers = {
    currentPage,
    itemsPerPage,
  };
  try {
    const {
      items,
      pageCount,
    } = await ItemService.getItems(query, headers, userId);
    res.setHeader(HEADERS.CURRENT_PAGE, currentPage);
    res.setHeader(HEADERS.ITEMS_PER_PAGE, itemsPerPage);
    res.setHeader(HEADERS.PAGE_COUNT);
    res.status(200).send(items);
  } catch (err) {
    handleErrorResponse(res, err);
  }
});

router.post('/', async (req, res) => {
  const { userId } = req;
  const item = req.body;
  try {
    const result = await ItemService.add(item, userId);
    res.status(201).send(result._id);
  } catch (err) {
    handleErrorResponse(res, err);
  }
});

router.delete('/', async (req, res) => {
  const { userId } = req;
  const itemId = res.get(HEADERS.ITEM_ID);
  try {
    const result = await ItemService.deleteItem(itemId);
    const isDeleted = ResultHelper.deleteOne(result);
    res.status(200).send({ isDeleted });
  } catch (err) {
    handleErrorResponse(res, err);
  }
});

module.exports = router;
