define('Controls/Explorer', [
   'Core/Control',
   'tmpl!Controls/Explorer/Explorer',
   'WS.Data/Entity/VersionableMixin',
   'Controls/TreeGrid',
   'Controls/BreadCrumbs/Path'
], function(Control, template) {
   'use strict';

   var _private = {
      setRoot: function(self, item) {
         self._root = item.getId();
      },
      dataLoadCallback: function(self, data) {
         var
            path = data.getMetaData().path;
         if (path) {
            self._breadCrumbsItems = data.getMetaData().path;
         } else {
            self._breadCrumbsItems = [];
         }
      }
   };

   /**
    * Hierarchical list that can expand and go inside the folders. Can load data from data source.
    *
    * @class Controls/Explorer
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IListControl
    * @mixes Controls/List/interface/IHierarchy
    * @mixes Controls/List/interface/ITreeControl
    * @mixes Controls/List/interface/IExplorer
    * @control
    * @public
    * @category List
    */

   var Explorer = Control.extend({
      _template: template,
      _breadCrumbsItems: null,
      _root: null,
      constructor: function() {
         this._crumbs = [];
         this._dataLoadCallback = _private.dataLoadCallback.bind(null, this);
         return Explorer.superclass.constructor.apply(this, arguments);
      },
      _onItemClick: function(event, item) {
         _private.setRoot(this, item);
      },
      _onBreadCrumbsArrowActivated: function() {

      },
      _onBreadCrumbsClick: function() {

      }
   });
   return Explorer;
});
