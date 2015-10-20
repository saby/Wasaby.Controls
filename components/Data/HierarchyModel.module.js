/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.HierarchyModel', [
   'js!SBIS3.CONTROLS.Data.Model'
], function (Model) {
   'use strict';

   /**
    * Модель, реализующая узел иерархии.
    * @class SBIS3.CONTROLS.Data.HierarchyModel
    * @extends SBIS3.CONTROLS.Data.Model
    * @public
    * @author Мальцев Алексей
    */

   var HierarchyModel = Model.extend(/** @lends SBIS3.CONTROLS.Data.HierarchyModel.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.HierarchyModel',
      $protected: {
         _options: {
            /**
             * @cfg {String} Название свойства, содержащего идентификатор родительского узла
             */
            parentProperty: '',

            /**
             * @cfg {String} Название свойства, содержащего признак узла
             */
            nodeProperty: ''
         }
      },

      // region Public methods

      /**
       * Возвращает название свойства, содержащее идентификатор родительского узла
       * @returns {String}
       */
      getParentProperty: function () {
         return this._options.parentProperty;
      },

      /**
       * Устанавливает название свойства, содержащее идентификатор родительского узла
       * @param {String} name Название поля
       */
      setParentProperty: function (name) {
         this._options.parentProperty = name;
      },

      /**
       * Возвращает идентификатор родительского раздела
       * @returns {String}
       */
      getParentId: function () {
         return this._options.parentProperty ? this.get(this._options.parentProperty) : undefined;
      },

      /**
       * Возвращает название свойства, содержащего признак узла
       * @returns {String}
       */
      getNodeProperty: function () {
         return this._options.nodeProperty;
      },

      /**
       * Устанавливает название свойства, содержащего признак узла
       * @param {String} name Название свойства
       */
      setNodeProperty: function (name) {
         this._options.nodeProperty = name;
      },

      /**
       * Возвращает, что это узел
       * @returns {Boolean}
       */
      isNode: function () {
         return this._options.nodeProperty && this.get(this._options.nodeProperty) ? true : false;
      }

      // endregion Public methods
   });

   return HierarchyModel;
});
