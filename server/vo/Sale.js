'use strict';

class Sale {
  constructor() {}

  static renderRow(row) {
    if (!row || !row.sale_id) return new Sale();

    return new Sale().setDefault(row);
  }

  static renderRows(rows) {
    if (!rows || !Array.isArray(rows)) return [];

    const list = [];
    rows.forEach((row) => {
      list.push(Sale.renderRow(row));
    });

    return list;
  }

  setDefault({sale_id, quantity, price, created}) {
    this.sale_id = sale_id;
    this.quantity = quantity;
    this.price = price;
    this.created = created;
    return this;
  }

  setExchanges(exchanges) {
    if (!Array.isArray(exchanges)) return this;
    this.exchanges = exchanges;
    return this;
  }

  isAlready(sale_id) {return this.sale_id && this.sale_id === sale_id;}
  canExchange(quantity) {return this.quantity > quantity;}
}

module.exports = Sale;
