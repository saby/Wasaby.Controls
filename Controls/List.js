/**
 * Created by kraynovdo on 31.01.2018.
 */
define('Controls/List', [
   'Core/Control',
   'wml!Controls/List/List',
   'Controls/List/ListViewModel',
   'Core/Deferred',
   'Controls/Utils/tmplNotify',
   'Controls/List/ListView',
   'Controls/List/ListControl'
], function(
   Control,
   ListControlTpl,
   ListViewModel,
   Deferred,
   tmplNotify
) {
   'use strict';

   /**
    * Plain list with custom item template. Can load data from data source.
    *
    * @class Controls/List
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IListControl
    * @mixes Controls/interface/IEditableList
    * @control
    * @author Авраменко А.С.
    * @public
    * @category List
    */

   var ListControl = Control.extend(/** @lends Controls/List.prototype */{
      _template: ListControlTpl,
      _viewName: 'Controls/List/ListView',
      _viewTemplate: 'Controls/List/ListControl',
      _viewModelConstructor: null,

      _beforeMount: function() {
         this._viewModelConstructor = this._getModelConstructor();
      },

      _getModelConstructor: function() {
         return ListViewModel;
      },

      reload: function() {
         this._children.listControl.reload();
      },

      beginEdit: function(options) {
         return this._options.readOnly ? Deferred.fail() : this._children.listControl.beginEdit(options);
      },

      beginAdd: function(options) {
         return this._options.readOnly ? Deferred.fail() : this._children.listControl.beginAdd(options);
      },

      cancelEdit: function() {
         return this._options.readOnly ? Deferred.fail() : this._children.listControl.cancelEdit();
      },

      commitEdit: function() {
         return this._options.readOnly ? Deferred.fail() : this._children.listControl.commitEdit();
      },

      _notifyHandler: tmplNotify
   });

   ListControl.getDefaultOptions = function() {
      return {
         multiSelectVisibility: 'hidden',
         style: 'default',
         markItemByExpanderClick: true
      };
   };

   return ListControl;
});
