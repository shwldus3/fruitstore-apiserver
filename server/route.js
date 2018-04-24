'use strict';

const service = require('./service');

const getParams = (keys, ...args) => {
  const data = {};
  const options = args.reduce((a, b) => {return Object.assign(a, b);}, {});

  keys.forEach((key) => {
    if (!options[key]) return new Error(`Need to send this parameters, ${keys}`);

    data[key] = options[key];
  });

  return data;
};

const getStocks = async (req, res, next) => {
  try {
    res.send(await service.getStocksSummary());
  } catch (err) {
    next(err);
  }
};

const getStatsSales = async (req, res, next) => {
  const options = getParams(['from', 'to'], req.query);
  if (options instanceof Error) return next(options);

  try {
    res.send(await service.getStatsOfSales(options));
  } catch (err) {
    next(err);
  }
};

const postWholesaler = async (req, res, next) => {
  const options = getParams(['wholesaler_code', 'wholesaler_name'], req.body);
  if (options instanceof Error) return next(options);

  try {
    const result = await service.createWholesaler(options);
    res.send(result);
  } catch (err) {
    next(err);
  }
};

const postGoods = async (req, res, next) => {
  const options = getParams(['goods_code', 'goods_name'], req.body);
  if (options instanceof Error) return next(options);

  try {
    const result = await service.createGoods(options);
    res.send(result);
  } catch (err) {
    next(err);
  }
};


const postStocksByGoods = async (req, res, next) => {
  const options = getParams(['wholesaler_code', 'goods_code', 'quantity'], req.body, req.params);
  if (options instanceof Error) return next(options);

  try {
    const result = await service.createStocks(options);
    res.send(result);
  } catch (err) {
    next(err);
  }
};

const postSalesByGoods = async (req, res, next) => {
  const options = getParams(['stock_code', 'goods_code', 'quantity', 'price'], req.body, req.params);
  if (options instanceof Error) return next(options);

  try {
    const result = await service.createSales(options);
    res.send(result);
  } catch (err) {
    next(err);
  }
};

const postExchangeByGoods = async (req, res, next) => {
  const options = getParams(['sale_id', 'goods_code', 'quantity'], req.body, req.params);
  if (options instanceof Error) return next(options);

  try {
    const result = await service.createExchange(options);
    res.send(result);
  } catch (err) {
    next(err);
  }
};

exports.init = (server) => {
  const prefix = '/api';

  server.get(`${prefix}/stocks`, getStocks);
  server.get(`${prefix}/stats/sales`, getStatsSales);
  server.post(`${prefix}/wholesaler`, postWholesaler);
  server.post(`${prefix}/goods`, postGoods);
  server.post(`${prefix}/goods/:goods_code/stocks`, postStocksByGoods);
  server.post(`${prefix}/goods/:goods_code/sales`, postSalesByGoods);
  server.post(`${prefix}/goods/:goods_code/exchange`, postExchangeByGoods);
};

