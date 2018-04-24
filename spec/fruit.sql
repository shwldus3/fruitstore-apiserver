-- Domain : Fruit Store DB
CREATE DATABASE fruitstore;
CREATE USER admin;
GRANT ALL PRIVILEGES ON DATABASE fruitstore TO admin;


CREATE TABLE IF NOT EXISTS goods (
	goods_code VARCHAR(100) PRIMARY KEY NOT NULL,
	goods_name VARCHAR(100) NOT NULL,
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS wholesaler (
	wholesaler_code VARCHAR(100) PRIMARY KEY NOT NULL,
	wholesaler_name VARCHAR(100) NOT NULL,
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);


-- stock_code: goods_code + wholesaler_code
CREATE TABLE IF NOT EXISTS stock (
	stock_code VARCHAR(100) PRIMARY KEY NOT NULL,
	goods_code VARCHAR(100) REFERENCES goods NOT NULL,
	wholesaler_code VARCHAR(100) REFERENCES wholesaler NOT NULL, 
	good_quantity SMALLINT NOT NULL DEFAULT 0,
	bad_quantity SMALLINT NOT NULL DEFAULT 0,
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS stock_goods_code_idx ON stock(goods_code);


CREATE TABLE IF NOT EXISTS warehousing (
	warehousing_id SERIAL PRIMARY KEY,
	stock_code VARCHAR(100) REFERENCES stock NOT NULL,
	quantity SMALLINT NOT NULL,
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS warehousing_stock_code_idx ON warehousing(stock_code);


CREATE TABLE IF NOT EXISTS sale (
	sale_id SERIAL PRIMARY KEY,
	stock_code VARCHAR(200) REFERENCES stock NOT NULL,
	quantity SMALLINT NOT NULL,
	price SMALLINT NOT NULL,
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sale_stock_code_idx ON sale(stock_code);


CREATE TABLE IF NOT EXISTS exchange (
	exchange_id SERIAL PRIMARY KEY,
	sale_id INTEGER REFERENCES sale NOT NULL,
	quantity SMALLINT NOT NULL,
	created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS exchange_sale_id_idx ON exchange(sale_id);
