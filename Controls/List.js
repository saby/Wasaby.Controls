/**
 * Created by kraynovdo on 31.01.2018.
 */
define('Controls/List', [
   'Core/Control',
   'tmpl!Controls/List/SimpleList',
   'Controls/List/SimpleList/ListViewModel',
   'Controls/List/SimpleList/ListView'
], function (Control,
             ListControlTpl,
             ListViewModel
) {
   'use strict';

   var _private = {
      createListModel: function(cfg) {
         return new ListViewModel ({
            items : cfg.items,
            idProperty: cfg.idProperty,
            displayProperty: cfg.displayProperty,
            markedKey: cfg.markedKey,
            itemsReadyCallback: cfg.itemsReadyCallback
         });
      }
   };

   /**
    * Компонент плоского списка, с произвольным шаблоном отображения каждого элемента. Обладает возможностью загрузки/подгрузки данных из источника.
    * @class Controls/List
    * @extends Controls/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IListControl
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

      //TODO пока спорные параметры
      _filter: undefined,
      _sorting: undefined,

      _itemTemplate: null,

      _loadOffset: 100,
      _topPlaceholderHeight: 0,
      _bottomPlaceholderHeight: 0,

      _beforeMount: function(newOptions) {
         this._viewModel = _private.createListModel(newOptions);
      },

      _afterMount: function() {

      },


      _beforeUpdate: function(newOptions) {
         if (newOptions.items && (newOptions.items !== this._options.items)) {
            this._viewModel.setItems(newOptions.items);
         } else if (newOptions.markedKey !== this._options.markedKey) {
            this._viewModel.setMarkedKey(newOptions.markedKey);
         }
      },

      remove: function(items) {
         this._children.sourceControl.remove(items);
      }
   });

   //TODO https://online.sbis.ru/opendoc.html?guid=17a240d1-b527-4bc1-b577-cf9edf3f6757
   /*ListView.getOptionTypes = function getOptionTypes(){
    return {
    dataSource: Types(ISource)
    }
    };*/
   ListControl._private = _private;
   return ListControl;
});