/**
 * Created by shilovda on 25.09.13.
 */

(function() {

   'use strict';
   var global = (function(){ return this || (0,eval)('this'); }()),
       define = global.define || (global.requirejs && global.requirejs.define);

   define('json', {
      load: function (name, require, onLoad, conf) {
         try{
            var path = $ws.helpers.requirejsPathResolver(name, 'json');
            require(['text!' + path], function(json){
               var parsedData = {};
               try{
                  parsedData = JSON.parse(json);
               } catch(e){
                  $ws.single.ioc.resolve('ILogger').log('Core', 'JSON ' + name + ' parse failed');
               }
               onLoad(parsedData);
            }, function(){
               // $ws.single.ioc.resolve('ILogger').log("Core", "JSON " + name + " load failed");
               onLoad( {} )
            });
         }
         catch(err){
            onLoad.error(err);
         }
      }
   });
}());