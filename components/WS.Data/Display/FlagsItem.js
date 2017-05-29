/* global define, require */
define('js!WS.Data/Display/FlagsItem', [
   'js!WS.Data/Display/CollectionItem',
   'js!WS.Data/Di'
], function (
   CollectionItem,
   Di
) {
   'use strict';

   /**
    * Элемент коллекции
    * @class WS.Data/Display/FlagsItem
    * @extends WS.Data/Display/CollectionItem
    * @public
    * @author Мальцев Алексей
    */
   var FlagsItem = CollectionItem.extend(/** @lends WS.Data/Display/FlagsItem.prototype */{
      _moduleName: 'WS.Data/Display/FlagsItem',

      //region Public methods

      isSelected: function () {
         return this._$owner.getCollection().get(this._$contents);
      },

      setSelected: function (selected, silent) {
         if (this.isSelected() === selected) {
            return;
         }
         this._$owner.getCollection().set(this._$contents, selected);
      }

      //endregion Public methods

      //region Protected methods

      //endregion Protected methods
   });

   Di.register('display.flags-item', FlagsItem);

   return FlagsItem;
});
