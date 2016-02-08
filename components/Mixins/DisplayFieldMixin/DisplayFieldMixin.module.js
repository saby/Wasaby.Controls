/* global define, $ws */
define('js!SBIS3.CONTROLS.DisplayFieldMixin', [
   'js!SBIS3.CONTROLS.Data.Utils'
], function (Utils) {
   'use strict';

   /**
    * Миксин, позволяющий задвать свойства, в которых хранятся ключи и отображаемые значения элементов коллекции
    * @mixin SBIS3.CONTROLS.DisplayFieldMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var DisplayFieldMixin = /**@lends SBIS3.CONTROLS.DisplayFieldMixin.prototype  */{
      $protected: {
         _options: {
            /**
             * @cfg {String} Поле элемента коллекции, которое является ключом
             * @example
             * <pre>
             *     <option name="keyField">Идентификатор</option>
             * </pre>
             * @see items
             */
            keyField: '',

            /**
             * @cfg {String} Поле, которое отображается как название
             * @example
             * <pre>
             *     <option name="displayField">Название</option>
             * </pre>
             */
            displayField: ''
         }
      },

      $constructor: function (cfg) {
         cfg = cfg || {};

         if (!('displayField' in cfg) && ('captionField' in cfg)) {
            this._options.displayField = cfg.captionField;
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.DisplayFieldMixin', 'Опция "captionField" устарела. Используйте опцию "displayField".');
         }

         if (!this._options.keyField && this._options.items instanceof Array) {
            var item = this._options.items[0];
            if (item && Object.prototype.toString.call(item) === '[object Object]') {
               this._options.keyField = Object.keys(item)[0];
            }
         }

         if (!this._options.keyField) {
            this._options.keyField = this._options.displayField;
         }
      }
   };

   return DisplayFieldMixin;
});
