(function() {

   'use strict';
   var global = (function(){ return this || (0,eval)('this'); }()),
      define = global.define || (global.requirejs && global.requirejs.define),
      /**
       * в filterParams значения могут браться из функций,
       * формируем список зависимых модулей
       */
      parseDependentModules = function (json) {
         var depMod = [];
         $ws.helpers.forEach(json, function (value) {
            if (value.filterParams) {
               $ws.helpers.forEach(value.filterParams, function (fValue) {
                  if(/^wsFuncDecl::/.test(fValue)) {
                     var val = fValue.replace(/^wsFuncDecl::/, '').split(':')[0];
                     depMod.push(val);
                  }
               });
            }
         });
         return depMod;
      };
   define('datasource', {
      load: function (name, require, onLoad, conf) {
         try {
            var path = $ws.helpers.requirejsPathResolver(name, 'dpack');
            require(['text!' + path], function (json) {
               var parsedData = {};
               try {
                  parsedData = JSON.parse(json);
               } catch (e) {
                  $ws.single.ioc.resolve('ILogger').log('Core', 'Datasource format for ' + name + ' parse failed');
               }
               onLoad(parsedData);
            }, function () {
               $ws.single.ioc.resolve('ILogger').log("Core", "DataSource " + name + " load failed");
               onLoad( {} );
            });
         }
         catch(err){
            onLoad.error(err);
         }
      }
   });
}());