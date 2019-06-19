import Control = require('Core/Control');
import template = require('wml!Controls/_filterPopup/Panel/Dropdown/Dropdown');
import 'css!theme?Controls/filterPopup';
   /**
    * Input for selection from the list of options with cross.
    *
    * To work with single selectedKeys option you can use control with {@link Controls/source:SelectedKey}.
    *
    * @class Controls/_filterPopup/Panel/Dropdown
    * @extends Controls/_dropdown/Input
    * @control
    * @public
    * @author Герасимов А.М.
    */

   /**
    * @name Controls/_filterPopup/Panel/Dropdown#showCross
    * @cfg {Boolean} Show reset button near dropdown. If you click on this button, dropdown will hide.
    * @default false
    * @example
    * <pre>
    *     <Controls.filterPopup:Dropdown showCross="{{true}}"/>
    * </pre>
    */

   const _private = {
      dataLoadCallback: function(items) {
         this._items = items;
         if (this._options.dataLoadCallback) {
             this._options.dataLoadCallback(items);
         }
      }
   };

   var FilterDropdown = Control.extend({
      _template: template,
      _items: null,

      _beforeMount: function() {
         this._dataLoadCallbackHandler = _private.dataLoadCallback.bind(this);
      },

      _selectedKeysChangedHandler: function(event, keys:Array):Boolean|undefined {
         return this._notify('selectedKeysChanged', [keys]);
      },

      _textValueChangedHandler: function(event, text) {
         let isEmptyItemSelected = this._options.selectedKeys[0] === null && this._options.emptyText,
             isFirstItemSelected = this._items && this._items.getIndexByValue(this._options.keyProperty, this._options.selectedKeys) === 0;
         if (isEmptyItemSelected || isFirstItemSelected) {
            this._notify('textValueChanged', ['']);
         } else {
            this._notify('textValueChanged', [text]);
         }
      },

      _resetHandler: function() {
         this._notify('visibilityChanged', [false]);
      }

   });

   FilterDropdown.getDefaultOptions = function() {
      return {
         displayProperty: 'title'
      };
   };

   FilterDropdown._private = _private;

   export = FilterDropdown;

