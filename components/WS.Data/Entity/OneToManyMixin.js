/* global define */
define('js!WS.Data/Entity/OneToManyMixin', [
   'js!WS.Data/Mediator/OneToMany'
], function (
   OneToManyMediator
) {
   'use strict';

   /**
    * Миксин, позволяющий строить отношения "один ко многим"
    * @mixin WS.Data/Entity/OneToManyMixin
    * @public
    * @ignoreOptions ownerShip
    * @author Мальцев Алексей
    */

   var OneToManyMixin = /**@lends WS.Data/Entity/OneToManyMixin.prototype  */{
      _wsDataEntityOneToManyMixin: true,

      /**
       * @cfg {Boolean} Устанавливать себя владельцем для добавляемых детей
       * @name WS.Data/Entity/OneToManyMixin#ownerShip
       * @deprecated
       */
      _$ownerShip: true,//TODO: выпилить как будет связь многие ко многим

      /**
       * @member {SBIS3.CONTROLS.Mediator.OneToMany} Медиатор, отвечающий за связи
       */
      _mediator: null,

      //region Public methods

      destroy: function() {
         var mediator = this._getMediator(),
            child,
            children = [],
            i,
            count;

         if (this._$ownerShip) {
            mediator.each(this, function(child) {
               children.push(child);
            });
         }

         mediator.clear(this);

         for (i = 0, count = children.length; i < count; i++) {
            child = children[i];
            if (child.destroy) {
               child.destroy();
            }
         }

         this._setMediator(null);
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Добавляет отношение "родитель - ребенок"
       * @param {WS.Data/Mediator/IReceiver} child Ребенок
       * @param {String} [name] Название отношений
       * @protected
       */
      _addChild: function(child, name) {
         if (this._$ownerShip && (child instanceof Object)) {
            var mediator = this._getMediator();
            mediator.addTo(this, child, name);

            //child._wsDataEntityOneToManyMixin is equal to CoreInstance.instanceOfMixin(child, 'WS.Data/Entity/OneToManyMixin')
            if (child._wsDataEntityOneToManyMixin && !child._hasSameMediator(mediator)) {
               if (child._hasMediator()) {
                  child._getMediator().addTo(this, child, name);
               } else {
                  child._setMediator(mediator);
               }
            }
         }
      },

      /**
       * Удаляет отношение "родитель - ребенок"
       * @param {WS.Data/Mediator/IReceiver} child Ребенок
       * @protected
       */
      _removeChild: function(child) {
         if (this._$ownerShip && (child instanceof Object)) {
            var mediator = this._getMediator();
            mediator.removeFrom(this, child);

            //child._wsDataEntityOneToManyMixin is equal to CoreInstance.instanceOfMixin(child, 'WS.Data/Entity/OneToManyMixin')
            if (child._wsDataEntityOneToManyMixin && !child._hasSameMediator(mediator)) {
               if (child._hasMediator()) {
                  child._getMediator().removeFrom(this, child);
               }
            }
         }
      },

      /**
       * Уведомляет детей об изменении родителя
       * @param {*} [data] Данные об изменениях
       * @protected
       */
      _parentChanged: function(data) {
         this._getMediator().parentChanged(this, data);
      },

      /**
       * Уведомляет всех родителей об изменении ребенка
       * @param {*} [data] Данные об изменениях
       * @protected
       */
      _childChanged: function (data) {
         var mediator = this._getMediator(),
            child = this,
            parent;

         while ((parent = mediator.getParent(child))) {
            mediator = parent._getMediator();
            mediator.childChanged(child, data);
            child = parent;
         }
      },

      /**
       * Возвращает признак наличия посредника
       * @return {Boolean}
       * @protected
       */
      _hasMediator: function(mediator) {
         return !!this._mediator;
      },

      /**
       * Возвращает признак наличия того же посредника
       * @param {SBIS3.CONTROLS.Mediator.OneToMany} mediator
       * @return {Boolean}
       * @protected
       */
      _hasSameMediator: function(mediator) {
         return this._mediator === mediator;
      },

      /**
       * Возвращает посредника для установления отношений с детьми
       * @return {SBIS3.CONTROLS.Mediator.OneToMany}
       * @protected
       */
      _getMediator: function() {
         return this._mediator || (this._mediator = new OneToManyMediator());
      },

      /**
       * Устанавливает посредника для установления отношений с детьми
       * @param {SBIS3.CONTROLS.Mediator.OneToMany|null} mediator
       * @protected
       */
      _setMediator: function(mediator) {
         this._mediator = mediator;
      }

      //endregion Protected methods
   };

   return OneToManyMixin;
});
