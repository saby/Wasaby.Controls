/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Collection.LoadableList', [
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Bind.ICollection',
   'js!SBIS3.CONTROLS.Data.Bind.IProperty',
   'js!SBIS3.CONTROLS.Data.Query.IQueryable',
   'js!SBIS3.CONTROLS.Data.Collection.ISourceLoadable',
   'js!SBIS3.CONTROLS.Data.Collection.ObservableListMixin',
   'js!SBIS3.CONTROLS.Data.Collection.LoadableListMixin'
], function (List, IBindCollection, IBindProperty, IQueryable, ISourceLoadable, ObservableListMixin, LoadableListMixin) {
   'use strict';

   /**
    * Список, загружаемый через источник данных
    * @class SBIS3.CONTROLS.Data.Collection.LoadableList
    * @extends SBIS3.CONTROLS.Data.Collection.List
    * @mixes SBIS3.CONTROLS.Data.Bind.ICollection
    * @mixes SBIS3.CONTROLS.Data.Bind.IProperty
    * @mixes SBIS3.CONTROLS.Data.Collection.ObservableListMixin
    * @mixes SBIS3.CONTROLS.Data.Query.IQueryable
    * @mixes SBIS3.CONTROLS.Data.Collection.ISourceLoadable
    * @mixes SBIS3.CONTROLS.Data.Collection.LoadableListMixin
    * @public
    * @author Мальцев Алексей
    */

   var LoadableList = List.extend([IBindCollection, IBindProperty, ObservableListMixin, IQueryable, ISourceLoadable, LoadableListMixin], /** @lends SBIS3.CONTROLS.Data.Collection.LoadableList.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Collection.LoadableList'
   });

   return LoadableList;
});
