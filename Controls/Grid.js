define('Controls/Grid', [
   'Core/Control',
   'Controls/List/Grid/GridViewModel',
   'tmpl!Controls/List/Grid/Grid',
   'Controls/List/Grid/GridView',
   'Controls/List/SourceControl'
], function(Control, GridViewModel, GridTpl) {

   'use strict';

   /**
    * Компонент плоского списка, отображаемого в виде таблицы. Обладает возможностью загрузки/подгрузки данных из источника.
    *
    * @class Controls/Grid
    * @extends Controls/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/ISingleSelectable
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IListControl
    * @mixes Controls/List/interface/IGridControl
    * @control
    * @public
    * @category List
    */

   var
      _private = {
         createViewModel: function(cfg) {
            return new GridViewModel({
               items: cfg.items,
               columns: cfg.columns,
               header: cfg.header,
               results: cfg.results,
               showRowSeparator: cfg.showRowSeparator,
               idProperty: cfg.idProperty,
               displayProperty: cfg.displayProperty,
               markedKey: cfg.markedKey,
               multiselect: cfg.multiselect,
               rowSpacing: cfg.rowSpacing,
               leftPadding: cfg.leftPadding,
               rightPadding: cfg.rightPadding,
               stickyFields: cfg.stickyFields
            });
         },
         prepareViewConfig: function(cfg) {
            return {
               items: cfg.items,
               columns: cfg.columns,
               header: cfg.header,
               results: cfg.results,
               showRowSeparator: cfg.showRowSeparator,
               idProperty: cfg.idProperty,
               displayPropert: cfg.displayProperty,
               markedKey: cfg.markedKey,
               multiselect: cfg.multiselect,
               rowSpacing: cfg.rowSpacing,
               leftPadding: cfg.leftPadding,
               rightPadding: cfg.rightPadding,
               stickyFields: cfg.stickyFields,
               itemTemplate: cfg.itemTemplate,
               displayProperty: cfg.displayProperty
            };
         }
      },
      Grid = Control.extend({
         _template: GridTpl,
         _viewConfig: null,
         _listViewModel: null,
         _beforeMount: function(cfg) {
            Grid.superclass._beforeMount.apply(this, arguments);
            this._viewConfig = _private.prepareViewConfig(cfg);
            this._listViewModel = _private.createViewModel(cfg);
         }
      });

   return Grid;
});
