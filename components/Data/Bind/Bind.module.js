/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Bind', [
], function () {
   'use strict';

   /**
    * Привязка данных
    * @class SBIS3.CONTROLS.Data.Bind
    * @public
    * @author Мальцев Алексей
    */

   return $ws.core.extend({}, /** @lends SBIS3.CONTROLS.Data.Bind.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Bind',
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Bind.IValueConverter} Конвертер значений
             */
            converter: undefined,

            /**
             * @cfg {String} Режим привязки
             */
            mode: undefined,

            /**
             * @cfg {SBIS3.CONTROLS.Data.Bind.IProperty|SBIS3.CONTROLS.Data.Bind.ICollection|SBIS3.CONTROLS.Data.Collection.IList|Object} Источник привязки
             */
            source: undefined,

            /**
             * @cfg {String} Путь до объекта в источнике привязки
             */
            sourcePath: '',

            /**
             * @cfg {SBIS3.CONTROLS.Component} Цель привязки
             */
            target: undefined,

            /**
             * @cfg {String} Свойство цели привязки
             */
            targetProperty: '',

            /**
             * @cfg {String} Режим срабатывания привязки
             */
            targetTrigger: ''
         }
      },

      $constructor: function () {
      }
   });
});
