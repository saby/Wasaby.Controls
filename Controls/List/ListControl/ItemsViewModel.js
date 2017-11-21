/**
 * Created by kraynovdo on 16.11.2017.
 */
define('js!Controls/List/ListControl/ItemsViewModel',
   ['Core/Abstract', 'js!Controls/List/resources/utils/ItemsUtil'],
   function(Abstract, ItemsUtil) {
      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var ItemsViewModel = Abstract.extend({

         _display: null,
         _curIndex: 0,

         constructor: function(cfg) {
            this._options = cfg;
            ItemsViewModel.superclass.constructor.apply(this, arguments);
            this._onCollectionChangeFnc = this._onCollectionChange.bind(this);
            if (cfg.items) {
               this._display = ItemsUtil.getDefaultDisplayFlat(cfg.items, cfg);
               this._display.subscribe('onCollectionChange', this._onCollectionChangeFnc);
            }
         },

         reset: function() {
            this._curIndex = 0;
         },

         isEnd: function() {
            return this._curIndex < this._display.getCount()
         },

         goToNext: function() {
            this._curIndex++;
         },

         getCurrent: function() {
            var dispItem = this._display.at(this._curIndex);
            return {
               getPropValue: ItemsUtil.getPropertyValue,
               idProperty: this._options.idProperty,
               displayProperty: this._options.displayProperty,
               index : this._curIndex,
               item: dispItem.getContents(),
               dispItem: dispItem
            }
         },

         getItemById: function(id, idProperty) {
            return ItemsUtil.getDisplayItemById(this._display, id, idProperty)
         },

         _onCollectionChange: function() {
            this._notify('onListChange');
         }
      });

      return ItemsViewModel;
   });