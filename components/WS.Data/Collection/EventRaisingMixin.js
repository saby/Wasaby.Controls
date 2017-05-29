/* global define */
define('js!WS.Data/Collection/EventRaisingMixin', [
   'js!WS.Data/Collection/Comparer'
], function (
   Comparer
) {
   'use strict';

   /**
    * Миксин для реализации коллекции, в которой можно приостанавливать генерацию событий об изменениях с фиксацией состояния
    * @mixin WS.Data/Collection/EventRaisingMixin
    * @public
    * @author Мальцев Алексей
    */

   var EventRaisingMixin = /** @lends WS.Data/Collection/EventRaisingMixin.prototype */{
      /**
       * @event onEventRaisingChange После изменения коллекции
       * @param {Boolean} enabled Включена или выключена генерация событий
       * @param {Boolean} analyze Включен или выключен анализ изменений
       */

      /**
       * @member {Boolean} Генерация событий включена
       */
      _eventRaising: true,

      /**
       * @member {String} Метод получения содержимого элемента коллекции (если такое поведение поддерживается)
       */
      _sessionItemContentsGetter: '',

      /**
       * @member {Object|null} Состояние коллекции до выключения генерации событий
       */
      _beforeRaiseOff: null,

      constructor: function $EventRaisingMixin() {
         this._publish('onEventRaisingChange');
      },

      //region Public methods

      /**
       * Включает/выключает генерацию событий об изменении коллекции
       * @param {Boolean} enabled Включить или выключить генерацию событий
       * @param {Boolean} [analyze=false] Анализировать изменения (если включить, то при enabled = true будет произведен анализ всех изменений с момента enabled = false - сгенерируются события обо всех изменениях)
       * @example
       * Сгенерируем событие о перемещении элемента c позиции 1 на позицию 3:
       * <pre>
       *    define(['js!WS.Data/Collection/ObservableList', 'js!WS.Data/Collection/IBind'], function(ObservableList, IBindCollection) {
       *       var list = new ObservableList({
       *          items: ['one', 'two', 'three', 'four', 'five']
       *       });
       *
       *      list.subscribe('onCollectionChange', function(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
       *         action === IBindCollection.ACTION_MOVE;//true
       *
       *         oldItems[0] === 'two';//true
       *         oldItems[0] === item;//true
       *         oldItemsIndex === 1;//true
       *
       *         newItems[0] === 'two';//true
       *         newItems[0] === item;//true
       *         newItemsIndex === 3;//true
       *      });
       *
       *      list.setEventRaising(false, true);
       *      var item = list.removeAt(1);
       *      list.add(item, 3);
       *      list.setEventRaising(true, true);
       *   });
       * </pre>
       */
      setEventRaising: function(enabled, analyze) {
         enabled = !!enabled;
         analyze = !!analyze;
         var isEqual = this._eventRaising === enabled;

         if (analyze && isEqual) {
            throw new Error('The events raising is already ' + (enabled ? 'enabled' : 'disabled') + ' with analize=true');
         }

         if (analyze) {
            if (enabled) {
               this._eventRaising = enabled;
               this._finishUpdateSession(this._beforeRaiseOff);
               this._beforeRaiseOff = null;
            } else {
               this._beforeRaiseOff = this._startUpdateSession();
               this._eventRaising = enabled;
            }
         } else {
            this._eventRaising = enabled;
         }

         if (!isEqual) {
            this._notify('onEventRaisingChange', enabled, analyze);
         }
      },

      /**
       * Возвращает признак, включена ли генерация событий об изменении проекции
       * @return {Boolean}
       */
      isEventRaising: function() {
         return this._eventRaising;
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Запускает серию обновлений
       * @return {Object}
       * @protected
       */
      _startUpdateSession: function () {
         if (!this._eventRaising) {
            return null;
         }
         return Comparer.startSession(this, this._sessionItemContentsGetter);
      },

      /**
       * Завершает серию обновлений, генерирует события об изменениях
       * @param {Object} session Серия обновлений
       * @protected
       */
      _finishUpdateSession: function (session, onBeforeAnalize) {
         if (!session) {
            return;
         }
         Comparer.finishSession(session, this, this._sessionItemContentsGetter);

         if (onBeforeAnalize) {
            onBeforeAnalize.call(this);
         }

         Comparer.analizeSession(session, this, (function(action, changes) {
            this._notifyCollectionChange(
               action,
               changes.newItems,
               changes.newItemsIndex,
               changes.oldItems,
               changes.oldItemsIndex,
               session
            );
         }).bind(this));
      },

      /**
       * Генерирует событие об изменении коллекции
       * @param {String} action Действие, приведшее к изменению.
       * @param {Array} newItems Новые исходной коллекции.
       * @param {Number} newItemsIndex Индекс коллекции, в котором появились новые элементы.
       * @param {Array} oldItems Удаленные элементы коллекции.
       * @param {Number} oldItemsIndex Индекс коллекции, в котором удалены элементы.
       * @protected
       */
      _notifyCollectionChange: function (action, newItems, newItemsIndex, oldItems, oldItemsIndex) {
         if (!this._isNeedNotifyCollectionChange()) {
            return;
         }
         
         this._notify(
            'onCollectionChange',
            action,
            newItems,
            newItemsIndex,
            oldItems,
            oldItemsIndex
         );
      },

      /**
       * Возвращает признак, что нужно генерировать события об изменениях коллекции
       * @return {Boolean}
       * @protected
       */
      _isNeedNotifyCollectionChange: function () {
         return this._eventRaising && this.hasEventHandlers('onCollectionChange');
      }
      
      //endregion Protected methods

   };

   return EventRaisingMixin;
});
