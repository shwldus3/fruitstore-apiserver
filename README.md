# 과일센터 관리 Backend

## Summary
과일을 판매하는 과일센터


### Actions
* 과일 등록
  * 과일 스펙에 맞는 과일을 등록합니다.
* 과일 입고
  * 과일을 도매상으로부터 받아서 창고에 넣습니다.
  * 과일 코드, 개수로 입고할 수 있습니다.
  * 과거의 어떤 시점에 입고 기록을 남길 수 있어야 합니다. 만약 시간을 입력하지 않으면 디폴트는 현재 시간입니다.
  * 입고된 과일은 정상 재고로 간주합니다.
* 과일 판매
  * 과일이 사용자에게 판매되었습니다. 
  * 한꺼번에 여러 과일을 팔지는 않고 한 종류씩 판매합니다.
  * 판매될 때 개수와 판매 단가를 입력받습니다.
  * 입고와 마찬가지로 특정 시점에 판매된 기록을 남길 수 있습니다. 디폴트는 현재 시간입니다.
* 불량 과일 교환
  * 정상인 줄 알고 판매했던 과일 중에 불량 과일이 있어서 교환합니다.
  * 교환할 과일 코드, 개수, 시간을 입력합니다.
  * 정상 재고를 차감하고 불량 재고를 가산합니다.
* 과일 재고
  * 과일별로 정상/불량 재고가 몇 개인지 알고 싶습니다.
  * 입고된 과일은 모두 정상으로 간주하고, 교환된 과일만 불량 과일입니다.
* 기간별 판매 통계(특정 기간동안 판매된 과일들의 개수와 금액을 알고 싶습니다.)
  * Hint : 판매가 늘어나더라도 DB 쿼리 개수가 많아지지 않도록 해주세요.



### Structure

* server
  *  vo : Folder about rendering data
  *  config.js : Setting file
  *  package.json : npm start / npm test
  *  test.js : Testcase
  *  app.js
  *  model.js
  *  service.js
* spec
  * api.md : API List
  * env.sh : System environments for config.js
  * fruit.sql : DB & Table creating sql
  * schema.png : RDB Schema
