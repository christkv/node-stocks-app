var FetchStockSymbols = require("../lib/stock/fetch_stock_symbols_jobs").FetchStockSymbols;
  
/**
 * Retrieve the server information for the current
 * instance of the db client
 * 
 * @ignore
 */
exports.setUp = function(callback) {
  callback();
}

/**
 * Retrieve the server information for the current
 * instance of the db client
 * 
 * @ignore
 */
exports.tearDown = function(callback) {
  callback();
}

exports.shouldFetchNasdaqStock = function(test) {
  // Grab nasdaq data
  var fetcher = new FetchStockSymbols("nasdaq");
  // Register event handlers
  fetcher.on("ticker", function(ticker) {    
    console.dir(ticker);
  });
  fetcher.on("end", function() {
    test.done();
  }); 
  
  // Initiate the fetch
  fetcher.fetch()  
}


