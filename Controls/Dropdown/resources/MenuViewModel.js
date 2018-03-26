/**
 * Created by as.krasilnikov on 26.12.2017.
 */
define('Controls/Dropdown/resources/MenuViewModel',
   [
      'Core/Abstract',
      'WS.Data/Chain',
      'Controls/List/SimpleList/ItemsViewModel',
      'WS.Data/Relation/Hierarchy'
   ],
   function (Abstract, Chain, ItemsViewModel, Hierarchy) {
      var MenuViewModel = Abstract.extend({
         _itemsModel: null,

         constructor: function (cfg) {
            this._options = cfg;
            MenuViewModel.superclass.constructor.apply(this, arguments);

            this._itemsModel = new ItemsViewModel({
               items: this._getCurrentRootItems(cfg),
               idProperty: cfg.keyProperty, //TODO поменять на keyProperty, как зальют правки
               displayProperty: 'title'
            });
            this._hierarchy = new Hierarchy({
               idProperty: cfg.keyProperty, //TODO поменять на keyProperty, как зальют правки
               parentProperty: cfg.parentProperty,
               nodeProperty: cfg.nodeProperty
            });
         },

         _getCurrentRootItems: function (cfg) {
            if (!cfg.parentProperty || !cfg.nodeProperty) {
               return cfg.items;
            }
            return Chain(cfg.items).filter(function(item) {
               return item.get(cfg.parentProperty) === cfg.rootKey;
            }).value();
         },

         destroy: function () {
            this._itemsModel.destroy();
            this._hierarchy.destroy();
            MenuViewModel.superclass.destroy.apply(this, arguments);
         },

         reset: function () {
            return this._itemsModel.reset();
         },

         isEnd: function () {
            return this._itemsModel.isEnd();
         },

         goToNext: function () {
            return this._itemsModel.goToNext();
         },

         getCurrent: function () {
            var itemsModelCurrent = this._itemsModel.getCurrent();
            itemsModelCurrent.hasChildren = this._hasChildren(itemsModelCurrent.item);
            itemsModelCurrent.isSelected = this._isItemSelected(itemsModelCurrent.item);
            itemsModelCurrent.icon = itemsModelCurrent.item.get('icon');
            itemsModelCurrent.itemTemplateProperty = this._options.itemTemplateProperty;
            itemsModelCurrent.template = itemsModelCurrent.item.get(itemsModelCurrent.itemTemplateProperty);
            return itemsModelCurrent;
         },
         _isItemSelected: function(item) {
            var keys = this._options.selectedKeys;
            // if (keys instanceof Array) {
            //    return keys.indexOf(item.get(this._options.keyProperty)) > -1;
            // }
            return keys == item.get(this._options.keyProperty);
         },
         _hasChildren: function (item) {
            return this._hierarchy.isNode(item) && !!this._hierarchy.getChildren(item, this._options.items).length;
         },
         getCount: function () {
            return this._itemsModel.getCount();
         }
      });

      return MenuViewModel;
   });
