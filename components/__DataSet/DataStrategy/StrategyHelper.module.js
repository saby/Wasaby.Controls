/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.StrategyHelper', [
   'js!SBIS3.CONTROLS.DataStrategyArray',
   'js!SBIS3.CONTROLS.DataStrategyBL'
], function (DataStrategyArray, DataStrategyBL) {
   'use strict';

   /**
    * Хелпер, помогающий нам создавать объекты стратегий, для работы с данными
    */

   var strategyList = {
      'DataStrategyArray': DataStrategyArray,
      'DataStrategyBL': DataStrategyBL
   };

   var StrategyHelper = $ws.core.extend({}, {
      $protected: {
      },
      $constructor: function () {
      },
      getStrategyObjectByName: function (name) {
         return strategyList[name];
      }

   });

   return new StrategyHelper();

});