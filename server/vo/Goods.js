'use strict';

class Goods {
  constructor() {}

  static renderRow(row) {
    if (!row || !row.goods_code) return new Goods();

    return new Goods().setDefault(row);
  }

  setDefault({goods_code, goods_name}) {
    this.goods_code = goods_code;
    this.goods_name = goods_name;
    return this;
  }

  isAlready(goods_code) {return this.goods_code && this.goods_code === goods_code;}
}

module.exports = Goods;
