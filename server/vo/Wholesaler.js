'use strict';

class Wholesaler {
  constructor() {}

  static renderRow(row) {
    if (!row || !row.wholesaler_code) return new Wholesaler();

    return new Wholesaler().setDefault(row);
  }

  setDefault({wholesaler_code, wholesaler_name}) {
    this.wholesaler_code = wholesaler_code;
    this.wholesaler_name = wholesaler_name;
    return this;
  }

  isAlready(wholesaler_code) {return this.wholesaler_code && this.wholesaler_code === wholesaler_code;}
}

module.exports = Wholesaler;
