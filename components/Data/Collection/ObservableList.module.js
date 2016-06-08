/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ObservableList', [
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Mediator.IReceiver',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection',
   'js!SBIS3.CONTROLS.Data.SerializableMixin',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableListMixin',
   'js!SBIS3.CONTROLS.Data.Di'
], function (
   List,
   IMediatorReceiver,
   IBindCollection,
   SerializableMixin,
   ObservableListMixin,
   Di
) {
   'use strict';

   /**
    * Список, в котором можно отслеживать изменения.
    * @class SBIS3.CONTROLS.Data.Collection.ObservableList
    * @extends SBIS3.CONTROLS.Data.Collection.List
    * @mixes SBIS3.CONTROLS.Data.Bind.ICollection
    * @mixes SBIS3.CONTROLS.Data.Mediator.IReceiver
    * @mixes SBIS3.CONTROLS.Data.Collection.ObservableListMixin
    * @public
    * @author Мальцев Алексей
    */

   var ObservableList = List.extend([IBindCollection, IMediatorReceiver, ObservableListMixin], /** @lends SBIS3.CONTROLS.Data.Collection.ObservableList.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.ObservableList',

      constructor: function $ObservableList(options) {
         ObservableList.superclass.constructor.call(this, options);
         ObservableListMixin.constructor.call(this, options);
      },

      //region SBIS3.CONTROLS.Data.Mediator.IReceiver

      relationChanged: function (which, name, data) {
         /*var index = this.getIndex(which);
         if (index > -1) {
            this.notifyItemChange(which, data);
         }*/
      }

      //endregion SBIS3.CONTROLS.Data.Mediator.IReceiver
   });

   SerializableMixin._checkExtender(ObservableList);

   Di.register('collection.observable-list', ObservableList);

   return ObservableList;
});
