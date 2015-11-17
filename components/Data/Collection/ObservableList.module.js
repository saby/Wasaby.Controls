/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.ObservableList', [
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableListMixin'
], function (List, IBindCollection, ObservableListMixin) {
   'use strict';

   /**
    * Список, в котором можно отслеживать изменения.
    * @class SBIS3.CONTROLS.Data.Collection.ObservableList
    * @extends SBIS3.CONTROLS.Data.Collection.List
    * @mixes SBIS3.CONTROLS.Data.Bind.ICollection
    * @mixes SBIS3.CONTROLS.Data.Bind.IProperty
    * @mixes SBIS3.CONTROLS.Data.Collection.ObservableListMixin
    * @public
    * @author Мальцев Алексей
    */

   var ObservableList = List.extend([IBindCollection, IBindProperty, ObservableListMixin], /** @lends SBIS3.CONTROLS.Data.Collection.ObservableList.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.ObservableList'
   });

   return ObservableList;
});
