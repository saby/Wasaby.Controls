/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.HierarchyModelMixin', [
   'js!SBIS3.CONTROLS.Data.Model'
], function (Model) {
   'use strict';

   /**
    * Миксин, реализующий поведение модели узла иерархии.
    * @mixin SBIS3.CONTROLS.Data.HierarchyModelMixin
    * @public
    * @author Мальцев Алексей
    */

   var HierarchyModelMixin = /** @lends SBIS3.CONTROLS.Data.HierarchyModelMixin.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.HierarchyModelMixin',
      $protected: {
         _options: {
            /**
             * @cfg {String} Название поля, содержащее идентификатор родительского узла
             */
            parentField: '',

            /**
             * @cfg {String} Название поля, содержащее признак узла
             */
            nodeField: ''
         }
      },

      // region public

      /**
       * Возвращает название поля, содержащее идентификатор родительского узла
       * @returns {String}
       */
      getParentField: function () {
         return this._options.parentField;
      },

      /**
       * Устанавливает название поля, содержащее идентификатор родительского узла
       * @param {String} name Название поля
       */
      setParentField: function (name) {
         this._options.parentField = name;
      },

      /**
       * Возвращает идентификатор родительского раздела
       * @returns {String}
       */
      getParentId: function () {
         return this._options.parentField ? this.get(this._options.parentField) : undefined;
      },

      /**
       * Возвращает название поля, содержащее признак узла
       * @returns {String}
       */
      getNodeField: function () {
         return this._options.nodeField;
      },

      /**
       * Устанавливает название поля, содержащее признак узла
       * @param {String} name Название поля
       */
      setNodeField: function (name) {
         this._options.nodeField = name;
      },

      /**
       * Возвращает, что это узел
       * @returns {Boolean}
       */
      isNode: function () {
         return this._options.nodeField && this.get(this._options.nodeField) ? true : false;
      }

      // endregion public

   };

   return HierarchyModelMixin;
});
