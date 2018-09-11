define('Controls/Explorer', [
   'Core/Control',
   'wml!Controls/Explorer/Explorer',
   'css!Controls/Explorer/Explorer',
   'WS.Data/Entity/VersionableMixin',
   'Controls/TreeGrid',
   'Controls/BreadCrumbs/Path'
], function(Control, template) {
   'use strict';

   var
      _private = {
         setRoot: function(self, root) {
            self._root = root;
         },
         dataLoadCallback: function(self, data) {
            var
               path = data.getMetaData().path;
            if (path) {
               self._breadCrumbsItems = data.getMetaData().path;
            } else {
               self._breadCrumbsItems = [];
            }
            self._breadCrumbsVisibility = !!self._breadCrumbsItems.length;
            self._forceUpdate();
            if (self._options.dataLoadCallback) {
               self._options.dataLoadCallback(data);
            }
         }
      };

   /**
    * Hierarchical list that can expand and go inside the folders. Can load data from data source.
    *
    * @class Controls/Explorer
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/interface/IMultiSelectable
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
      _breadCrumbsVisibility: false,
      _root: null,
      constructor: function() {
         this._breadCrumbsItems = [];
         this._dataLoadCallback = _private.dataLoadCallback.bind(null, this);
         return Explorer.superclass.constructor.apply(this, arguments);
      },
      _onItemClick: function(event, item) {
         if (item.get(this._options.nodeProperty) !== null) {
            _private.setRoot(this, item.getId());
         }
      },
      _onBreadCrumbsClick: function(event, item, setPreviousNode) {
         _private.setRoot(this, item[setPreviousNode ? this._options.parentProperty : this._options.keyProperty]);
      },
      _notifyHandler: function(e, eventName) {
         return this._notify(eventName, Array.prototype.slice.call(arguments, 2));
      }
   });

   Explorer._private = _private;

   Explorer.getDefaultOptions = function() {
      return {
         multiSelectVisibility: 'hidden'
      };
   };

   return Explorer;
});
