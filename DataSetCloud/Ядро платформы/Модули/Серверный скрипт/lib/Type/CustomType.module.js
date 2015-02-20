define("js!SBIS3.CORE.CustomType", function () {

   "use strict";

   /**
    * Описание составного типа
    * @class CustomType
    * @category Выбор
    */
   var CustomType = $ws.core.extend({}, {
      /**
       * @lends CustomType.prototype
       */
      $protected: {
         _options: {}
      },
      updateProperties: function(cfg) {
         $ws.core.propertyMerge(cfg, this._options);
         this.init();
      },
      init: function() {
         $ws.helpers.forEach(this._options, function(v, k){
            this[k] = v;
         }, this);
      },
      /**
       * Проверка на CustomType
       * @returns {boolean}
       */
      isCustomType: function () {
         return true;
      },
      /**
       * Проверка, правильно ли сконфигурирован тип, реализуется в каждом типе отдельно
       * @returns {boolean}
       * @example
       * <pre>
       *    if(this._options.myType.isConfigured())
       *       this.doSomething();
       * </pre>
       */
      isConfigured: function () {
         return false;
      }
   });
   return CustomType;
});