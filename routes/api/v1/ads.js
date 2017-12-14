const express = require('express');
const router = express.Router();
const { check, query, validationResult } = require('express-validator/check');
const Ad = require('../../../models/Ad');

/**
 * GET /
 * Returns ad list.
 * Query string:
 *  - tag
 *  - for_sale: false | true
 *  - price: 0-50 | 10- | -50 | 50
 *  - name: Regex /^name/i
 *  - page
 *  - per_page
 */
router.get('/', [
  query('tags').optional(),
  query('for_sale').optional().isBoolean().withMessage('FOR_SALE_MUST_BE_BOOLEAN'),
  query('price').optional().matches(/^(\d+(\.\d+)?|-\d+(\.\d+)?|\d+(\.\d+)?-|\d+(\.\d+)?-\d+(\.\d+)?)$/).withMessage('PRICE_RANGE_NOT_VALID'),
  query('page').isNumeric().withMessage('PAGE_MUST_BE_NUMERIC'),
  query('per_page').optional().isNumeric().withMessage('PER_PAGE_MUST_BE_NUMERIC')
], async (req, res, next) => {
  try {
    validationResult(req).throw();

    const filter = {
      name: req.query.name,
      tags: req.query.tags,
      forSale: req.query.for_sale,
      price: req.query.price
    };
    
    const page = parseInt( req.query.page );
    const per_page = parseInt( req.query.per_page );
    
    const sort = req.query.sort;
    const fields = req.query.fields;

    const result = await Ad.list(filter, page, per_page, sort, fields);
    res.json({ success: true, total: result.total, result: result.rows });
  } catch (err) {
      next(err);
  }
});

/**
 * GET /tags
 * Returns tag list
 */ 
router.get('/tags', (req, res, next) => {
  const tags = Ad.getTags();
  res.json(tags);
});


module.exports = router;