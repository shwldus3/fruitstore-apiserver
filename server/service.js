'use strict';

const errors = require('restify-errors');
const model = require('./model');

const Exchange = require('./vo/Exchange');
const Goods = require('./vo/Goods');
const Sale = require('./vo/Sale');
const Stats = require('./vo/Stats');
const Stock = require('./vo/Stock');
const Wholesaler = require('./vo/Wholesaler');
const Warehousing = require('./vo/Warehousing');

exports.getStocksSummary = async () => {
  const stockData = (await model.getStocks()).rows;
  return Stock.renderSummaryRows(stockData);
};

exports.getStatsOfSales = async (options) => {
  const {from, to} = options;
  if (!from || !to) throw new errors.InvalidArgumentError(JSON.stringify({from, to}));

  const statsData = (await model.getStatsOfSales({from, to})).rows;
  return Stats.renderSaleRows(statsData);
};

exports.createGoods = async (options) => {
  const {goods_code, goods_name} = options;
  if (!goods_code || !goods_name) throw new errors.InvalidArgumentError(JSON.stringify(goods_code, goods_name));
  if (/:/g.test(goods_code)) throw new errors.InvalidArgumentError(JSON.stringify(goods_code));

  const goodsData = (await model.getGoods({goods_code})).rows[0];
  const goodsInfo = Goods.renderRow(goodsData);

  if (goodsInfo.isAlready(goods_code)) throw new errors.BadRequestError('Already existed');

  const newGoodsData = (await model.insertGoods({goods_code, goods_name})).rows[0];
  return Goods.renderRow(newGoodsData);
};

exports.createWholesaler = async (options) => {
  const {wholesaler_code, wholesaler_name} = options;
  if (!wholesaler_code || !wholesaler_name) throw new errors.InvalidArgumentError(JSON.stringify(wholesaler_code, wholesaler_name));
  if (/:/g.test(wholesaler_code)) throw new errors.InvalidArgumentError(JSON.stringify(wholesaler_code));

  const wsData = (await model.getWholesaler({wholesaler_code})).rows[0];
  const wsInfo = Wholesaler.renderRow(wsData);

  if (wsInfo.isAlready(wholesaler_code)) throw new errors.BadRequestError('Already existed');

  const newWsData = (await model.insertWholesaler({wholesaler_code, wholesaler_name})).rows[0];
  return Wholesaler.renderRow(newWsData);
};

exports.createStocks = async (options) => {
  const {wholesaler_code, goods_code, quantity} = options;
  if (!wholesaler_code || !goods_code) throw new errors.InvalidArgumentError(JSON.stringify(wholesaler_code, goods_code));

  const stock_code = `${goods_code}:${wholesaler_code}`;

  const goodsData = (await model.getGoods({goods_code})).rows[0];
  const goodsInfo = Goods.renderRow(goodsData);

  if (!goodsInfo.isAlready(goods_code)) throw new errors.BadRequestError('Register products first');

  const newStockData = (await model.upsertStock({stock_code, wholesaler_code, goods_code, quantity})).rows[0];
  const newWarehousingData = (await model.insertWarehousing({stock_code, quantity})).rows;

  return Stock.renderRow(newStockData)
    .setWarehousings(Warehousing.renderRows(newWarehousingData));
};

exports.createSales = async (options) => {
  const {stock_code, quantity, price} = options;
  if (!stock_code || !quantity || !price) throw new errors.InvalidArgumentError(JSON.stringify(stock_code, quantity, price));

  const stockData = (await model.getStock({stock_code})).rows[0];
  const stockInfo = Stock.renderRow(stockData);

  if (!stockInfo.isAlready(stock_code) || !stockInfo.canSale(quantity)) throw new errors.BadRequestError('No stock');

  const updateStockData = (await model.updateStockForSale({stock_code, quantity})).rows[0];
  const newSaleData = (await model.insertSale({stock_code, quantity, price})).rows;

  return Stock.renderRow(updateStockData)
    .setSales(Sale.renderRows(newSaleData));
};

exports.createExchange = async (options) => {
  const {sale_id, quantity} = options;
  if (!sale_id || !quantity) throw new errors.InvalidArgumentError(JSON.stringify(sale_id, quantity));

  const stockSaleData = (await model.getStockSale({sale_id})).rows[0];
  const stockInfo = Stock.renderRow(stockSaleData);
  const saleInfo = Sale.renderRow(stockSaleData);

  if (!stockInfo.isExist()) throw new errors.BadRequestError('This item does not exist');
  if (!saleInfo.isAlready(sale_id)) throw new errors.BadRequestError('Not in sales history');
  if (!saleInfo.canExchange(quantity)) throw new errors.BadRequestError('You can exchange only within the quantity you have purchased');

  const updateStockData = (await model.updateStockForExchange({quantity, stock_code: stockSaleData.stock_code})).rows[0];
  const newExchangeData = (await model.insertExchange({sale_id, quantity})).rows;

  return Stock.renderRow(updateStockData)
    .setSales([saleInfo.setExchanges(Exchange.renderRows(newExchangeData))]);
};