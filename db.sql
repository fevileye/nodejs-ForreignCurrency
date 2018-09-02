CREATE TABLE exchangerate (currencyTo VARCHAR(20) NOT NULL,currencyFrom VARCHAR(20) NOT NULL,rate REAL);

CREATE TABLE exchangeratehistory (inputDate date NOT NULL,currencyTo VARCHAR(20) NOT NULL,currencyFrom VARCHAR(20) NOT NULL,rate REAL);

CREATE TABLE exchangeRateList (customerID VARCHAR(20) NOT NULL,currencyFrom VARCHAR(20) NOT NULL,currencyTo VARCHAR(20) NOT NULL);
