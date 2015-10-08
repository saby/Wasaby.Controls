/* global define, $ws */
define('js!SBIS3.CONTROLS.DisplayFieldMixin', [
], function () {
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

      $constructor: function () {
         if (!this._options.keyField) {
            this._options.keyField = this._options.displayField;
         }
      }
   };

   return DisplayFieldMixin;
});
