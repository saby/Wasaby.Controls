/* global define */
define('js!SBIS3.CONTROLS.Data.OneToManyMixin', [
   'js!SBIS3.CONTROLS.Data.Mediator.OneToMany'
], function (OneToManyMediator) {
   'use strict';

   /**
    * Миксин, позволяющий строить отношения "один ко многим" для родителя
    * @mixin SBIS3.CONTROLS.Data.OneToManyMixin
    * @public
    * @author Мальцев Алексей
    */

   var OneToManyMixin = /**@lends SBIS3.CONTROLS.Data.OneToManyMixin.prototype  */{

      //region Protected methods

      /**
       * Добавляет отношение "родитель - ребенок"
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} child Ребенок
       * @param {String} [name] Название отношений
       * @protected
       */
      _addChild: function(child, name) {
         if (child instanceof Object) {
            this._getMediator().addTo(this, child, name);
         }
      },

      /**
       * Удаляет отношение "родитель - ребенок"
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} child Ребенок
       * @protected
       */
      _removeChild: function(child) {
         if (child instanceof Object) {
            this._getMediator().removeFrom(this, child);
         }
      },

      /**
       * Уведомляет детей об изменении экземляра
       * @param {*} [data] Данные об изменениях
       * @protected
       */
      _parentChanged: function(data) {
         this._getMediator().parentChanged(this, data);
      },

      /**
       * Уведомляет всех родителей об изменении экземпляра
       * @param {*} [data] Данные об изменениях
       * @protected
       */
      _childChanged: function (data) {
         this._getMediator().childChanged(this, data, true);
      },

      /**
       * Возвращает посредника для установления отношений с записями
       * @returns {SBIS3.CONTROLS.Mediator.OneToMany}
       * @protected
       */
      _getMediator: function() {
         return OneToManyMediator.getInstance();
      }

      //endregion Protected methods
   };

   return OneToManyMixin;
});
