/**
 * Created by kraynovdo on 31.01.2018.
 */
define('Controls/List', [
   'Core/Control',
   'tmpl!Controls/List/List',
   'Controls/List/ListViewModel',
   'Controls/List/ListView',
   'Controls/List/ListControl'
], function(Control,
   ListControlTpl,
   ListViewModel
) {
   'use strict';

   /**
    * Plain list with custom item template. Can load data from data source.
    *
    * @class Controls/List
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/interface/IReorderMovable
    * @mixes Controls/List/interface/IListControl
    * @mixes Controls/interface/IRemovable
    * @mixes Controls/interface/IEditInPlace
    * @control
    * @author Крайнов Д.О.
    * @public
    * @category List
    */

   var ListControl = Control.extend({
      _template: ListControlTpl,

      _items: null,

      _loader: null,
      _loadingState: null,
      _loadingIndicatorState: null,
      _viewName: 'Controls/List/ListView',
      _viewTemplate: 'Controls/List/ListControl',

      //TODO пока спорные параметры
      _filter: undefined,
      _sorting: undefined,

      _itemTemplate: null,

      _loadOffset: 100,
      _topPlaceholderHeight: 0,
      _bottomPlaceholderHeight: 0,

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


      /**
       * Starts editing in place.
       * @param {ItemEditOptions} options Options of editing.
       * @returns {Core/Deferred}
       */
      editItem: function(options) {
         this._children.listControl.editItem(options);
      },

      /**
       * Starts adding.
       * @param {AddItemOptions} options Options of adding.
       * @returns {Core/Deferred}
       */
      addItem: function(options) {
         this._children.listControl.addItem(options);
      },

      _onBeforeItemAdd: function(e, options) {
         return this._notify('beforeItemAdd', [options]);
      },

      _onBeforeItemEdit: function(e, options) {
         return this._notify('beforeItemEdit', [options]);
      },

      _onAfterItemEdit: function(e, item, isAdd) {
         this._notify('afterItemEdit', [item, isAdd]);
      },

      _onBeforeItemEndEdit: function(e, item, commit, isAdd) {
         return this._notify('beforeItemEndEdit', [item, commit, isAdd]);
      },

      _onAfterItemEndEdit: function(e, item, isAdd) {
         this._notify('afterItemEndEdit', [item, isAdd]);
      },

      _beforeItemsRemove: function(event, items) {
         return this._notify('beforeItemsRemove', [items]);
      },

      _afterItemsRemove: function(event, items, result) {
         this._notify('afterItemsRemove', [items, result]);
      },

      removeItems: function(items) {
         this._children.listControl.removeItems(items);
      },

      moveItemUp: function(item) {
         this._children.listControl.moveItemUp(item);
      },

      moveItemDown: function(item) {
         this._children.listControl.moveItemDown(item);
      },

      moveItems: function(items, target, position) {
         this._children.listControl.moveItems(items, target, position);
      },

      _beforeItemsMove: function(event, items, target, position) {
         return this._notify('beforeItemsMove', [items, target, position]);
      },

      _afterItemsMove: function(event, items, target, position, result) {
         this._notify('afterItemsMove', [items, target, position, result]);
      },

      _dragStart: function(event, items) {
         return this._notify('dragStart', [items]);
      },

      _dragEnd: function(event, items, target, position) {
         return this._notify('dragEnd', [items, target, position]);
      }
   });

   //TODO https://online.sbis.ru/opendoc.html?guid=17a240d1-b527-4bc1-b577-cf9edf3f6757
   /*ListView.getOptionTypes = function getOptionTypes(){
    return {
    dataSource: Types(ISource)
    }
    };*/
   return ListControl;
});
