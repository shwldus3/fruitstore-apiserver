## **과일 API 리스트**

- **[POST] /api/goods** 

  - 상품(goods)을 등록(POST)

  - Input

    - goods_code, goods_name

  - output

    - ```json
      {
        "goods_code": "TEST_1509352118056",
        "goods_name": "TEST_1509352118056" 
      }
      ```

- **[POST] /api/wholesaler** 

  - 도매상(wholesaler)을 등록(POST)


  - Input

    - wholesaler_code, wholesaler_name

  - output

    - ```json
      {
        "wholesaler_code": "ADMIN_1509352118056",
        "wholesaler_name": "ADMIN_1509352118056" 
      }
      ```

- **[GET] /api/stocks**

  - 재고(stocks)를 확인(GET)

  - Input

    - 없음

  - output

    - ```json
      [
        {
      	"goods_code": "apple",
        	"good_quantity": 0,
        	"bad_quantity": 0
        },
        {
      	"goods_code": "melon",
        	"good_quantity": 0,
        	"bad_quantity": 0
        },
      ]
      ```

- **[POST] /api/goods/{goods_code}/stocks**

  - 이({code}) 상품(goods)에 대한 재고(stocks)를 추가(POST)

  - Input

    - wholesaler_code, quantity

  - output

    - ```json
      {
        "stock_code": "TEST_1509352118056:ADMIN_1509352118056",
        "goods_code": "TEST_1509352118056",
        "good_quantity": 10,
        "bad_quantity": 0,
        "wholesaler_code": "ADMIN_1509352118056",
        "warehousings":
         [
           {
             "warehousing_id": 61,
             "quantity": 10,
             "created": "2017-10-30T08:28:38.098Z"
           } 
         ] 
      }
      ```


- **[POST] /api/goods/{goods_code}/sales**

  - 이({code}) 상품(goods)을 판매(sales) 추가(POST)

  - Input

    - stock_code(현재는 필수), quantity, price

  - output

    - ```json
      {
        "stock_code": "TEST_1509352118056:ADMIN_1509352118056",
        "goods_code": "TEST_1509352118056",
        "good_quantity": 6,
        "bad_quantity": 0,
        "wholesaler_code": "ADMIN_1509352118056",
        "sales:
         [  
           {
             "sale_id": 52,
             "quantity": 4,
             "price": 1000,
             "created": "2017-10-30T08:28:38.106Z" 
           } 
         ] 
      }
      ```

- **[POST] /api/goods/{goods_code}/exchange**

  - 이({code}) 상품(goods)에 대해 교환(exchange) 추가(POST)

  - Input

    - sale_id(현재는 필수), quantity

  - output

    - ```json
      {
        "stock_code": "TEST_1509352118056:ADMIN_1509352118056",
        "goods_code": "TEST_1509352118056",
        "good_quantity": 4,
        "bad_quantity": 2,
        "wholesaler_code": "ADMIN_1509352118056",
        "sales":
         [
           {
             "sale_id": 52,
             "quantity": 4,
             "price": 1000,
             "created": "2017-10-30T08:28:38.096Z",
             "exchanges": 
             [
             	 {
          		"exchange_id": 43,
          		"quantity": 2,
          		"created": "2017-10-30T08:33:38.984Z" 
           	 } 
         	   ] 
           } 
         ] 
      }
      ```


- **[GET] /api/stats/sales**

  - 판매(sales) 통계(stats) 확인(GET)

  - Input

    - from, to

  - output

    - ```json
      [
        {
          "goods_code": "TEST_1509346255221",
          "good_quantity": "4",
          "bad_quantity": "2" 
        }
      ]
      ```




