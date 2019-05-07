import Control = require('Core/Control');
import template = require('wml!Controls/_filterPopup/Panel/Dropdown/Dropdown');
import 'css!theme?Controls/filterPopup';
   /**
    * Input for selection from the list of options with cross.
    *
    * To work with single selectedKeys option you can use control with {@link Controls/Container/Adapter/SelectedKey}.
    *
    * @name Controls/_filterPopup/Panel/Dropdown#showCross
    * @cfg {Boolean} Show reset button near dropdown. If you click on this button, dropdown will hide.
    * @default false
    * @example
    * <pre>
    *     <Controls.filterPopup:Dropdown showCross="{{true}}"/>
    * </pre>
    *
    * @class Controls/_filterPopup/Panel/Dropdown
    * @extends Control/_dropdown/Input
    * @mixes Controls/interface/ISource
    * @mixes Controls/_list/interface/IHierarchy
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/INavigation
    * @mixes Controls/Input/interface/IValidation
    * @mixes Controls/interface/IMultiSelectable
    * @mixes Controls/_dropdown/interface/IFooterTemplate
    * @mixes Controls/_dropdown/interface/IHeaderTemplate
    * @mixes Controls/interface/ISelectorDialog
    * @mixes Controls/interface/IDropdownEmptyText
    * @mixes Controls/Input/interface/IInputDropdown
    * @mixes Controls/interface/IDropdown
    * @mixes Controls/_dropdown/interface/IGrouped
    * @mixes Controls/interface/IInputDropdown
    * @mixes Controls/interface/ITextValue
    * @control
    * @public
    * @author Герасимов А.М.
    */

   var FilterDropdown = Control.extend({
      _template: template,

      _selectedKeysChangedHandler: function(event, keys:Array):Boolean|undefined {
         return this._notify('selectedKeysChanged', [keys]);
      },

      _textValueChangedHandler: function(event, text) {
         this._notify('textValueChanged', [text]);
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

   export = FilterDropdown;

