define('Controls/Input/Dropdown',
   [
      'Core/Control',
      'tmpl!Controls/Input/Dropdown/Dropdown',
      'tmpl!Controls/Input/Dropdown/resources/defaultContentTemplate',
      'Controls/Controllers/SourceController',
      'Controls/Input/Dropdown/Util',
      'Controls/Dropdown/DropdownUtils',
      'css!Controls/Input/Dropdown/Dropdown'
   ],
   function (Control, template, defaultContentTemplate, SourceController, dropdownUtil, DropdownUtils) {

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

      var DropdownList = Control.extend({
         _template: template,
         _defaultContentTemplate: defaultContentTemplate,
         constructor: function (config) {
            DropdownList.superclass.constructor.apply(this, arguments);
            this._onResult = this._onResult.bind(this);
         },
         _beforeMount: function (options, context, receivedState) {
            return DropdownUtils._beforeMount(this, options.source, options.selectedKeys, receivedState);
         },
         _beforeUpdate: function (newOptions) {
            return DropdownUtils._beforeUpdate(this, newOptions);
         },
         _updateText: function (item, displayProperty) {
            return DropdownUtils._updateText(item, displayProperty); //По стандарту если есть иконка - текст не отображается
         },
         _open: function () {
             dropdownUtil.open(this, this._children.popupTarget);
         },
         _onResult: function (args) {
            var actionName = args[0];
            var event = args[1];
            var data = args[2];
            switch (actionName) {
               case 'itemClick':
                  this._selectItem.apply(this, data);
                  this._children.DropdownOpener.close();
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