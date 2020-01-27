const isSafe = require('safe-regex');

const defaultIgnoreFields = [
  'sort',
  'projection',
  'search',
  'searchName',
  'searchKey',
  'searchByNameOrKey',
];
const dateFields = ['createdAt', 'updatedAt'];
const dateRangeFields = ['lastUpdatedAt'];
const numberFields = ['amount'];
const booleanFields = ['isArchived'];
const regexFields = ['userName'];

class GETHelperMongo {
  constructor(headers = { currentPage: 1, itemsPerPage: 10 }, queryParams = {}) {
    this.headers = headers;
    this.queryParams = queryParams;
    this.dbQuery = {};
    this.dbRegexQuery = {};
    this.dbProjection = {};
    this.dbOptions = {};
    this.ignoreFields = defaultIgnoreFields;
  }

  addQuery(query = {}) {
    this.dbQuery = { ...this.dbQuery, ...query };
  }

  addQueryArrayField(field = '', value = []) {
    this.dbQuery[field] = {
      $in: value,
    };
  }

  addRegexField(field = '', $options = 'i') {
    this.dbRegexQuery[field] = {
      $regex: this.queryParams[field],
      $options,
    };
  }

  addProjection(projection = {}) {
    this.dbProjection = { ...this.dbProjection, ...projection };
  }

  addOptions(options = {}) {
    this.dbOptions = { ...this.dbOptions, ...options };
  }

  addSpecialParams(params = []) {
    this.specialParams = this.specialParams.concat(params);
  }

  async countMetaInfo(result, collection) {
    const resultCount = await collection.countDocuments(this.dbQuery);
    return {
      resultCount: Array.isArray(result) ? result.length : result,
      currentPage: parseInt(this.headers.currentPage || 1, 10),
      pageCount: this.dbOptions.limit
        ? Math.ceil(resultCount / this.dbOptions.limit)
        : 1,
    };
  }

  parse() {
    this.fieldsParse();
    this.search();
    this.nameSearch();
    this.keySearch();
    this.setProjection();
    this.setItemsPerPage();
    this.setCurrentPage();
    this.setSort();
    return {
      query: this.dbQuery,
      projection: this.dbProjection,
      options: this.dbOptions,
      regexQuery: this.dbRegexQuery,
    };
  }

  fieldsParse() {
    Object.entries(this.queryParams).forEach(([key, value]) => {
      if (regexFields.includes(key)) {
        this.addRegexField(key);
      } else if (!this.ignoreFields.includes(key)) {
        if (dateFields.includes(key)) {
          if (Number.isNaN(new Date(value))) {
            throw new Error(`value for field ${key} is not valid Date`);
          }
          this.dbQuery[key] = { $gte: new Date(value) };
        } else if (dateRangeFields.includes(key)) {
          const [start, end] = (value || '').split(' - ');
          if (Number.isNaN(new Date(start))) {
            throw new Error(`start for field ${key} is not valid Date`);
          }
          if (Number.isNaN(new Date(end))) {
            throw new Error(`end for field ${key} is not valid Date`);
          }
          this.dbQuery[key] = {
            $gte: new Date(start),
            $lt: new Date(end),
          };
        } else if (numberFields.includes(key)) {
          const parsedValue = parseFloat(value);
          this.dbQuery[key] = !Number.isNaN(parsedValue) ? parsedValue : 0;
        } else if (booleanFields.includes(key)) {
          if (!['true', 'false'].includes(value)) {
            throw new Error(`boolean field ${key} can only have values true or false`);
          }
          this.dbQuery[key] = value === 'true';
        } else {
          this.dbQuery[key] = value;
        }
      }
    });
  }

  search() {
    if (this.queryParams.searchByNameOrKey) {
      const testRegex = new RegExp(this.queryParams.searchByNameOrKey);
      if (!isSafe(testRegex)) {
        throw ErrorHelper.makeValidationError('not safe regex expression');
      }
      this.dbQuery['$or'] = [
        {
          name: {
            $regex: this.queryParams.searchByNameOrKey,
            $options: 'gi',
          },
        },
        {
          key: {
            $regex: this.queryParams.searchByNameOrKey,
            $options: 'gi',
          },
        },
      ];
    }
  }

  nameSearch() {
    if (this.queryParams.searchName) {
      const testRegex = new RegExp(this.queryParams.searchName);
      if (!isSafe(testRegex)) {
        throw ErrorHelper.makeValidationError('not safe regex expression');
      }
      this.dbQuery = {
        ...this.dbQuery,
        name: {
          $regex: this.queryParams.searchName,
          $options: 'gi',
        },
      };
    }
  }

  keySearch(keyField = 'key') {
    if (this.queryParams.searchKey) {
      const testRegex = new RegExp(this.queryParams.searchKey);
      if (!isSafe(testRegex)) {
        throw ErrorHelper.makeValidationError('not safe regex expression');
      }
      this.dbQuery[keyField] = {
        $regex: this.queryParams.searchKey,
        $options: 'gi',
      };
    }
  }

  setProjection() {
    if (this.queryParams.projection) {
      this.dbProjection = JSON.parse(this.queryParams.projection);
    }
  }

  setItemsPerPage() {
    const itemsPerPage = parseInt(this.headers.itemsPerPage, 10);
    if (itemsPerPage > 0) {
      this.dbOptions = {
        ...this.dbOptions,
        limit: itemsPerPage,
      };
    } else {
      this.dbOptions = {
        ...this.dbOptions,
        limit: 10,
      };
    }
  }

  setCurrentPage() {
    const currentPage = parseInt(this.headers.currentPage, 10);
    if (currentPage > 0) {
      const skip = (currentPage - 1) * this.dbOptions.limit;
      this.dbOptions = {
        ...this.dbOptions,
        skip,
      };
    } else {
      this.dbOptions = {
        ...this.dbOptions,
        skip: 0,
      };
    }
  }

  setSort() {
    if (this.queryParams.sort) {
      this.dbOptions = {
        ...this.dbOptions,
        sort: JSON.parse(this.queryParams.sort),
      };
    }
  }
}
