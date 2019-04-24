import Control = require('Core/Control');
import template = require('wml!Controls/_dropdown/Input/Input');
import defaultContentTemplate = require('wml!Controls/_dropdown/Input/resources/defaultContentTemplate');
import Utils = require('Types/util');
import chain = require('Types/chain');
import dropdownUtils = require('Controls/_dropdown/Util');
import isEqual = require('Core/helpers/Object/isEqual');

var getPropValue = Utils.object.getPropertyValue.bind(Utils);

var _private = {
   getSelectedKeys: function (items, keyProperty) {
      var keys = [];
      chain.factory(items).each(function (item) {
         keys.push(getPropValue(item, keyProperty));
      });
      return keys;
   },

   getTooltip: function (items, displayProperty) {
      var tooltips = [];
      chain.factory(items).each(function (item) {
         tooltips.push(getPropValue(item, displayProperty));
      });
      return tooltips.join(', ');
   }
};

/**
 * Control that shows list of options. In the default state, the list is collapsed, showing only one choice.
 * The full list of options is displayed when you click on the control.
 * <a href="/materials/demo-ws4-input-dropdown">Demo-example</a>.
 *
 * To work with single selectedKeys option you can use control with {@link Controls/Container/Adapter/SelectedKey}.
 * @class Controls/_dropdown/Input
 * @extends Core/Control
 * @mixes Controls/interface/ISource
 * @mixes Controls/List/interface/IHierarchy
 * @mixes Controls/interface/IFilter
 * @mixes Controls/interface/INavigation
 * @mixes Controls/Input/interface/IValidation
 * @mixes Controls/interface/IMultiSelectable
 * @mixes Controls/_dropdown/interface/IFooterTemplate
 * @mixes Controls/_dropdown/interface/IHeaderTemplate
 * @mixes Controls/interface/ISelectorDialog
 * @mixes Controls/Input/interface/IDropdownEmptyText
 * @mixes Controls/Input/interface/IInputDropdown
 * @mixes Controls/interface/IDropdown
 * @mixes Controls/_dropdown/interface/IGrouped
 * @mixes Controls/interface/IInputDropdown
 * @mixes Controls/interface/ITextValue
 * @control
 * @public
 * @author Золотова Э.Е.
 * @category Input
 * @demo Controls-demo/Input/_dropdown/DropdownPG
 */

/**
 * @name Controls/_dropdown/Input#contentTemplate
 * @cfg {Function} Template that will be render calling element.
 * @remark
 * To determine the template, you should call the base template "wml!Controls/_dropdown/Input/resources/defaultContentTemplate".
 * The template should be placed in the component using the <ws:partial> tag with the template attribute.
 * You can redefine content using the contentTemplate option.
 * By default, the base template wml!Controls/_dropdown/Input/resources/defaultContentTemplate will display only text.
 * To display the icon and text, use the "wml!Controls/_dropdown/Input/resources/defaultContentTemplateWithIcon" template.
 * @example
 * Display text and icon
 *
 * WML:
 * <pre>
 * <Controls.dropdown:Input
 *       bind:selectedKeys="_selectedKeys"
 *       keyProperty="id"
 *       displayProperty="title"
 *       source="{{_source)}}"
 *       contentTemplate="wml!Controls/_dropdown/Input/resources/defaultContentTemplateWithIcon">
 * </Controls.dropdown:Input>
 * </pre>
 * JS:
 * <pre>
 * this._source = new Memory({
 *    idProperty: 'id',
 *    data: [
 *       {id: 1, title: 'Name', icon: 'icon-small icon-TrendUp'},
 *       {id: 2, title: 'Date of change', icon: 'icon-small icon-TrendDown'}
 *    ]
 * });
 * </pre>
 */

/**
 * @name Controls/_dropdown/Input#multiSelect
 * @cfg {Boolean} Determines whether multiple selection is set.
 * @example
 * Multiple selection is set.
 * WML:
 * <pre>
 * <Controls.dropdown:Input
 *       bind:selectedKeys="_selectedKeys"
 *       keyProperty="id"
 *       displayProperty="title"
 *       source="{{_source)}}"
 *       multiSelect="{{true}}">
 * </Controls.dropdown:Input>
 * </pre>
 * JS:
 * <pre>
 * this._source = new Memory({
 *    idProperty: 'id',
 *    data: [
 *       {id: 1, title: 'Yaroslavl'},
 *       {id: 2, title: 'Moscow'},
 *       {id: 3, title: 'St-Petersburg'}
 *    ]
 * });
 * this._selectedKeys = [1, 3];
 * </pre>
 */

var Input = Control.extend({
   _template: template,
   _defaultContentTemplate: defaultContentTemplate,
   _text: '',

   _beforeMount: function () {
      this._setText = this._setText.bind(this);
   },

   _afterMount: function (options) {
      /* Updating the text in the header.
      Since the text is set after loading source, the caption stored old value */
      if (options.showHeader && options.caption !== this._text) {
         this._forceUpdate();
      }
   },

   _afterUpdate: function (newOptions) {
      if (!isEqual(newOptions.selectedKeys, this._options.selectedKeys)) {
         this._notify('textValueChanged', [this._text]);
      }
   },

   _selectedItemsChangedHandler: function (event, items) {
      return this._notify('selectedKeysChanged', [_private.getSelectedKeys(items, this._options.keyProperty)]);
   },

   _selectedKeysChangedHandler: function (event, selectedKeys) {
      return this._notify('selectedKeysChanged', [selectedKeys]);
   },

   _setText: function (items) {
      if (items.length) {
         this._item = items[0];
         this._isEmptyItem = this._options.emptyText && (getPropValue(items[0], this._options.keyProperty) === null || !items[0]);
         if (this._isEmptyItem) {
            this._text = dropdownUtils.prepareEmpty(this._options.emptyText);
            this._icon = null;
         } else {
            this._text = getPropValue(items[0], this._options.displayProperty);
            this._icon = getPropValue(items[0], 'icon');
         }
         if (items.length > 1) {
            this._hasMoreText = ', ' + rk('еще ') + (items.length - 1);
         } else {
            this._hasMoreText = '';
         }
         this._tooltip = _private.getTooltip(items, this._options.displayProperty);
      }
   }
});

Input._theme = ['Controls/_dropdown/Input/Input'];

export = Input;