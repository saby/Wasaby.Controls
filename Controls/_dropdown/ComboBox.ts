import Control = require('Core/Control');
import template = require('wml!Controls/_dropdown/ComboBox/ComboBox');
import Utils = require('Types/util');
import dropdownUtils = require('Controls/_dropdown/Util');
import tmplNotify = require('Controls/Utils/tmplNotify');

var getPropValue = Utils.object.getPropertyValue.bind(Utils);

var _private = {
   popupVisibilityChanged: function (state) {
      this._isOpen = state;
      this._forceUpdate();
   },
   //FIXME delete after https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
   getContainerNode: function(container:[HTMLElement]|HTMLElement):HTMLElement {
      return container[0] || container;
   }
};

/**
 * Control that shows list of options. In the default state, the list is collapsed, showing only one choice.
 * The full list of options is displayed when you click on the control.
 * <a href="/materials/demo-ws4-input-combobox">Demo-example</a>.
 * @class Controls/_dropdown/ComboBox
 * @extends Core/Control
 * @mixes Controls/_interface/ISource
 * @mixes Controls/interface/IItemTemplate
 * @mixes Controls/interface/IFilter
 * @mixes Controls/_interface/ISingleSelectable
 * @mixes Controls/interface/IDropdownEmptyText
 * @mixes Controls/interface/IInputBase
 * @mixes Controls/interface/IDropdown
 * @css @margin-top_ComboBox-popup Offset on the top for pop-up.
 * @css @spacing_ComboBox-between-arrow-rightBorder Spacing between arrow and right border of field.
 * @control
 * @public
 * @category Input
 * @author Золотова Э.Е.
 * @demo Controls-demo/Input/ComboBox/ComboBoxPG
 */

var ComboBox = Control.extend({
   _template: template,
   _isOpen: false,
   _notifyHandler: tmplNotify,

   _beforeMount: function (options) {
      this._onClose = _private.popupVisibilityChanged.bind(this, false);
      this._onOpen = _private.popupVisibilityChanged.bind(this, true);
      this._placeholder = options.placeholder;
      this._value = options.value;
      this._setText = this._setText.bind(this);
   },

   _afterMount: function () {
      this._corner = {
         vertical: 'bottom'
      };
      this._width = _private.getContainerNode(this._container).offsetWidth;
      this._forceUpdate();
   },

   _beforeUpdate: function () {
      var containerNode = _private.getContainerNode(this._container);

      if (this._width !== containerNode.offsetWidth) {
         this._width = containerNode.offsetWidth;
      }
   },

   _selectedItemsChangedHandler: function (event, selectedItems) {
      var key = getPropValue(selectedItems[0], this._options.keyProperty);
      this._setText(selectedItems);
      this._notify('valueChanged', [this._value]);
      this._notify('selectedKeyChanged', [key]);
      this._isOpen = false;
   },

   _setText: function (selectedItems) {
      this._isEmptyItem = getPropValue(selectedItems[0], this._options.keyProperty) === null || selectedItems[0] === null;
      if (this._isEmptyItem) {
         this._value = '';
         this._placeholder = dropdownUtils.prepareEmpty(this._options.emptyText);
      } else {
         this._value = getPropValue(selectedItems[0], this._options.displayProperty) || '';
         this._placeholder = this._options.placeholder;
      }
   }

});

ComboBox.getDefaultOptions = function () {
   return {
      placeholder: rk('Выберите...')
   };
};

ComboBox._private = _private;

ComboBox._theme = ['Controls/dropdown'];

export = ComboBox;
