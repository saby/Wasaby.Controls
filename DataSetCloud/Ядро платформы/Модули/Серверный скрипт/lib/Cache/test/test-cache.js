require([ 'js!SBIS3.CORE.Cache' ], function(Cache) {

   var CacheTest = AsyncTestCase('CacheTest'), cache;


   /**
    * Проверяем, что для ключа отдаются данные
    * @param queue
    */
   CacheTest.prototype.testGetItemCallsFactory = function(queue) {


      cache = Cache.getByName('testCache', 100, function(key) {

         var d = new $ws.proto.Deferred();
         setTimeout(function(){
            d.callback(key + 'data');
         }, 5);
         return d;
      })


      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

   }

   /**
    * Проверяем, что для одного и того же ключа повторно не вызывается конструирующая функуция
    * @param queue
    */
   CacheTest.prototype.testGetItemCachedByKey = function(queue) {

      var timesFactoryCalled = 0;

      cache = Cache.getByName('testCache', 100, function(key) {

         timesFactoryCalled++;

         var d = new $ws.proto.Deferred();
         setTimeout(function(){
            d.callback(key + 'data');
         }, 5);
         return d;
      });

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(){
         assertEquals('Factory called times', 1, timesFactoryCalled);
      });

   }

   /**
    * Проверяем, что для одного и того же ключа повторно не вызывается конструирующая функуция,
    * до тех пор, пока не протухнет кэш
    *
    * @param queue
    */
   CacheTest.prototype.testGetItemKeyExpires = function(queue) {

      var timesFactoryCalled = 0;

      cache = Cache.getByName('testCache', 100, function(key) {

         timesFactoryCalled++;

         var d = new $ws.proto.Deferred();
         setTimeout(function(){
            d.callback(key + 'data');
         }, 5);
         return d;
      });

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(pool){
         assertEquals('Factory called times', 1, timesFactoryCalled);

         setTimeout(pool.add(function(){
            // просто эдем, чтобы протух кэш
         }), 1000);

      });

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(pool){
         assertEquals('Factory called times', 2, timesFactoryCalled);
      });


   }

   /**
    * Первый запрос возвращает ошибку, повторные успех
    * Проверяем что первый запрос не попадет в кэш
    * @param queue
    */
   CacheTest.prototype.testErrorResultNotCached = function(queue) {

      var timesFactoryCalled = 0;

      cache = Cache.getByName('testCache', 100, function(key) {

         if (timesFactoryCalled++ === 0) {
            return new $ws.proto.Deferred().errback('xxx');
         }

         var d = new $ws.proto.Deferred();
         setTimeout(function(){
            d.callback(key + 'data');
         }, 5);
         return d;
      });

      queue.call(function(pool){

         cache.getItem('key1').addCallbacks(pool.addErrback('first getItem must fail'), pool.add(function(err){
            assertEquals('xxx', err.message);
         }))

      });

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(pool){
         assertEquals('Factory called times', 2, timesFactoryCalled);
      });

   }

   /**
    * Первый запрос возвращает ошибку, повторные успех
    * Ошибка возвращается с полем data - что приводит к вызову callback
    * Проверяем что первый запрос не попадет в кэш
    *
    * @param queue
    */
   CacheTest.prototype.testErrorResultCanStoreData = function(queue) {

      var timesFactoryCalled = 0;

      cache = Cache.getByName('testCache', 100, function(key) {

         if (timesFactoryCalled++ === 0) {
            var result = new Error('xxx');
            result.data = 'key1error';
            return new $ws.proto.Deferred().errback(result);
         }

         var d = new $ws.proto.Deferred();
         setTimeout(function(){
            d.callback(key + 'data');
         }, 5);
         return d;
      });

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1error', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(pool){
         assertEquals('Factory called times', 2, timesFactoryCalled);
      });

   }

   /**
    * Проверяем expire==-1 - данные никогда не устаревают
    * @param queue
    */
   CacheTest.prototype.testNeverExpire = function(queue) {

      var timesFactoryCalled = 0;

      cache = Cache.getByName('testCache', -1, function(key) {

         timesFactoryCalled++;
         var d = new $ws.proto.Deferred();
         setTimeout(function(){
            d.callback(key + 'data');
         }, 5);
         return d;
      });

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(pool){
         setTimeout(pool.add(function(){
            // Ждем, чтобы сымитировать протухание кэша
         }), 2000);
      })

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(pool){
         assertEquals('Factory called times', 1, timesFactoryCalled);
      });

   }

   /**
    * Тестируем моментальное устаревание
    * @param queue
    */
   CacheTest.prototype.testAlwaysExpire = function(queue) {

      var timesFactoryCalled = 0;

      cache = Cache.getByName('testCache', 0, function(key) {

         timesFactoryCalled++;
         var d = new $ws.proto.Deferred();
         setTimeout(function(){
            d.callback(key + 'data');
         }, 5);
         return d;
      });

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(pool){
         setTimeout(pool.add(function(){
            // Ждем, чтобы сэмитировать протухание кэша
         }), 0);
      })

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(pool){
         assertEquals('Factory called times', 2, timesFactoryCalled);
      });

   }

   CacheTest.prototype.testPurgeAll = function(queue) {

      var timesFactoryCalled = 0;

      cache = Cache.getByName('testCache', 5000, function(key) {

         timesFactoryCalled++;
         var d = new $ws.proto.Deferred();
         setTimeout(function(){
            d.callback(key + 'data');
         }, 5);
         return d;
      });

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(pool){
         setTimeout(pool.add(function(){
            cache.purge();
         }), 10);
      })

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(pool){
         assertEquals('Factory called times', 2, timesFactoryCalled);
      });

   }

   CacheTest.prototype.testPurgeKey = function(queue) {

      var timesFactoryCalled = {}

      cache = Cache.getByName('testCache', 5000, function(key) {

         timesFactoryCalled[key] = (timesFactoryCalled[key] || 0) + 1;
         var d = new $ws.proto.Deferred();
         setTimeout(function(){
            d.callback(key + 'data');
         }, 5);
         return d;
      });

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

         cache.getItem('key2').addCallback(pool.add(function(res){
            assertEquals('key2data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(pool){
         setTimeout(pool.add(function(){
            cache.purge('key1');
         }), 10);
      })

      queue.call(function(pool){

         cache.getItem('key1').addCallback(pool.add(function(res){
            assertEquals('key1data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

         cache.getItem('key2').addCallback(pool.add(function(res){
            assertEquals('key2data', res);
         })).addErrback(pool.addErrback('getItem failed, but should not'));

      });

      queue.call(function(pool){
         assertEquals('Factory called for key1 times', 2, timesFactoryCalled.key1);
         assertEquals('Factory called for key2 times', 1, timesFactoryCalled.key2);
      });

   }



   CacheTest.prototype.tearDown = function() {
      if(cache) {
         cache.destroy();
      }
   }

});