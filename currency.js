"use strict";

class currency{
   constructor(currencyTo,currencyFrom,currentExchangeRate)
   {
       this.currencyTo=currencyTo;
       this.currencyFrom=currencyFrom;
       this.currentExchangeRate=currentExchangeRate;
   }

   toString() {
       return `{ currencyTo: '${this.currencyTo}', currencyFrom: '${this.currencyFrom}',rate:'${this.currentExchangeRate}'}`;
   }
};

module.exports=currency;