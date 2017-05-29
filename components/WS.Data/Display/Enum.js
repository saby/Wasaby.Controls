/* global define, require */
define('js!WS.Data/Display/Enum', [
   'js!WS.Data/Display/Collection',
   'js!WS.Data/Di',
   'Core/core-instance'
], function (
   CollectionDisplay,
   Di,
   CoreInstance
) {
   'use strict';

   /**
    * Проекция типа "Перечисляемое".
    * @class WS.Data/Display/Enum
    * @extends WS.Data/Display/Collection
    * @public
    * @author Ганшнин Ярослав
    */

   var EnumDisplay = CollectionDisplay.extend([], /** @lends WS.Data/Display/Enum.prototype */{
      _moduleName: 'WS.Data/Display/Enum',

      /**
       * @member {Function} Обработчик события об изменении текущего индекса Enum
       */
      _onSourceChange: null,

      constructor: function $EnumDisplay(options) {
         EnumDisplay.superclass.constructor.call(this, options);

         if (!CoreInstance.instanceOfMixin(this._$collection, 'WS.Data/Types/IEnum')) {
            throw new TypeError(this._moduleName + ': source collection should implement WS.Data/Types/IEnum');
         }

         this._getCursorEnumerator().setPosition(this.getIndexBySourceIndex(this._$collection.get()));

         if (CoreInstance.instanceOfMixin(this._$collection, 'WS.Data/Entity/ObservableMixin')) {
            this._$collection.subscribe('onChange', this._onSourceChange);
         }
      },

      destroy: function () {
         if (CoreInstance.instanceOfMixin(this._$collection, 'WS.Data/Entity/ObservableMixin')) {
            this._$collection.unsubscribe('onChange', this._onSourceChange);
         }

         EnumDisplay.superclass.destroy.call(this);
      },

      _bindHandlers: function() {
         EnumDisplay.superclass._bindHandlers.call(this);

         this._onSourceChange = _private.onSourceChange.bind(this);
      },

      _notifyCurrentChange: function(newCurrent, oldCurrent, newPosition, oldPosition) {
         this._$collection.set(this.getSourceIndexByIndex(newPosition));

         EnumDisplay.superclass._notifyCurrentChange.apply(this, arguments);
      }
   });

   var _private = {
      /**
       * Обрабатывает событие об изменении текущего индекса Enum
       * @param {$ws.proto.EventObject} event Дескриптор события
       * @param {Number} index Новый индекс
       * @param {String} value Новое значение
       * @private
       */
      onSourceChange: function (event, index, value) {
         this.setCurrentPosition(this.getIndexBySourceIndex(index));
      }
   };

   Di.register('display.enum', EnumDisplay);

   return EnumDisplay;
});
