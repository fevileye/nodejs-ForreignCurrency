var express= require("express");
var router=express.Router();
const currency= require('../currency.js');
const dbQuery= require('../model/connectToDB.js');


function setHeaderResponse(result,res,error,statusCode){
    
    if (error == true)
    {
        res.statusCode=statusCode;
        res.setHeader('X-Transmission-Date-Time',new Date());
        res.setHeader('Content-Type','application/json');
        res.send(result);
    }
    else
    {
        res.statusCode=statusCode;
        res.setHeader('X-Transmission-Date-Time',new Date());
        res.setHeader('Content-Type','application/json');
        res.send(result);
    }
    
}

module.exports.init= function(db,app){
    app.get('/exchangeRates', async function(req,res){
        try{
            let result= await dbQuery.doQuery(db,"SELECT * FROM exchangeRate");

            let currencies=[];
            let data={};
            let parentName="Currencies"
            data[parentName]=[];

           for (var i =0 ;i<result.rowCount;i++)
            {
                data[parentName].push(result.rows[i]);
            }
            setHeaderResponse(JSON.stringify(data),res,false,"200"); 
        }
        catch (err){
            setHeaderResponse("{}",res,true,"500");
            console.log(err);
        }  
    });
    
    app.post('/exchangeRates/data',async function(req,res){
        try{
            let queryInsert = `INSERT INTO exchangeRateHistory VALUES ('${req.body.date}','${req.body.currencyTo}','${req.body.currencyFrom}',${req.body.rate})`;
            let result = await dbQuery.doQuery(db,queryInsert);
            
                let querySelectMaster=`SELECT * FROM exchangeRate WHERE currencyTo='${req.body.currencyTo}' AND currencyFrom='${req.body.currencyFrom}'`;
                let resultSelect = await dbQuery.doQuery(db,querySelectMaster);
                console.log(resultSelect.rowCount);
                if (resultSelect.rowCount == 0)
                {
                    let queryInsertExHist=`INSERT INTO exchangeRate VALUES ('${req.body.currencyTo}','${req.body.currencyFrom}','${req.body.rate}')`;
                    let resultInsertExHist= await dbQuery.doQuery(db,queryInsertExHist);
                }
                else
                {
                   let queryUpdate=`UPDATE exchangeRate SET currencyTo='${req.body.currencyTo}',currencyFrom='${req.body.currencyFrom}',rate='${req.body.rate}' WHERE currencyTo='${req.body.currencyTo}' AND currencyFrom='${req.body.currencyFrom}'`;
                   let resultUpdate = await dbQuery.doQuery(db,queryUpdate);
                }
            
            setHeaderResponse("{}",res,false,"200");
            
        }
        catch(err){
            setHeaderResponse("{}",res,true,"500");
            console.log(err);       
        }
        
    });
    
    app.get('/exchangeRates/list/:date',async function(req,res){
       try{
        let query=`SELECT master.currencyTo,master.currencyFrom,master.RATE,AVG(hist.RATE), COUNT(hist.RATE) FROM exchangeRateHistory hist, (SELECT currencyTo, currencyFrom,Rate FROM exchangeRate) AS master WHERE (hist.currencyFrom = master.currencyFrom AND hist.currencyTo=master.currencyTo) AND ( inputDate >= (date '${req.params.date}' - INTERVAL '7 days'))
        GROUP BY hist.currencyTo,hist.currencyFrom, master.RATE, master.currencyTo,master.currencyFrom`;
        let result = await dbQuery.doQuery(db,query); 
        
        let data={};
        const parentName="listOfExchangeRate"
        data[parentName]=[];
  
        for (var i =0 ;i<result.rowCount;i++)
        {
            if (result.rows[i].count  >= 7)
            {
                let temp={ currencyTo: `${result.rows[i].currencyto}`, currencyFrom: `${result.rows[i].currencyfrom}`,rate:`${result.rows[i].rate}`,'7 Days Average':`${result.rows[i].avg}`};
                data[parentName].push(temp);
            }
            else
            {
                let temp={ currencyTo: `${result.rows[i].currencyto}`, currencyFrom: `${result.rows[i].currencyfrom}`,rate:'Insufficient Data','7 Days Average':'Insufficient Data'};
                data[parentName].push(temp);
            }
        }
        
        setHeaderResponse(JSON.stringify(data),res,false,"200");
       } 
       catch(err){
        setHeaderResponse("{}",res,true,"500");
        console.log(err);
       }
      
    });
    
    app.get('/exchangeRates/trend/sourceCurrency/:srcCurrency/destinationCurrency/:destCurrency',async function(req,res)
    {
        try{

            let data={};
            let query=`SELECT currencyFrom,currencyTo,avg(rate),(MAX(RATE)-MIN(RATE)) AS VARIANCE FROM exchangeRateHistory WHERE currencyFrom='${req.params.srcCurrency}' AND currencyTo='${req.params.destCurrency}' AND inputDate >= CURRENT_TIMESTAMP - INTERVAL '7 days' GROUP BY currencyTo,currencyFrom`;
            let result=await dbQuery.doQuery(db,query);
            let parentName="Information";
            data[parentName]=[];
            
            for (var i=0;i<result.rowCount;i++)
            {
                data[parentName].push(result.rows[i]);
            }

            query=`SELECT inputDate, rate FROM exchangeRateHistory WHERE currencyFrom='${req.params.srcCurrency}' AND currencyTo='${req.params.destCurrency}' AND inputDate >= CURRENT_TIMESTAMP - INTERVAL '7 days'`;
            result= await dbQuery.doQuery(db,query);
            parentName="trendList"
            data[parentName]=[];

            for (var i=0;i<result.rowCount;i++)
            {
                data[parentName].push(result.rows[i]);
            }

            setHeaderResponse(JSON.stringify(data),res,true,"200");
        
        }
        catch (err){
            setHeaderResponse("{}",res,true,"500");
            console.log(err);
        }
        
    });
    
    app.delete('/exchangeRateLists/',async function(req,res){
        
        try
        {
            let queryInsert = `DELETE FROM exchangeRateList WHERE customerid='${req.body.customerID}' AND currencyTo='${req.body.currencyTo}' AND currencyFrom='${req.body.currencyFrom}'`;
            let result = await dbQuery.doQuery(db,queryInsert);          
            setHeaderResponse("{}",res,true,"200");         
        }
        catch (err)
        {
            setHeaderResponse("{}",res,true,"500");
            console.log(err);
        }
    });   

    app.post('/exchangeRateLists/',async function(req,res){
        try
        {
            let queryInsert = `INSERT INTO exchangeRatelist VALUES ('${req.body.customerID}','${req.body.currencyFrom}','${req.body.currencyTo}')`;
            let result = await dbQuery.doQuery(db,queryInsert);
            
            setHeaderResponse({},res,true,"200");         
        }
        catch (err)
        {
            setHeaderResponse("{}",res,true,"500");
            console.log(err);
        }
        
    });
}


