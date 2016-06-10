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
       * @member {SBIS3.CONTROLS.Mediator.OneToMany} Медиатор, отвечающий за связь с родителем
       */
      _mediator: null,

      /**
       * Добавляет отношение "родитель - ребенок"
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} child Ребенок
       * @param {String} [name] Название отношений
       * @protected
       */
      _addChild: function(child, name) {
         if (child instanceof Object) {
            var mediator = this._getMediator();
            //Вместо $ws.helpers.instanceOfMixin(child, 'SBIS3.CONTROLS.Data.OneToManyMixin') т.к. важна скорость
            if (child._setMediator) {
               child._setMediator(mediator);
            }
            mediator.addTo(this, child, name);
         }
      },

      /**
       * Удаляет отношение "родитель - ребенок"
       * @param {SBIS3.CONTROLS.Data.Mediator.IReceiver} child Ребенок
       * @protected
       */
      _removeChild: function(child) {
         if (child instanceof Object) {
            var mediator = this._getMediator();
            mediator.removeFrom(this, child);
            //Вместо $ws.helpers.instanceOfMixin(child, 'SBIS3.CONTROLS.Data.OneToManyMixin') т.к. важна скорость
            if (child._setMediator) {
               child._setMediator(null);
            }
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
       * Возвращает посредника для установления отношений с детьми
       * @returns {SBIS3.CONTROLS.Mediator.OneToMany}
       * @protected
       */
      _getMediator: function() {
         return this._mediator || (this._mediator = new OneToManyMediator());
      },

      /**
       * Устанавливает посредника для установления отношений с детьми
       * @param {SBIS3.CONTROLS.Mediator.OneToMany} mediator
       * @protected
       */
      _setMediator: function(mediator) {
         this._mediator = mediator;
      }

      //endregion Protected methods
   };

   return OneToManyMixin;
});
