/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.ITreeChildrenStrategy', [
], function () {
   'use strict';

   /**
    * Интерфейс стратегии получения дочерних элементов узла дерева
    * @mixin SBIS3.CONTROLS.Data.Projection.ITreeChildrenStrategy
    */
   return /** @lends SBIS3.CONTROLS.Data.Projection.ITreeChildrenStrategy.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Collection.IEnumerable} Исходная коллекция
             */
            source: null,

            /**
             * @cfg {Object} Опции стратегии
             */
            settings: null
         }
      },

      /**
       * Возвращает коллекцию потомков для родителя
       * @param {SBIS3.CONTROLS.Data.Projection.TreeItem} parent Родитель
       * @returns {Array}
       */
      getChildren: function(parent) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает метод конвертации элемета коллеции в элемент проекции
       * @param {SBIS3.CONTROLS.Data.Projection.TreeItem} parent Родитель
       * @returns {Function}
       */
      getItemConverter: function(parent) {
         throw new Error('Method must be implemented');
      }
   };
});
