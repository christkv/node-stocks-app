var util = require('util'),
  EventEmitter = require('events').EventEmitter,
  inherits = require('util').inherits,  
  request = require('request'),
  csv = require('csv');

var FetchStockSymbols = function FetchStockSymbols(exchange) {  
  // Set up inheritance
  EventEmitter.call(this);
  // Check if it's a supported exchange
  if(exchange != "nasdaq" && exchange != "nyse") throw new Error("unsupported exchange " + exchange);
  // exchanges
  this.exchange = exchange;
  // url for the fetching of symbols
  this.url = util.format("http://www.nasdaq.com/screening/companies-by-name.aspx?letter=0&exchange=%s&render=download", this.exchange);
}

inherits(FetchStockSymbols, EventEmitter);

FetchStockSymbols.prototype.fetch = function() {
  // console.dir(csv)
  var self = this;  
  // Grab the response
  var requestStream = request(this.url);
  // Set up csv()
  csv()
  .fromStream(requestStream)
  .transform(function(data) {
      data.unshift(data.pop());
      return data;
  })
  .on('data',function(data,index) {
    // Unpack
    var symbol = data[1];
    var name = data[2];
    var ipoYear = data[6];
    var sector = data[7];
    var industry = data[8];
    var summaryQuote = data[9];    
    // Create ticker object
    var ticker = new Ticker(self.exchange, symbol, name, ipoYear, sector, industry, summaryQuote);
    // Emit the ticker
    self.emit("ticker", ticker);
  })
  .on('end',function(count) {
    self.emit("end");
  })
  .on('error',function(error) {
    self.emit("error", error);
  });  
}

exports.FetchStockSymbols = FetchStockSymbols;

/**
 *  Stock ticker object
 **/
var Ticker = function Ticker(exchange, symbol, name, ipoYear, sector, industry, summaryQuote) {  
  this.exchange = exchange;
  this.symbol = symbol;
  this.name = name;
  this.ipoYear = ipoYear;
  this.sector = sector;
  this.industry = industry;
  this.summaryQuote = summaryQuote;
}



