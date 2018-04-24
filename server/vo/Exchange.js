'use strict';

class Exchange {
  constructor() {}

  static renderRow(row) {
    if (!row || !row.exchange_id) return new Exchange();

    return new Exchange().setDefault(row);
  }

  static renderRows(rows) {
    if (!rows || !Array.isArray(rows)) return [];

    const list = [];
    rows.forEach((row) => {
      list.push(Exchange.renderRow(row));
    });

    return list;
  }

  setDefault({exchange_id, quantity, created}) {
    this.exchange_id = exchange_id;
    this.quantity = quantity;
    this.created = created;
    return this;
  }
}

module.exports = Exchange;
