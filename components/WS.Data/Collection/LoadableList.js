/* global define */
define('js!WS.Data/Collection/LoadableList', [
   'js!WS.Data/Collection/List',
   'js!WS.Data/Collection/IBind',
   'js!WS.Data/Query/IQueryable',
   'js!WS.Data/Collection/ISourceLoadable',
   'js!WS.Data/Collection/ObservableListMixin',
   'js!WS.Data/Collection/LoadableListMixin'
], function (
   List,
   IBindCollection,
   IQueryable,
   ISourceLoadable,
   ObservableListMixin,
   LoadableListMixin
) {
   'use strict';

   /**
    * Список, загружаемый через источник данных
    * @class WS.Data/Collection/LoadableList
    * @extends WS.Data/Collection/List
    * @implements WS.Data/Collection/IBind
    * @mixes WS.Data/Collection/ObservableListMixin
    * @implements WS.Data/Query/IQueryable
    * @implements WS.Data/Collection/ISourceLoadable
    * @mixes WS.Data/Collection/LoadableListMixin
    * @author Мальцев Алексей
    */

   var LoadableList = List.extend([IBindCollection, ObservableListMixin, IQueryable, ISourceLoadable, LoadableListMixin], /** @lends WS.Data/Collection/LoadableList.prototype */{
      _moduleName: 'WS.Data/Collection/LoadableList'
   });

   return LoadableList;
});
