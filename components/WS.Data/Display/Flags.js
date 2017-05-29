/* global define, require */
define('js!WS.Data/Display/Flags', [
   'js!WS.Data/Display/Collection',
   'js!WS.Data/Di',
   'Core/core-instance',
   'js!WS.Data/Display/FlagsItem'
], function (
   CollectionDisplay,
   Di,
   CoreInstance
) {
   'use strict';

   /**
    * Проекция типа "Флаги".
    * @class WS.Data/Display/Flags
    * @extends WS.Data/Display/Collection
    * @public
    * @author Мальцев Алексей
    */

   var FlagsDisplay = CollectionDisplay.extend([], /** @lends WS.Data/Display/Flags.prototype */{
      _moduleName: 'WS.Data/Display/Flags',

      _itemModule: 'display.flags-item',

      constructor: function $FlagsDisplay(options) {
         FlagsDisplay.superclass.constructor.call(this, options);

         if (!CoreInstance.instanceOfMixin(this._$collection, 'WS.Data/Types/IFlags')) {
            throw new TypeError(this._moduleName + ': source collection should implement WS.Data/Types/IFlags');
         }

         if (CoreInstance.instanceOfMixin(this._$collection, 'WS.Data/Entity/ObservableMixin')) {
            this._$collection.subscribe('onChange', this._onSourceChange);
         }
      },

      destroy: function () {
         if (CoreInstance.instanceOfMixin(this._$collection, 'WS.Data/Entity/ObservableMixin')) {
            this._$collection.unsubscribe('onChange', this._onSourceChange);
         }

         FlagsDisplay.superclass.destroy.call(this);
      },

      _bindHandlers: function() {
         FlagsDisplay.superclass._bindHandlers.call(this);

         this._onSourceChange = _private.onSourceChange.bind(this);
      }
   });

   var _private = {
      /**
       * Обрабатывает событие об изменении состояния Flags
       * @param {$ws.proto.EventObject} event Дескриптор события
       * @param {String} name Название флага
       * @param {Number} index Индекс флага
       * @param {Boolean|Null} value Новое значение флага
       * @private
       */
      onSourceChange: function (event, name, index, value) {
         var item = this.at(this.getIndexBySourceIndex(index));
         this.notifyItemChange(item, 'selected');
      }
   };

   Di.register('display.flags', FlagsDisplay);

   return FlagsDisplay;
});
