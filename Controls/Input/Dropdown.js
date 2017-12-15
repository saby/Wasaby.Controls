define('Controls/Input/Dropdown',
   [
      'Core/Control',
      'tmpl!Controls/Input/Dropdown/Dropdown',
      'WS.Data/Collection/RecordSet',
      'Controls/Controllers/SourceController',
      'css!Controls/Input/Dropdown/Dropdown'
   ],
   function (Control, template, RecordSet, SourceController) {

      /**
       * Поле выбора из значения списка.
       * @class Controls/Input/Dropdown
       * @extends Controls/Control
       * @mixes Controls/interface/ISource
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/interface/ISingleSelectable
       * @mixes Controls/Input/interface/IDropdownEmptyValue
       * @control
       * @public
       * @category Input
       */

      'use strict';

      var _private = {
         getText: function (selectedItems) {
            var text = selectedItems[0].get('title');
            if (selectedItems.length > 1) {
               text += ' и еще' + (selectedItems.length - 1)
            }
            return text;
         },
         initItems: function(source, instance) {
            instance._sourceController = new SourceController({
               source: source
            });
            return instance._sourceController.load();
         },
         updateSelectedTextAndIcon: function (instance, selectedKeys) {
            var selectedItem = instance._items.getRecordById(selectedKeys);
            instance._icon = selectedItem.get('icon');
            instance._text = instance._icon ? '' : this.getText([selectedItem], 'title'); //По стандарту если есть иконка - текст не отображается
         }
      };

      var DropdownList = Control.extend({
         _template: template,
         _controlName: 'Controls/Dropdown/Dropdown',
         constructor: function (config) {
            DropdownList.superclass.constructor.apply(this, arguments);
            this._onResult = this._onResult.bind(this);
         },
         _beforeMount: function(options, context, receivedState) {
            if (receivedState) {
               this._items = receivedState;
            }
            if (options.source) {
               return _private.initItems(options.source, this).addCallback(function(items){
                  this._items = items;
                  _private.updateSelectedTextAndIcon(this, this._options.selectedKeys);
               }.bind(this))
            }
         },
         _beforeUpdate: function(newOptions) {
            if (newOptions.selectedKeys && newOptions.selectedKeys !== this._options.selectedKeys) {
               _private.updateSelectedTextAndIcon(this, newOptions.selectedKeys);
            }
            if (newOptions.source && newOptions.source !== this._options.source) {
               return _private.initItems(newOptions.source, this).addCallback(function(items){
                  this._items = items;
                  _private.updateSelectedTextAndIcon(this, newOptions.selectedKeys);
                  this._forceUpdate();
               }.bind(this))
            }
         },
         _open: function () {
            var config = {
               componentOptions: {
                  items: this._items,
               },
               target: this._children.popupTarget
            };
            this._children.MenuOpener.open(config, this);
         },
         _onResult: function (args) {
            var actionName = args[0];
            var event = args[1];
            var data = args[2];
            switch (actionName) {
               case 'itemClick':
                  this._selectItem.apply(this, data);
                  this._children.MenuOpener.close();
                  break;
               case 'footerClick':
                  this._notify('footerClick', [event]);
            }
         },
         _selectItem: function (item) {
            var key = item.get(this._options.keyProperty);
            this._notify('selectedKeysChanged', [key]);
         }
      });

      return DropdownList;
   }
);