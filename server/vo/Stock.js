'use strict';

class Stock {
  constructor() {}

  static renderRow(row) {
    if (!row || !row.stock_code) return new Stock();

    return new Stock()
      .setStockCode(row)
      .setGoodsCode(row)
      .setQuantity(row)
      .setWholesalerCode(row);
  }

  static renderSummaryRow(row) {
    if (!row) return new Stock();

    return new Stock().setGoodsCode(row)
      .setQuantity(row);
  }

  static renderSummaryRows(rows) {
    if (!rows || !Array.isArray(rows)) return [];

    const list = [];
    rows.forEach((row) => {
      list.push(Stock.renderSummaryRow(row));
    });

    return list;
  }

  setQuantity({good_quantity, bad_quantity}) {
    this.good_quantity = good_quantity;
    this.bad_quantity = bad_quantity;
    return this;
  }

  setStockCode({stock_code}) {
    this.stock_code = stock_code;
    return this;
  }

  setGoodsCode({goods_code}) {
    this.goods_code = goods_code;
    return this;
  }

  setWholesalerCode({wholesaler_code}) {
    this.wholesaler_code = wholesaler_code;
    return this;
  }

  setWarehousings(warehousings) {
    if (!Array.isArray(warehousings)) return this;
    this.warehousings = warehousings;
    return this;
  }

  setSales(sales) {
    if (!Array.isArray(sales)) return this;
    this.sales = sales;
    return this;
  }

  isExist() {return !!this.stock_code;}
  isAlready(stock_code) {return this.stock_code && this.stock_code === stock_code;}
  canSale(quantity) {return this.good_quantity > quantity;}
}

module.exports = Stock;
