/**
 * Идентификатор текущей вкладки
 *
 * @class SBIS3.CONTROLS.LongOperations.TabKey
 * @public
 */
define('js!SBIS3.CONTROLS.LongOperations.TabKey',
   [],

   function () {
      'use strict';

      /**
       * Сгенерировать случайную hex-строку указанной длины
       * @protected
       * @param {number} n Длина строки
       * @return {string}
       */
      var _uniqueHex = function(n){var l=[];for(var i=0;i<n;i++){l[i]=Math.round(15*Math.random()).toString(16)}return l.join('')};
      //var _uniqueHex = function(n){return Math.round((Math.pow(16,n)-1)*Math.random()).toString(16).padStart(n,'0')};

      var tabKey = _uniqueHex(50);
      return tabKey;
   }
);
