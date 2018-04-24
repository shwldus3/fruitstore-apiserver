'use strict';

global.config = require('./config');

const moment = require('moment');
const chai = require('chai');
const expect = chai.expect;
const service = require('./service');

const mochaAsync = (fn) => {
  return async () => {
    try {
      await fn();
    } catch (err) {
      throw err;
    }
  };
};

const uid = new Date().getTime();
const meta = {
  wholesaler: {
    wholesaler_code: `ADMIN_${uid}`,
    wholesaler_name: `ADMIN_${uid}`
  },
  goods: {
    goods_code: `TEST_${uid}`,
    goods_name: `TEST_${uid}`
  },
  stocks: {
    quantity: 10
  },
  sales: {
    quantity: 4,
    price: 1000
  },
  exchange: {
    quantity: 2
  }
};

describe('Fruit Test', () => {
  describe('Wholesaler', () => {
    it('Create', mochaAsync(async () => {
      const data = await service.createWholesaler(meta.wholesaler);
      expect(data).to.be.a('Object');
    }));
  });

  describe('Goods', () => {
    it('Create', mochaAsync(async () => {
      const data = await service.createGoods(meta.goods);
      expect(data).to.be.a('Object');
    }));

    it('Create stocks by wholesaler', mochaAsync(async () => {
      const {stocks, goods, wholesaler} = meta;
      const data = await service.createStocks(Object.assign({}, stocks, goods, wholesaler));
      expect(data).to.be.a('Object');
      meta.stocks.stock_code = data.stock_code;
    }));

    it('Create sales', mochaAsync(async () => {
      const {stocks, sales} = meta;
      const data = await service.createSales(Object.assign({stock_code: stocks.stock_code}, sales));
      expect(data).to.be.a('Object');
      meta.sales.sale_id = data.sales[0].sale_id;
    }));

    it('Create exchange', mochaAsync(async () => {
      const {sales, exchange} = meta;
      const data = await service.createExchange(Object.assign({sale_id: sales.sale_id}, exchange));
      expect(data).to.be.a('Object');
    }));
  });

  describe('Stocks', () => {
    it('Get', mochaAsync(async () => {
      const data = await service.getStocksSummary();
      expect(data).to.be.a('Array');
    }));
  });

  describe('Stats', () => {
    it('Get sales', mochaAsync(async () => {
      const from = moment().format('YYYY-MM-DD');
      const to = moment().add(1, 'days').format('YYYY-MM-DD');
      const data = await service.getStatsOfSales({from, to});
      expect(data).to.be.a('Array');
    }));
  });
});


