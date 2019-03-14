define('Controls/Input/Dropdown',
   [
      'Core/Control',
      'wml!Controls/Input/Dropdown/Dropdown',
      'wml!Controls/Input/Dropdown/resources/defaultContentTemplate',
      'Types/util',
      'Types/chain',
      'Controls/Dropdown/Util',
      'Core/helpers/Object/isEqual',
      'css!theme?Controls/Input/Dropdown/Dropdown'
   ],
   function(Control, template, defaultContentTemplate, Utils, chain, dropdownUtils, isEqual) {
      /**
       * Control that shows list of options. In the default state, the list is collapsed, showing only one choice.
       * The full list of options is displayed when you click on the control.
       * <a href="/materials/demo-ws4-input-dropdown">Demo-example</a>.
       * @class Controls/Input/Dropdown
       * @extends Core/Control
       * @mixes Controls/interface/ISource
       * @mixes Controls/List/interface/IHierarchy
       * @mixes Controls/interface/IFilter
       * @mixes Controls/interface/INavigation
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/interface/IMultiSelectable
       * @mixes Controls/Dropdown/interface/IFooterTemplate
       * @mixes Controls/Dropdown/interface/IHeaderTemplate
       * @mixes Controls/Input/interface/IDropdownEmptyText
       * @mixes Controls/Input/interface/IInputDropdown
       * @mixes Controls/interface/IDropdown
       * @mixes Controls/interface/IInputDropdown
       * @mixes Controls/interface/ITextValue
       * @control
       * @public
       * @author Золотова Элина
       * @category Input
       * @demo Controls-demo/Input/Dropdown/DropdownPG
       */

      /**
       * @name Controls/Input/Dropdown#contentTemplate
       * @cfg {Function} Template that will be render calling element.
       * @remark
       * To determine the template, you should call the base template "wml!Controls/Input/Dropdown/resources/defaultContentTemplate".
       * The template should be placed in the component using the <ws:partial> tag with the template attribute.
       * You can redefine content using the contentTemplate option.
       * By default, the base template wml!Controls/Input/Dropdown/resources/defaultContentTemplate will display only text.
       * To display the icon and text, use the "wml!Controls/Input/Dropdown/resources/defaultContentTemplateWithIcon" template.
       * @example
       * Display text and icon
       *
       * WML:
       * <pre>
       * <Controls.Input.Dropdown
       *       bind:selectedKeys="_selectedKeys"
       *       keyProperty="id"
       *       displayProperty="title"
       *       source="{{_source)}}"
       *       contentTemplate="wml!Controls/Input/Dropdown/resources/defaultContentTemplateWithIcon">
       * </Controls.Input.Dropdown>
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


      'use strict';

      var getPropValue = Utils.object.getPropertyValue.bind(Utils);

      var _private = {
         getSelectedKeys: function(items, keyProperty) {
            var keys = [];
            chain.factory(items).each(function(item) {
               keys.push(getPropValue(item, keyProperty));
            });
            return keys;
         }
      };

      var DropdownList = Control.extend({
         _template: template,
         _defaultContentTemplate: defaultContentTemplate,
         _text: '',

         _beforeMount: function() {
            this._setText = this._setText.bind(this);
         },

         _afterMount: function(options) {
            /* Updating the text in the header.
            Since the text is set after loading source, the caption stored old value */
            if (options.showHeader && options.caption !== this._text) {
               this._forceUpdate();
            }
         },

         _afterUpdate: function(newOptions) {
            if (!isEqual(newOptions.selectedKeys, this._options.selectedKeys)) {
               this._notify('textValueChanged', [this._text]);
            }
         },

         _selectedItemsChangedHandler: function(event, items) {
            return this._notify('selectedKeysChanged', [_private.getSelectedKeys(items, this._options.keyProperty)]);
         },

         _setText: function(items) {
            if (items.length) {
               this._item = items[0];
               this._isEmptyItem = this._options.emptyText && (getPropValue(items[0], this._options.keyProperty) === null || items[0] === null);
               if (this._isEmptyItem) {
                  this._text = dropdownUtils.prepareEmpty(this._options.emptyText);
                  this._icon = null;
               } else {
                  this._text = getPropValue(items[0], this._options.displayProperty);
                  this._icon = getPropValue(items[0], 'icon');
               }
               if (items.length > 1) {
                  this._text += ', и еще ' + (items.length - 1);
               }
            }
         }
      });

      return DropdownList;
   });
