/**
 * Created by kraynovdo on 16.11.2017.
 */
define('Controls/List/SimpleList/ListViewModel',
   ['Core/Abstract', 'Controls/List/SimpleList/ItemsViewModel'],
   function(Abstract, ItemsViewModel) {
      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var ListViewModel = Abstract.extend({

         _itemsModel: null,
         _selectedItem: null,

         constructor: function(cfg) {
            this._options = cfg;
            ListViewModel.superclass.constructor.apply(this, arguments);
            this._itemsModel = new ItemsViewModel({
               items : cfg.items,
               idProperty: cfg.idProperty,
               displayProperty: cfg.displayProperty
            });
            var self = this;
            this._itemsModel.subscribe('onListChange', function() {
               //т.к. при действиях с рекордсетом рекорд может потерять владельца, надо обновить ссылку на актуальный рекорд из текущего набора
               self._selectedItem = self.getItemById(self._options.selectedKey, self._options.idProperty);
               self._notify('onListChange');
            });

            if (cfg.selectedKey !== undefined) {
               this._selectedItem = this.getItemById(cfg.selectedKey, cfg.idProperty);
            }

            this._startIndex = 0;
            this._stopIndex = this._itemsModel.getCount();
         },

         destroy: function() {
            this._itemsModel.destroy();
            ListViewModel.superclass.destroy.apply(this, arguments);
         },

         reset: function() {
            //TODO убрать this._itemsModel._curIndex ?
            this._itemsModel._curIndex = this._startIndex;
         },

         isEnd: function() {
            //TODO убрать this._itemsModel._curIndex ?
            return this._itemsModel._curIndex < this._stopIndex;
         },

         goToNext: function() {
            //TODO убрать this._itemsModel._curIndex ?
            this._itemsModel._curIndex++;
         },

         getCurrent: function() {
            var itemsModelCurrent = this._itemsModel.getCurrent();
            itemsModelCurrent.isSelected = itemsModelCurrent.dispItem == this._selectedItem;
            return itemsModelCurrent;
         },

         getItemById: function(id, idProperty) {
            return this._itemsModel.getItemById(id, idProperty)
         },

         setSelectedKey: function(key) {
            this._selectedItem = this.getItemById(key, this._options.idProperty);
            this._notify('onListChange');
         },

         updateIndexes: function(startIndex, stopIndex) {
            this._startIndex = startIndex;
            this._stopIndex = stopIndex;
            this._notify('onListChange');
         },

         setItems: function(items) {
            this._itemsModel.setItems(items)
         },

         appendItems: function(items) {
            this._itemsModel.appendItems(items);
         },

         prependItems: function(items) {
            this._itemsModel.prependItems(items);
         },

         getCount: function() {
            return this._itemsModel.getCount();
         },

         __calcSelectedItem: function(display, selKey, idProperty) {

            //TODO надо вычислить индекс
            /*if(!this._selectedItem) {
             if (!this._selectedIndex) {
             this._selectedIndex = 0;//переводим на первый элемент
             }
             else {
             this._selectedIndex++;//условно ищем ближайший элемент, рядом с удаленным
             }
             this._selectedItem = this._display.at(this._selectedIndex);
             }*/
         }
      });

      return ListViewModel;
   });
