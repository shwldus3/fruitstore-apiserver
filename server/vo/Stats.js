'use strict';

class Stats {
  constructor() {}

  static renderSaleRows(rows) {
    if (!rows || !Array.isArray(rows)) return [];

    const list = [];
    rows.forEach((row) => {
      list.push(new Stats().setSale(row));
    });

    return list;
  }

  setSale({goods_code, quantity, price}) {
    this.goods_code = goods_code;
    this.quantity = quantity;
    this.price = price;
    return this;
  }
}

module.exports = Stats;
