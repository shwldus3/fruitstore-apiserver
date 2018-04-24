'use strict';

const {Pool} = require('pg');
const errors = require('restify-errors');
const gConfig = global.config;
const pool = new Pool(gConfig.db);

const execDB = async (sql, values = []) => {
  try {
    const client = await pool.connect();
    const result = await client.query(sql, values);
    await client.release();
    return {rowCount: result.rowCount, rows: result.rows};
  } catch (err) {
    throw new errors.InternalServerError(err);
  }
};

const _makeCreateQueryParams = ({data, paramQuery = '', valueQuery = '', values = []}, required) => {
  if (!required || !Array.isArray(required)) throw new errors.InternalError('Invalid data');
  if (!data) throw new errors.InternalError('Invalid value');

  required.forEach((p, i) => {
    const keys = p.split(':');
    const dataKey = keys[0];
    const column = keys.length > 1 ? keys[1] : dataKey;

    if (data[dataKey]) {
      values.push(data[dataKey]);
      paramQuery += (i ? ',' : '') + column;
      valueQuery += (i ? ',' : '') + `$${values.length}`;
    }
  });

  return {paramQuery, valueQuery, values};
};

const _makeWhereCondition = (data, required) => {
  if (!required || !Array.isArray(required)) throw new errors.InternalError('Invalid data');
  let whereQuery = '';
  const values = [];

  required.forEach((p) => {
    let col = p.split('.');
    col = col[col.length - 1];

    if (data[col]) {
      values.push(data[col]);
      whereQuery += ` ${values.length - 1 ? 'AND' : 'WHERE'} ${p}=$${values.length}`;
    }
  });

  return {whereQuery, values};
};

exports.insertGoods = (options) => {
  const required = ['goods_name', 'goods_code'];
  const {paramQuery, valueQuery, values} = _makeCreateQueryParams({data: options}, required);
  const sql = `INSERT INTO goods (${paramQuery}) VALUES (${valueQuery}) RETURNING *`;

  return execDB(sql, values);
};

exports.getGoods = (options) => {
  const required = ['gd.goods_code'];
  const {whereQuery, values} = _makeWhereCondition(options, required);
  const sql = `SELECT * FROM goods AS gd ${whereQuery}`;

  return execDB(sql, values)
};

exports.insertWholesaler = (options) => {
  const required = ['wholesaler_name', 'wholesaler_code'];
  const {paramQuery, valueQuery, values} = _makeCreateQueryParams({data: options}, required);
  const sql = `INSERT INTO wholesaler (${paramQuery}) VALUES (${valueQuery}) RETURNING *`;

  return execDB(sql, values);
};

exports.getWholesaler = (options) => {
  const required = ['ws.wholesaler_code'];
  const {whereQuery, values} = _makeWhereCondition(options, required);
  const sql = `SELECT * FROM wholesaler AS ws ${whereQuery}`;

  return execDB(sql, values)
};

exports.getStocks = () => {
  const sql = 'SELECT goods_code, SUM(good_quantity) AS good_quantity, SUM(bad_quantity) AS bad_quantity'
    + ' FROM stock AS st GROUP BY st.goods_code';

  return execDB(sql)
};

exports.upsertStock = (options) => {
  const required = ['stock_code', 'wholesaler_code', 'goods_code', 'quantity:good_quantity'];
  const {paramQuery, valueQuery, values} = _makeCreateQueryParams({data: options}, required);
  const sql = `WITH updated AS 
            (UPDATE stock SET good_quantity=good_quantity+$4 WHERE stock_code=$1 RETURNING *)
            INSERT INTO stock (${paramQuery})
            SELECT ${valueQuery} WHERE NOT EXISTS (SELECT stock_code FROM updated) RETURNING *`;

  return execDB(sql, values)
};

exports.insertWarehousing = (options) => {
  const required = ['stock_code', 'quantity'];
  const {paramQuery, valueQuery, values} = _makeCreateQueryParams({data: options}, required);
  const sql = `INSERT INTO warehousing (${paramQuery}) VALUES (${valueQuery}) RETURNING *`;

  return execDB(sql, values);
};

exports.getStock = (options) => {
  const required = ['st.stock_code'];
  const {whereQuery, values} = _makeWhereCondition(options, required);
  const sql = `SELECT * FROM stock AS st ${whereQuery}`;

  return execDB(sql, values)
};

exports.updateStockForSale = (options) => {
  const {stock_code, quantity} = options;
  const values = [quantity, stock_code];
  const sql = 'UPDATE stock SET good_quantity=good_quantity-$1 WHERE stock_code=$2 RETURNING *';

  return execDB(sql, values)
};

exports.updateStockForExchange= (options) => {
  const {stock_code, quantity} = options;
  const values = [quantity, stock_code];
  const sql = 'UPDATE stock'
    + ' SET good_quantity=good_quantity-$1, bad_quantity=bad_quantity+$1'
    + ' WHERE stock_code=$2 RETURNING *';

  return execDB(sql, values)
};

exports.insertSale = (options) => {
  const required = ['stock_code', 'quantity', 'price'];
  const {paramQuery, valueQuery, values} = _makeCreateQueryParams({data: options}, required);
  const sql = `INSERT INTO sale (${paramQuery}) VALUES (${valueQuery}) RETURNING *`;

  return execDB(sql, values);
};

exports.getStockSale = (options) => {
  const required = ['sl.sale_id'];
  const {whereQuery, values} = _makeWhereCondition(options, required);
  const sql = `SELECT * FROM sale AS sl JOIN stock AS st ON sl.stock_code=st.stock_code ${whereQuery}`;

  return execDB(sql, values)
};

exports.insertExchange = (options) => {
  const required = ['sale_id', 'quantity'];
  const {paramQuery, valueQuery, values} = _makeCreateQueryParams({data: options}, required);
  const sql = `INSERT INTO exchange (${paramQuery}) VALUES (${valueQuery}) RETURNING *`;

  return execDB(sql, values);
};

exports.getStatsOfSales = ({from, to}) => {
  const sql = `SELECT (STRING_TO_ARRAY(sl.stock_code, ':'))[1] AS goods_code
      , SUM(sl.quantity) AS quantity
      , SUM(sl.quantity*sl.price) AS total_price
    FROM sale AS sl
    WHERE sl.created>=$1 AND sl.created<$2 GROUP BY goods_code`;
  const values = [from, to];

  return execDB(sql, values)
};
