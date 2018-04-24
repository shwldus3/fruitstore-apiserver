'use strict';

class Warehousing {
  constructor() {}

  static renderRow(row) {
    if (!row || !row.warehousing_id) return new Warehousing();

    return new Warehousing().setDefault(row);
  }

  static renderRows(rows) {
    if (!rows || !Array.isArray(rows)) return [];

    const list = [];
    rows.forEach((row) => {
      list.push(Warehousing.renderRow(row));
    });

    return list;
  }

  setDefault({warehousing_id, quantity, created}) {
    this.warehousing_id = warehousing_id;
    this.quantity = quantity;
    this.created = created;
    return this;
  }
}

module.exports = Warehousing;
